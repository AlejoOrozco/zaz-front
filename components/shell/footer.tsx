"use client";

import { usePathname } from "next/navigation";
import type { JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import { ZazLogo } from "@/components/brand/zaz-logo";
import { ZazMark } from "@/components/brand/zaz-mark";

const copy = {
  en: {
    tagline: "Your ideas into software.",
    navigate: "Navigate",
    contact: "Contact",
    build: "What I build",
    why: "Why zaz",
    offer: "What I offer",
    founder: "Founder",
    book: "Book a call",
    founded: "Founded by Alejandro Gómez Orozco.",
    copyright: "All rights reserved.",
  },
  es: {
    tagline: "Tus ideas en software.",
    navigate: "Navegar",
    contact: "Contacto",
    build: "Qué construyo",
    why: "Por qué zaz",
    offer: "Lo que ofrezco",
    founder: "Fundador",
    book: "Agenda una llamada",
    founded: "Fundada por Alejandro Gómez Orozco.",
    copyright: "Todos los derechos reservados.",
  },
} as const;

export function Footer(): JSX.Element {
  const { locale, setLocale } = useSite();
  const t = copy[locale];
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const homeHref = (hash: string): string => (isHome ? hash : `/${hash}`);

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-[0.12em] font-sans text-[min(32vw,14rem)] font-semibold tracking-tight text-ink/[0.03] select-none"
        aria-hidden="true"
      >
        <ZazMark className="h-[0.72em] w-auto" />
        <span>zaz</span>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <ZazLogo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
            {t.tagline}
          </p>
        </div>

        <div>
          <p className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
            {t.navigate}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-2">
            <li>
              <a href={homeHref("#why")} className="transition-colors hover:text-ink">
                {t.why}
              </a>
            </li>
            <li>
              <a href={homeHref("#build")} className="transition-colors hover:text-ink">
                {t.build}
              </a>
            </li>
            <li>
              <a href={homeHref("#offer")} className="transition-colors hover:text-ink">
                {t.offer}
              </a>
            </li>
            <li>
              <a href={homeHref("#founder")} className="transition-colors hover:text-ink">
                {t.founder}
              </a>
            </li>
            <li>
              <a href={homeHref("#book")} className="transition-colors hover:text-ink">
                {t.book}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-3">
            {t.contact}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-2">
            <li>
              <a href={homeHref("#contact")} className="transition-colors hover:text-ink">
                {t.contact}
              </a>
            </li>
            <li>
              <a href={homeHref("#book")} className="transition-colors hover:text-ink">
                {t.book}
              </a>
            </li>
          </ul>

          <div
            className="mt-6 flex items-center gap-1 text-sm text-ink-2"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={locale === "en" ? "font-medium text-ink" : "hover:text-ink"}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <span className="text-ink-3" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              onClick={() => setLocale("es")}
              className={locale === "es" ? "font-medium text-ink" : "hover:text-ink"}
              aria-pressed={locale === "es"}
            >
              ES
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 pt-6 pb-32 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-8">
          <p className="max-w-3xl text-pretty leading-relaxed">
            © {year} zaz. {t.copyright} {t.founded}
          </p>
          <a
            href={isHome ? "#top" : "/"}
            className="shrink-0 transition-colors hover:text-ink"
          >
            ↑ Top
          </a>
        </div>
      </div>
    </footer>
  );
}
