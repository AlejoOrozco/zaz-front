"use client";

import { useEffect, useRef, useState, type JSX } from "react";
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
    headline: "Your ideas into software.",
    sub: "Save time, automate your work, and ease your workflow all within your budget.",
    book: "Book a call",
    why: "See why zaz",
  },
  es: {
    headline: "Tus ideas, un software.",
    sub: "Ahorra tiempo, automatiza tu trabajo y simplifica tu vida. Todo dentro de tu presupuesto.",
    book: "Agenda una llamada",
    why: "Por qué zaz",
  },
} as const;

function useEntropySize(): number {
  const [size, setSize] = useState(420);

  useEffect(() => {
    function update(): void {
      const width = window.innerWidth;
      if (width < 480) {
        setSize(Math.min(width - 48, 320));
        return;
      }
      if (width < 768) {
        setSize(360);
        return;
      }
      if (width < 1024) {
        setSize(400);
        return;
      }
      setSize(440);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export function Hero(): JSX.Element {
  const { locale, theme } = useSite();
  const t = copy[locale];
  const size = useEntropySize();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const graphic = graphicRef.current;
    if (!section || !content || !graphic) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();
    const floatTarget = graphic.querySelector("[data-hero-float]");

    const ctx = gsap.context(() => {
      const headline = content.querySelector("[data-hero-headline]");
      const sub = content.querySelector("[data-hero-sub]");
      const actions = content.querySelector("[data-hero-actions]");

      if (reduced) {
        gsap.set([headline, sub, actions, graphic, floatTarget], {
          clearProps: "all",
        });
        return;
      }

      // Intro + idle float live on the INNER node so they never fight scroll scrub.
      const introTarget = floatTarget ?? graphic;
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(introTarget, { opacity: 0, scale: 0.94, y: 24, duration: 1.1 }, 0)
        .from(headline, { opacity: 0, y: 36, duration: 0.95 }, 0.15)
        .from(sub, { opacity: 0, y: 22, duration: 0.8 }, 0.35)
        .from(actions, { opacity: 0, y: 18, duration: 0.7 }, 0.5);

      if (floatTarget) {
        idleFloat(floatTarget, { y: 10, duration: 3.6 });
      }

      // Explicit fromTo so scroll-back restores opacity: 1 (not a mid-intro value).
      gsap.fromTo(
        graphic,
        { y: 0, opacity: 1 },
        {
          y: -80,
          opacity: 0.35,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        content,
        { y: 0, opacity: 1 },
        {
          y: -40,
          opacity: 0.15,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-20 pb-16 md:pt-24"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 md:grid-cols-2 md:gap-10 md:px-8 lg:gap-16">
        <div ref={contentRef} className="flex flex-col items-start text-left">
          <h1
            data-hero-headline
            className="max-w-[14ch] font-sans text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-ink"
          >
            {t.headline}
          </h1>

          <p
            data-hero-sub
            className="mt-6 max-w-md text-base leading-relaxed text-ink-2 md:text-lg"
          >
            {t.sub}
          </p>

          <div data-hero-actions className="mt-8 flex flex-wrap items-center gap-3">
            <BookCallButton href="#book">{t.book}</BookCallButton>
            <a
              href="#why"
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 bg-transparent px-6 text-sm font-medium text-ink transition-colors hover:border-ink/40 hover:bg-paper-2"
            >
              {t.why}
            </a>
          </div>
        </div>

        <div
          ref={graphicRef}
          className="flex justify-center will-change-transform md:justify-end"
        >
          <div data-hero-float className="will-change-transform">
            <Entropy
              size={size}
              theme={theme}
              className="rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
