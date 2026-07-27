"use client";

import { useEffect, useRef, type JSX } from "react";
import { Entropy } from "@/components/ui/entropy";
import { BookCallButton } from "@/components/ui/book-call-button";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { idleFloat } from "@/components/motion/helpers";

const copy = {
  en: {
    headline: "Have an idea? Let's build it.",
    sub: "Tell me your idea and your budget. I'll tell you what's possible   no risk, no pressure.",
    cta: "Book a call",
    reassurance: "No commitment · Money-back guarantee",
    email: "hello@zaz.dev",
  },
  es: {
    headline: "¿Tienes una idea? La construyo.",
    sub: "Cuéntame tu idea y tu presupuesto. Te digo qué es posible   sin riesgo, sin presión.",
    cta: "Agenda una llamada",
    reassurance: "Sin compromiso · Garantía de devolución",
    email: "hello@zaz.dev",
  },
} as const;

export function FinalCta(): JSX.Element {
  const { locale, theme } = useSite();
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const invertedTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const graphic = section.querySelector("[data-cta-graphic]");
      const bits = section.querySelectorAll("[data-cta-copy]");

      if (reduced) {
        gsap.set([graphic, bits], { clearProps: "all" });
        return;
      }

      gsap.from(section, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      gsap.from(bits, {
        opacity: 0,
        y: 30,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 72%", once: true },
      });

      if (graphic) {
        gsap.from(graphic, {
          opacity: 0,
          scale: 0.92,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
        });
        idleFloat(graphic, { y: 12, duration: 4 });
      }
    }, section);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="book"
      className="relative flex min-h-[80svh] items-center overflow-hidden bg-invert-bg py-[clamp(5rem,12vw,10rem)] text-invert-fg"
      aria-labelledby="cta-heading"
    >
      <div
        data-cta-graphic
        className="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 opacity-30 will-change-transform lg:block"
        aria-hidden="true"
      >
        <Entropy size={360} theme={invertedTheme} className="rounded-2xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-6 text-center md:px-8">
        <h2
          data-cta-copy
          id="cta-heading"
          className="mx-auto max-w-3xl font-sans text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight"
        >
          {t.headline}
        </h2>
        <p
          data-cta-copy
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-invert-fg/65 md:text-lg"
        >
          {t.sub}
        </p>

        <div
          data-cta-copy
          className="mt-10 flex flex-col items-center gap-4"
        >
          <BookCallButton
            href="https://calendly.com"
            external
            surface="invert"
          >
            {t.cta}
          </BookCallButton>
          <p className="text-sm text-invert-fg/45">{t.reassurance}</p>
          <a
            href={`mailto:${t.email}`}
            className="text-sm text-invert-fg/65 underline-offset-4 hover:text-invert-fg hover:underline"
          >
            {t.email}
          </a>
        </div>
      </div>
    </section>
  );
}
