import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { CredentialsStep, type CredentialsData } from "@/components/auth/CredentialsStep";
import { CityStep } from "@/components/auth/CityStep";
import { InterestsStep } from "@/components/auth/InterestsStep";
import { Button } from "@/components/ui/Button";
import { CITY_LABELS, type BorderCity, type BusinessCategory } from "@/types/business";

const STEPS = ["Cuenta", "Ciudad", "Intereses", "Listo"];

export function RegisterPage() {
  const { register: registerUser, setInterests } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [credentials, setCredentials] = useState<CredentialsData | null>(null);
  const [city, setCity] = useState<BorderCity | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish(interests: BusinessCategory[]) {
    if (!credentials || !city) return;
    setSubmitting(true);
    try {
      await registerUser({ ...credentials, city });
      if (interests.length > 0) await setInterests(interests);
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Únete a La Frontera en pocos pasos.">
      <div className="mb-6">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {step === 0 && (
        <CredentialsStep
          onNext={(data) => {
            setCredentials(data);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <CityStep
          onBack={() => setStep(0)}
          onNext={(c) => {
            setCity(c);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <InterestsStep onBack={() => setStep(1)} submitting={submitting} onNext={handleFinish} />
      )}

      {step === 3 && credentials && city && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-verde text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              ¡Listo, {credentials.name.split(" ")[0]}!
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              Bienvenido a La Frontera en {CITY_LABELS[city]}.
            </p>
          </div>
          <Button size="lg" className="w-full" onClick={() => navigate("/")}>
            Explorar la frontera
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
