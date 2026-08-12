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

    // Entrance only — hide/show is CSS so it never fights GSAP transforms.
    const ctx = gsap.context(() => {
      gsap.from(header.querySelectorAll(":scope > *"), {
        opacity: 0,
        y: -12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.05,
        clearProps: "transform",
      });
    }, header);

    if (reduced) {
      const onScrollSolid = (): void => {
        header.classList.toggle("header-solid", window.scrollY > 80);
      };
      window.addEventListener("scroll", onScrollSolid, { passive: true });
      onScrollSolid();
      return () => {
        window.removeEventListener("scroll", onScrollSolid);
        ctx.revert();
      };
    }

    // Need sustained travel in one direction before toggling (kills jitter).
    const HIDE_AFTER_PX = 72;
    const SHOW_AFTER_PX = 56;
    const ALWAYS_SHOW_BELOW = 96;
    const JITTER_PX = 2;

    let lastY = Math.max(0, window.scrollY);
    let accumulated = 0;
    let hidden = false;
    let ticking = false;

    const applyHidden = (next: boolean): void => {
      if (hidden === next) return;
      hidden = next;
      header.classList.toggle("header-hidden", hidden);
      accumulated = 0;
    };

    const update = (): void => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      header.classList.toggle("header-solid", y > 80);

      if (y <= ALWAYS_SHOW_BELOW) {
        applyHidden(false);
        lastY = y;
        accumulated = 0;
        return;
      }

      const delta = y - lastY;
      lastY = y;

      if (Math.abs(delta) < JITTER_PX) return;

      // Direction change resets the run — avoids flip-flopping.
      if (
        (accumulated > 0 && delta < 0) ||
        (accumulated < 0 && delta > 0)
      ) {
        accumulated = delta;
      } else {
        accumulated += delta;
      }

      if (!hidden && accumulated >= HIDE_AFTER_PX) {
        applyHidden(true);
        return;
      }

      if (hidden && accumulated <= -SHOW_AFTER_PX) {
        applyHidden(false);
      }
    };

    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

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
