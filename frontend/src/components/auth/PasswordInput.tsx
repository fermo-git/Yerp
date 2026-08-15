import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { inputClassName } from "@/components/auth/Field";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(inputClassName, "pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/45 transition-colors hover:text-ink"
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l18 18M10.6 10.6a2.8 2.8 0 0 0 3.9 3.9M6.2 6.2C4.4 7.6 3.1 9.6 2.5 12c1.3 3.1 4.5 6.5 9.5 6.5 1.6 0 3-.4 4.2-1M18.9 9.4c.6 1 1 1.8 1.3 2.6-1.3 3.1-4.5 6.5-9.5 6.5-1 0-2-.2-2.9-.5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
              <circle cx="12" cy="12" r="2.8" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
