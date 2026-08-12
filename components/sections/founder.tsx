"use client";

import { useEffect, useRef, type JSX } from "react";
import { BookCallButton } from "@/components/ui/book-call-button";
import { TiltedCard } from "@/components/ui/tilted-card";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

const FOUNDER_PORTRAIT = "/images/founder/alejandro.jpeg";

const copy = {
  en: {
    statement: "You'll work with me, not a queue.",
    body: "I'm Alejandro Gómez Orozco, founder of zaz. I take your idea personally: I scope it, I build it, and I stand behind it with a money-back guarantee. No account managers, no handoffs, just your idea, built right.",
    signature: "- Alejandro, founder of zaz",
    cta: "Talk to me directly",
    portraitAlt: "Alejandro Gómez Orozco, founder of zaz",
  },
  es: {
    statement: "Trabajas conmigo, no con un desconocido.",
    body: "Soy Alejandro Gómez Orozco, fundador de zaz. Tomo tu idea de forma personal: la defino, la construyo y la respaldo con garantía de devolución. Solo tu idea, bien ejecutada",
    signature: "Alejandro, fundador de zaz",
    cta: "Háblame directamente",
    portraitAlt: "Alejandro Gómez Orozco, fundador de zaz",
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
        y: 28,
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
          className="relative mx-auto w-full max-w-sm will-change-transform"
        >
          <TiltedCard
            imageSrc={FOUNDER_PORTRAIT}
            altText={t.portraitAlt}
            containerHeight="400px"
            containerWidth="100%"
            imageHeight="400px"
            imageWidth="320px"
            rotateAmplitude={12}
            scaleOnHover={1.08}
            showMobileWarning={false}
            showTooltip={false}
          />
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
          <p data-founder-copy className="mt-8 font-mono text-sm text-ink">
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
