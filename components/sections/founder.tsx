"use client";

import { useEffect, useRef, type JSX } from "react";
import { BookCallButton } from "@/components/ui/book-call-button";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { idleFloat } from "@/components/motion/helpers";

const copy = {
  en: {
    statement: "You'll work with me, not a queue.",
    body: "I'm Alejandro Gómez Orozco, founder of zaz. I take your idea personally: I scope it, I build it, and I stand behind it with a money-back guarantee. No account managers, no handoffs   just your idea, built right.",
    signature: "  Alejandro, founder of zaz",
    cta: "Talk to me directly",
  },
  es: {
    statement: "Trabajas conmigo, no con un desconocido.",
    body: "Soy Alejandro Gómez Orozco, fundador de zaz. Tomo tu idea de forma personal: la defino, la construyo y la respaldo con garantía de devolución. Sin gerentes de cuenta, sin traspasos   solo tu idea, bien hecha.",
    signature: "  Alejandro, fundador de zaz",
    cta: "Háblame directamente",
  },
} as const;

export function Founder(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const portrait = section.querySelector("[data-founder-portrait]");
      const bits = section.querySelectorAll("[data-founder-copy]");

      if (reduced) {
        gsap.set([portrait, bits], { clearProps: "all" });
        return;
      }

      gsap.from(portrait, {
        opacity: 0,
        scale: 0.94,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });

      gsap.from(bits, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });

      if (portrait) idleFloat(portrait, { y: 8, duration: 3.8 });
    }, section);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="relative py-[clamp(5rem,12vw,10rem)]"
      aria-labelledby="founder-heading"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-8">
        <div
          data-founder-portrait
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[14px] border border-line bg-paper shadow-[0_8px_40px_rgba(0,0,0,0.06)] will-change-transform"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-paper-3 to-paper-2">
            <span className="font-sans text-6xl font-semibold tracking-tight text-ink/20">
              AG
            </span>
          </div>
          <p className="absolute right-4 bottom-4 left-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3">
            Portrait placeholder
          </p>
        </div>

        <div>
          <h2
            data-founder-copy
            id="founder-heading"
            className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-ink"
          >
            {t.statement}
          </h2>
          <p
            data-founder-copy
            className="mt-6 max-w-lg text-base leading-relaxed text-ink-2"
          >
            {t.body}
          </p>
          <p
            data-founder-copy
            className="mt-8 font-mono text-sm text-ink"
          >
            {t.signature}
          </p>
          <div data-founder-copy className="mt-8">
            <BookCallButton href="#book">{t.cta}</BookCallButton>
          </div>
        </div>
      </div>
    </section>
  );
}
