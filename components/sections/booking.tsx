"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type JSX,
} from "react";
import {
  BOOKING_HORIZON_DAYS,
  BOOKING_TIMEZONE,
  MEETING_DURATION_MINUTES,
} from "@/lib/booking/config";
import {
  ApiRequestError,
  createMeeting,
  fetchAvailability,
} from "@/lib/api/client";
import { RecaptchaNotice } from "@/components/recaptcha/recaptcha-notice";
import { useRecaptchaToken } from "@/components/recaptcha/use-recaptcha-token";
import type { AvailabilitySlot } from "@/lib/booking/availability";
import { FadeSwap } from "@/components/motion/fade-swap";
import { PrivacyConsent } from "@/components/legal/privacy-consent";
import { useSite, type Locale } from "@/components/shell/site-provider";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/config";
import { cn } from "@/lib/utils";
import {
  digitsOnly,
  validatePersonFields,
  type PersonFieldKey,
} from "@/lib/validation/fields";
import { fieldMessagesByLocale } from "@/lib/validation/field-messages";

const copy = {
  en: {
    headline: "Pick a time that works.",
    sub: `30-minute intro`,
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const,
    timesLabel: "Available times",
    noSlots: "No open slots this day. Try another date.",
    rateLimited:
      "Too many booking attempts were made in a short period. Please wait a few minutes and try again.",
    availabilityRateLimited:
      "Please wait a moment before loading more times.",
    recaptchaUnavailable:
      "We couldn't verify this request. Reload the page and try again.",
    recaptchaRejected:
      "We couldn't verify this request. Please try again in a few minutes.",
    privacyRequired:
      "Accept the personal data policy to continue.",
    slotTaken:
      "That time was just taken. Please choose another available time.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    submit: "Request meeting",
    submitting: "Sending…",
    success:
      "Your meeting request was received. We'll contact you shortly to confirm the time.",
    back: "Book another time",
    formTitle: "Your details",
    selected: "Selected",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    fields: fieldMessagesByLocale.en,
  },
  es: {
    headline: "Elige un horario.",
    sub: `Intro de 30 minutos`,
    weekdays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"] as const,
    timesLabel: "Horarios disponibles",
    noSlots: "No hay horarios este día. Prueba otra fecha.",
    rateLimited:
      "Se hicieron demasiados intentos en poco tiempo. Espera unos minutos e inténtalo de nuevo.",
    availabilityRateLimited:
      "Espera un momento antes de cargar más horarios.",
    recaptchaUnavailable:
      "No pudimos verificar la solicitud. Recarga la página e inténtalo de nuevo.",
    recaptchaRejected:
      "No pudimos verificar la solicitud. Inténtalo de nuevo en unos minutos.",
    privacyRequired:
      "Acepta la política de tratamiento de datos personales para continuar.",
    slotTaken:
      "Ese horario acaba de ocuparse. Elige otro disponible.",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    submit: "Solicitar reunión",
    submitting: "Enviando…",
    success:
      "Recibimos tu solicitud. Te contactaremos pronto para confirmar el horario.",
    back: "Agendar otro horario",
    formTitle: "Tus datos",
    selected: "Seleccionado",
    prevMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    fields: fieldMessagesByLocale.es,
  },
} as const;

function formatBogotaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + days, 17, 0, 0));
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(utc);
}

function parseDateParts(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function toDateString(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0, 12, 0, 0)).getUTCDate();
}

/** Monday = 0 … Sunday = 6 */
function mondayIndex(year: number, month: number, day: number): number {
  const js = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
  return js === 0 ? 6 : js - 1;
}

function formatSlotLabel(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: BOOKING_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function formatSelectedDay(date: string, locale: Locale): string {
  const { year, month, day } = parseDateParts(date);
  const utc = new Date(Date.UTC(year, month - 1, day, 17, 0, 0));
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(utc);
}

function formatMonthTitle(year: number, month: number, locale: Locale): string {
  const utc = new Date(Date.UTC(year, month - 1, 1, 17, 0, 0));
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: BOOKING_TIMEZONE,
    month: "long",
    year: "numeric",
  }).format(utc);
}

interface MonthCell {
  date: string | null;
  bookable: boolean;
}

function buildMonthGrid(
  year: number,
  month: number,
  minDate: string,
  maxDate: string,
): MonthCell[] {
  const total = daysInMonth(year, month);
  const offset = mondayIndex(year, month, 1);
  const cells: MonthCell[] = [];

  for (let i = 0; i < offset; i += 1) {
    cells.push({ date: null, bookable: false });
  }

  for (let day = 1; day <= total; day += 1) {
    const date = toDateString(year, month, day);
    cells.push({
      date,
      bookable: date >= minDate && date <= maxDate,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, bookable: false });
  }

  return cells;
}

export function Booking(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const { getRecaptchaToken } = useRecaptchaToken();

  const today = useMemo(() => formatBogotaToday(), []);
  const maxDate = useMemo(
    () => addDays(today, BOOKING_HORIZON_DAYS),
    [today],
  );
  const todayParts = parseDateParts(today);

  const [viewYear, setViewYear] = useState(todayParts.year);
  const [viewMonth, setViewMonth] = useState(todayParts.month);
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<PersonFieldKey, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearFieldError(field: PersonFieldKey): void {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  const cells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth, today, maxDate),
    [viewYear, viewMonth, today, maxDate],
  );

  const canGoPrev = toDateString(viewYear, viewMonth, 1) > toDateString(
    todayParts.year,
    todayParts.month,
    1,
  );
  const maxParts = parseDateParts(maxDate);
  const canGoNext =
    viewYear < maxParts.year ||
    (viewYear === maxParts.year && viewMonth < maxParts.month);

  useEffect(() => {
    let cancelled = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSelectedSlot(null);
    setError(null);

    debounceRef.current = setTimeout(() => {
      setLoadingSlots(true);
      fetchAvailability(date)
        .then((result) => {
          if (!cancelled) setSlots(result.slots);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setSlots([]);
          if (err instanceof ApiRequestError && err.status === 429) {
            setError(t.availabilityRateLimited);
            return;
          }
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load availability.",
          );
        })
        .finally(() => {
          if (!cancelled) setLoadingSlots(false);
        });
    }, 200);

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [date, t.availabilityRateLimited]);

  async function refreshSlots(): Promise<void> {
    const result = await fetchAvailability(date);
    setSlots(result.slots);
  }

  function shiftMonth(delta: number): void {
    let month = viewMonth + delta;
    let year = viewYear;
    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    setViewYear(year);
    setViewMonth(month);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!selectedSlot || submitting) return;

    const nextFieldErrors = validatePersonFields(
      { name, email, phone },
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
      const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.meeting);
      if (!recaptchaToken) {
        setError(t.recaptchaUnavailable);
        return;
      }

      const result = await createMeeting({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        startAt: selectedSlot.startAt,
        recaptchaToken,
        privacyConsent: true,
      });
      const bookedStart = selectedSlot.startAt;
      setSlots((current) =>
        current.map((slot) =>
          slot.startAt === bookedStart
            ? { ...slot, available: false }
            : slot,
        ),
      );
      setSuccessMessage(result.message || t.success);
      setName("");
      setEmail("");
      setPhone("");
      setPrivacyAccepted(false);
      setPrivacyError(null);
      setFieldErrors({});
      try {
        await refreshSlots();
      } catch {
        /* keep optimistic unavailable state */
      }
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        if (err.status === 409) {
          setError(t.slotTaken);
          setSelectedSlot(null);
          try {
            await refreshSlots();
          } catch {
            /* ignore */
          }
        } else if (err.status === 429) {
          setError(t.rateLimited);
        } else if (err.status === 403) {
          setError(t.recaptchaRejected);
        } else if (err.status === 400 && err.body.details) {
          const fromApi: Partial<Record<PersonFieldKey, string>> = {};
          for (const key of ["name", "email", "phone"] as const) {
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
        setError("Unable to book that meeting. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const availableSlots = slots.filter((slot) => slot.available);

  return (
    <section
      id="book"
      className="relative scroll-mt-24 py-[clamp(5rem,12vw,10rem)]"
      aria-labelledby="booking-heading"
    >
      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <h2
          id="booking-heading"
          className="max-w-2xl font-sans text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-ink"
        >
          {t.headline}
        </h2>
        <p className="mt-4 max-w-xl text-base text-ink-2">
          {t.sub.replace("30", String(MEETING_DURATION_MINUTES))}
        </p>

        <FadeSwap
          className="mt-10"
          showSecondary={Boolean(successMessage)}
          primary={
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
            <div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="font-sans text-lg font-medium tracking-tight text-ink capitalize">
                  {formatMonthTitle(viewYear, viewMonth, locale)}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={t.prevMonth}
                    disabled={!canGoPrev}
                    onClick={() => shiftMonth(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label={t.nextMonth}
                    disabled={!canGoNext}
                    onClick={() => shiftMonth(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {t.weekdays.map((day) => (
                  <div
                    key={day}
                    className="pb-2 text-[0.65rem] uppercase tracking-[0.12em] text-ink-3"
                  >
                    {day}
                  </div>
                ))}
                {cells.map((cell, index) => {
                  if (!cell.date) {
                    return <div key={`empty-${index}`} className="h-10" />;
                  }

                  const dayNum = parseDateParts(cell.date).day;
                  const selected = cell.date === date;
                  const isToday = cell.date === today;

                  return (
                    <button
                      key={cell.date}
                      type="button"
                      disabled={!cell.bookable}
                      onClick={() => {
                        setDate(cell.date!);
                        setSelectedSlot(null);
                        setError(null);
                      }}
                      className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                        !cell.bookable
                          ? "cursor-not-allowed text-ink-3/40"
                          : selected
                            ? "bg-ink font-medium text-paper"
                            : "text-ink hover:bg-paper-2"
                      }`}
                    >
                      {dayNum}
                      {isToday && !selected ? (
                        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink/70" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-3">
                {t.timesLabel}
              </p>
              <p className="mt-1 text-sm text-ink-2 capitalize">
                {formatSelectedDay(date, locale)}
              </p>

              <div className="mt-4 max-h-[16rem] overflow-y-auto pr-1">
                {loadingSlots ? (
                  <p className="text-sm text-ink-3">…</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-ink-3">{t.noSlots}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {availableSlots.map((slot) => {
                      const selected = selectedSlot?.startAt === slot.startAt;
                      return (
                        <button
                          key={slot.startAt}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setError(null);
                          }}
                          className={`rounded-full border px-3 py-2.5 text-sm transition-colors active:scale-[0.97] ${
                            selected
                              ? "border-ink bg-ink text-paper"
                              : "border-line text-ink hover:border-ink/40"
                          }`}
                        >
                          {formatSlotLabel(slot.startAt, locale)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedSlot ? (
                <form
                  className="mt-8 space-y-4 border-t border-line pt-8"
                  noValidate
                  onSubmit={onSubmit}
                >
                    <h3 className="font-sans text-lg font-medium tracking-tight text-ink">
                      {t.formTitle}
                    </h3>
                    <p className="text-sm text-ink-2">
                      {t.selected}: {formatSelectedDay(date, locale)} {" "}
                      {formatSlotLabel(selectedSlot.startAt, locale)}
                    </p>
                    <Field
                      label={t.name}
                      value={name}
                      error={fieldErrors.name}
                      errorId="booking-name-error"
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
                      errorId="booking-email-error"
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
                      errorId="booking-phone-error"
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      onChange={(value) => {
                        setPhone(digitsOnly(value));
                        clearFieldError("phone");
                      }}
                    />

                    {error ? (
                      <p className="text-sm text-red-500" role="alert">
                        {error}
                      </p>
                    ) : null}

                    <PrivacyConsent
                      inputId="booking-privacy-consent"
                      errorId="booking-privacy-error"
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
                      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-opacity active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[12rem]"
                    >
                      {submitting ? t.submitting : t.submit}
                    </button>
                    <RecaptchaNotice className="text-ink-3" />
                  </form>
              ) : null}

              {!selectedSlot && error ? (
                <p className="mt-4 text-sm text-red-500" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
          }
          secondary={
            <div className="max-w-xl border-t border-line pt-8">
              <p className="text-base leading-relaxed text-ink">
                {successMessage}
              </p>
              <button
                type="button"
                className="mt-4 text-sm text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
                onClick={() => {
                  setSuccessMessage(null);
                  setSelectedSlot(null);
                }}
              >
                {t.back}
              </button>
            </div>
          }
        />
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
    <label className="block max-w-md">
      <span
        className={cn(
          "text-[0.7rem] uppercase tracking-[0.12em]",
          invalid ? "text-invert-bg" : "text-ink-3",
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
          "mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
          invalid
            ? "border-invert-bg bg-invert-bg text-invert-fg focus:border-invert-bg"
            : "border-line bg-transparent text-ink focus:border-ink/40",
        )}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-invert-bg" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}
