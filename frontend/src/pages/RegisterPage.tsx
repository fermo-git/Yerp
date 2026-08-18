import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { CredentialsStep, type CredentialsData } from "@/components/auth/CredentialsStep";
import { CityStep } from "@/components/auth/CityStep";
import { AccountTypeStep, type AccountType } from "@/components/auth/AccountTypeStep";
import { BusinessInfoStep, type BusinessInfoData } from "@/components/auth/BusinessInfoStep";
import { InterestsStep } from "@/components/auth/InterestsStep";
import { Button } from "@/components/ui/Button";
import { CITY_LABELS, type BorderCity, type BusinessCategory } from "@/types/business";

const BASE_STEPS = ["Cuenta", "Ciudad", "Tipo de cuenta", "Intereses", "Listo"];
const OWNER_STEPS = ["Cuenta", "Ciudad", "Tipo de cuenta", "Tu negocio", "Intereses", "Listo"];

export function RegisterPage() {
  const { register: registerUser, setInterests } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [credentials, setCredentials] = useState<CredentialsData | null>(null);
  const [city, setCity] = useState<BorderCity | null>(null);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = accountType === "BUSINESS_OWNER";
  const steps = isOwner ? OWNER_STEPS : BASE_STEPS;

  async function handleFinish(interests: BusinessCategory[]) {
    if (!credentials || !city) return;
    setSubmitting(true);
    try {
      await registerUser({
        ...credentials,
        city,
        role: accountType ?? "USER",
      });
      if (interests.length > 0) await setInterests(interests);
      if (isOwner) {
        // Dueño de negocio: va directo a publicar su negocio con el formulario abierto.
        navigate("/negocios/nuevo", { state: { fromRegister: true } });
      } else {
        setStep(steps.length - 1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const lastStep = steps.length - 1;

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Únete a La Frontera en pocos pasos.">
      <div className="mb-6">
        <StepIndicator steps={steps} current={step} />
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
        <AccountTypeStep
          initial={accountType ?? undefined}
          onBack={() => setStep(1)}
          onNext={(t) => {
            setAccountType(t);
            setStep(3);
          }}
        />
      )}

      {step === 3 && isOwner && (
        <BusinessInfoStep
          initial={businessInfo ?? undefined}
          onBack={() => setStep(2)}
          onNext={(data) => {
            setBusinessInfo(data);
            setStep(4);
          }}
        />
      )}

      {step === 3 && !isOwner && (
        <InterestsStep onBack={() => setStep(2)} submitting={submitting} onNext={handleFinish} />
      )}

      {step === 4 && isOwner && (
        <InterestsStep onBack={() => setStep(3)} submitting={submitting} onNext={handleFinish} />
      )}

      {step === lastStep && !isOwner && credentials && city && (
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
            <p className="mt-1 text-sm text-ink/60">
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