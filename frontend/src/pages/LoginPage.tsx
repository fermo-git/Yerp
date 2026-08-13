import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Field, inputClassName } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Escribe un correo válido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") navigate("/", { replace: true });
  }, [status, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    await login(values);
  }

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Inicia sesión para continuar.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Correo electrónico" error={errors.email?.message}>
          <input
            type="email"
            className={inputClassName}
            placeholder="tucorreo@ejemplo.com"
            {...register("email")}
          />
        </Field>

        <Field label="Contraseña" error={errors.password?.message}>
          <PasswordInput placeholder="Tu contraseña" {...register("password")} />
        </Field>

        <div className="flex justify-end">
          <Link to="#" className="text-xs font-medium text-verde hover:text-verde-deep">
            Olvidé mi contraseña
          </Link>
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Iniciar sesión"}
        </Button>

        <p className="text-center text-sm text-ink-soft">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-verde hover:text-verde-deep">
            Crea una
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
