import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Field, inputClassName } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Escribe tu nombre"),
  email: z.string().email("Escribe un correo válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .string()
      .regex(/^[+]?[\d\s().-]{7,}$/, "Teléfono inválido")
      .optional()
  ),
});

type FormValues = z.infer<typeof schema>;

export interface CredentialsData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export function CredentialsStep({ onNext }: { onNext: (data: CredentialsData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  function onSubmit(values: FormValues) {
    onNext({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Nombre" error={errors.name?.message}>
        <input className={inputClassName} placeholder="Tu nombre completo" {...register("name")} />
      </Field>

      <Field label="Correo electrónico" error={errors.email?.message}>
        <input
          type="email"
          className={inputClassName}
          placeholder="tucorreo@ejemplo.com"
          {...register("email")}
        />
      </Field>

      <Field label="Contraseña" error={errors.password?.message}>
        <PasswordInput placeholder="Mínimo 8 caracteres" {...register("password")} />
      </Field>

      <Field label="Teléfono (opcional)" error={errors.phone?.message}>
        <input
          type="tel"
          className={inputClassName}
          placeholder="+52 664 123 4567"
          {...register("phone")}
        />
      </Field>

      <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
        Continuar
      </Button>
    </form>
  );
}
