"use client";

import { useState, type FormEvent, type JSX } from "react";
import { ApiRequestError, createContact } from "@/lib/api/client";
import { RecaptchaNotice } from "@/components/recaptcha/recaptcha-notice";
import { useRecaptchaToken } from "@/components/recaptcha/use-recaptcha-token";
import { FadeSwap } from "@/components/motion/fade-swap";
import { ContactSphere } from "@/components/ui/contact-sphere";
import { PrivacyConsent } from "@/components/legal/privacy-consent";
import { useSite } from "@/components/shell/site-provider";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/config";
import { cn } from "@/lib/utils";
import {
  digitsOnly,
  validateContactFields,
  type ContactFieldKey,
} from "@/lib/validation/fields";
import { fieldMessagesByLocale } from "@/lib/validation/field-messages";

const copy = {
  en: {
    headline: "Send a message.",
    sub: "Tell me about your idea and budget. I'll reply personally.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Send message",
    submitting: "Sending…",
    success: "Thanks, your message was received. We'll get back to you soon.",
    rateLimited:
      "Too many messages were sent in a short period. Please wait a few minutes and try again.",
    recaptchaUnavailable:
      "We couldn't verify this request. Reload the page and try again.",
    recaptchaRejected:
      "We couldn't verify this request. Please try again in a few minutes.",
    privacyRequired:
      "Accept the personal data policy to continue.",
    another: "Send another message",
    sphereLabel: "contact.",
    fields: fieldMessagesByLocale.en,
  },
  es: {
    headline: "Envía un mensaje.",
    sub: "Cuéntame tu idea y presupuesto. Te respondo personalmente.",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    message: "Mensaje",
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    success: "Gracias, recibimos tu mensaje. Te responderemos pronto.",
    rateLimited:
      "Se enviaron demasiados mensajes en poco tiempo. Espera unos minutos e inténtalo de nuevo.",
    recaptchaUnavailable:
      "No pudimos verificar la solicitud. Recarga la página e inténtalo de nuevo.",
    recaptchaRejected:
      "No pudimos verificar la solicitud. Inténtalo de nuevo en unos minutos.",
    privacyRequired:
      "Acepta la política de tratamiento de datos personales para continuar.",
    another: "Enviar otro mensaje",
    sphereLabel: "contacto",
    fields: fieldMessagesByLocale.es,
  },
} as const;

export function Contact(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const { getRecaptchaToken } = useRecaptchaToken();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactFieldKey, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function clearFieldError(field: ContactFieldKey): void {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (submitting) return;

    const nextFieldErrors = validateContactFields(
      { name, email, phone, message },
      t.fields,
    );
    const nextPrivacyError = privacyAccepted ? null : t.privacyRequired;
    setFieldErrors(nextFieldErrors);
    setPrivacyError(nextPrivacyError);
    if (Object.keys(nextFieldErrors).length > 0 || nextPrivacyError) {
      setError(null);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.contact);
      if (!recaptchaToken) {
        setError(t.recaptchaUnavailable);
        return;
      }

      const result = await createContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        recaptchaToken,
        privacyConsent: true,
      });
      setSuccessMessage(result.message || t.success);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setPrivacyAccepted(false);
      setPrivacyError(null);
      setFieldErrors({});
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        if (err.status === 429) {
          setError(t.rateLimited);
        } else if (err.status === 403) {
          setError(t.recaptchaRejected);
        } else if (err.status === 400 && err.body.details) {
          const fromApi: Partial<Record<ContactFieldKey, string>> = {};
          for (const key of ["name", "email", "phone", "message"] as const) {
            const messages = err.body.details[key];
            if (messages?.[0]) fromApi[key] = messages[0];
          }
          if (Object.keys(fromApi).length > 0) {
            setFieldErrors(fromApi);
            setError(null);
          } else if (err.body.details.privacyConsent) {
            setPrivacyError(t.privacyRequired);
            setError(null);
          } else if (err.body.details.recaptchaToken) {
            setError(t.recaptchaUnavailable);
          } else {
            setError(err.body.message);
          }
        } else {
          setError(err.body.message);
        }
      } else {
        setError("Unable to send your message. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative flex min-h-svh scroll-mt-24 items-center overflow-hidden bg-invert-bg py-[clamp(3rem,6vh,5rem)] text-invert-fg"
      aria-labelledby="contact-heading"
    >
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-6">
        <div className="relative z-10 min-w-0">
          <h2
            id="contact-heading"
            className="max-w-2xl font-sans text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold leading-[1.05] tracking-tight"
          >
            {t.headline}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-invert-fg/65 md:text-base">
            {t.sub}
          </p>

          <FadeSwap
            className="mt-6 max-w-xl"
            showSecondary={Boolean(successMessage)}
            primary={
              <form className="grid gap-3" noValidate onSubmit={onSubmit}>
                <Field
                  label={t.name}
                  value={name}
                  error={fieldErrors.name}
                  errorId="contact-name-error"
                  autoComplete="name"
                  onChange={(value) => {
                    setName(value);
                    clearFieldError("name");
                  }}
                />
                <Field
                  label={t.email}
                  value={email}
                  error={fieldErrors.email}
                  errorId="contact-email-error"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  onChange={(value) => {
                    setEmail(value);
                    clearFieldError("email");
                  }}
                />
                <Field
                  label={t.phone}
                  value={phone}
                  error={fieldErrors.phone}
                  errorId="contact-phone-error"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  onChange={(value) => {
                    setPhone(digitsOnly(value));
                    clearFieldError("phone");
                  }}
                />
                <label className="block">
                  <span
                    className={cn(
                      "text-[0.65rem] uppercase tracking-[0.12em]",
                      fieldErrors.message ? "text-paper" : "text-invert-fg/45",
                    )}
                  >
                    {t.message}
                  </span>
                  <textarea
                    value={message}
                    rows={3}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={
                      fieldErrors.message ? "contact-message-error" : undefined
                    }
                    onChange={(event) => {
                      setMessage(event.target.value);
                      clearFieldError("message");
                    }}
                    className={cn(
                      "mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors",
                      fieldErrors.message
                        ? "border-paper bg-paper text-ink focus:border-paper"
                        : "border-invert-fg/20 bg-transparent focus:border-invert-fg/50",
                    )}
                  />
                  {fieldErrors.message ? (
                    <p
                      id="contact-message-error"
                      className="mt-1.5 text-sm text-paper"
                      role="alert"
                    >
                      {fieldErrors.message}
                    </p>
                  ) : null}
                </label>

                {error ? (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}

                <PrivacyConsent
                  inputId="contact-privacy-consent"
                  errorId="contact-privacy-error"
                  tone="invert"
                  checked={privacyAccepted}
                  error={privacyError ?? undefined}
                  onCheckedChange={(value) => {
                    setPrivacyAccepted(value);
                    if (value) setPrivacyError(null);
                  }}
                />

                <button
                  type="submit"
                  disabled={submitting || !privacyAccepted}
                  className="mt-1 inline-flex h-10 items-center justify-center rounded-full bg-invert-fg px-6 text-sm font-medium text-invert-bg transition-opacity active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? t.submitting : t.submit}
                </button>
                <RecaptchaNotice className="text-invert-fg/40" />
              </form>
            }
            secondary={
              <div className="border-t border-invert-fg/15 pt-6">
                <p className="text-base leading-relaxed text-invert-fg/85">
                  {successMessage}
                </p>
                <button
                  type="button"
                  className="mt-4 text-sm text-invert-fg/55 underline underline-offset-4 transition-colors hover:text-invert-fg"
                  onClick={() => setSuccessMessage(null)}
                >
                  {t.another}
                </button>
              </div>
            }
          />
        </div>

        <div className="pointer-events-none relative hidden justify-center sm:flex lg:justify-end">
          <ContactSphere label={t.sphereLabel} />
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputMode,
  errorId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "numeric" | "text";
  errorId: string;
}): JSX.Element {
  const invalid = Boolean(error);

  return (
    <label className="block">
      <span
        className={cn(
          "text-[0.65rem] uppercase tracking-[0.12em]",
          invalid ? "text-paper" : "text-invert-fg/45",
        )}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors",
          invalid
            ? "border-paper bg-paper text-ink focus:border-paper"
            : "border-invert-fg/20 bg-transparent focus:border-invert-fg/50",
        )}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-paper" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}
