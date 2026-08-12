"use client";

import { useEffect, useRef, type JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import { BookCallButton } from "@/components/ui/book-call-button";
import { ZazLogo } from "@/components/brand/zaz-logo";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

const copy = {
  en: {
    build: "What I build",
    why: "Why zaz",
    offer: "What I offer",
    book: "Book a call",
  },
  es: {
    build: "Qué construyo",
    why: "Por qué zaz",
    offer: "Lo que ofrezco",
    book: "Agenda una llamada",
  },
} as const;

export function Header(): JSX.Element {
  const { locale, setLocale, theme, toggleTheme } = useSite();
  const t = copy[locale];
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();
    let lastY = 0;
    let hidden = false;

    const ctx = gsap.context(() => {
      gsap.from(header.querySelectorAll(":scope > *"), {
        opacity: 0,
        y: -12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.05,
      });
    }, header);

    const onScroll = (): void => {
      const y = window.scrollY;
      const pastHero = y > 80;
      header.classList.toggle("header-solid", pastHero);

      if (reduced) {
        lastY = y;
        return;
      }

      if (y > lastY + 6 && y > 140 && !hidden) {
        hidden = true;
        gsap.to(header, { y: -100, duration: 0.35, ease: "power2.out" });
      } else if (y < lastY - 4 && hidden) {
        hidden = false;
        gsap.to(header, { y: 0, duration: 0.35, ease: "power2.out" });
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="header-bar fixed inset-x-0 top-0 z-50 will-change-transform"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:h-20 md:px-8">
        <ZazLogo />

        <nav
          className="hidden items-center gap-2 text-sm text-ink-2 md:flex"
          aria-label="Primary"
        >
          <a href="#why" className="px-2 transition-colors hover:text-ink">
            {t.why}
          </a>
          <span className="text-ink-3" aria-hidden="true">
            ·
          </span>
          <a href="#build" className="px-2 transition-colors hover:text-ink">
            {t.build}
          </a>
          <span className="text-ink-3" aria-hidden="true">
            ·
          </span>
          <a href="#offer" className="px-2 transition-colors hover:text-ink">
            {t.offer}
          </a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div
            className="flex items-center gap-1 text-sm text-ink-2"
            role="group"
            aria-label="Language"
          >
            <LocaleButton
              active={locale === "en"}
              onClick={() => setLocale("en")}
              label="EN"
            />
            <span className="text-ink-3" aria-hidden="true">
              |
            </span>
            <LocaleButton
              active={locale === "es"}
              onClick={() => setLocale("es")}
              label="ES"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-paper-2"
            aria-label={
              theme === "light" ? "Switch to dark" : "Switch to light"
            }
          >
            {theme === "light" ? "◐" : "◑"}
          </button>

          <BookCallButton
            href="#book"
            className="hidden md:inline-flex"
          >
            {t.book}
          </BookCallButton>
        </div>
      </div>
    </header>
  );
}

function LocaleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-0.5 transition-colors ${
        active ? "font-medium text-ink" : "hover:text-ink"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
