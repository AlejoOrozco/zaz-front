"use client";

import { useEffect, useRef, type JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

const copy = {
  en: {
    headline: "What I offer you.",
    progressLabel: "Offer progress",
    items: [
      {
        title: "The best I can do for your budget",
        body: "You tell me the budget. I tell you what's possible inside it   no open-ended invoices.",
      },
      {
        title: "Don't like it? Your money back",
        body: "If it isn't what we agreed, you don't pay. The risk is on me, not you.",
      },
      {
        title: "Personalized   and only yours",
        body: "I don't resell the same software. What you get is unique. You won't see it out there on someone else.",
      },
      {
        title: "Something you can really use",
        body: "I make sure you get what you want   practical, clear, and built to work in your day-to-day.",
      },
    ],
  },
  es: {
    headline: "Lo que te ofrezco.",
    progressLabel: "Progreso de la oferta",
    items: [
      {
        title: "Lo mejor que puedo hacer con tu presupuesto",
        body: "Tú dices el presupuesto. Yo te digo qué es posible dentro de él   sin facturas abiertas.",
      },
      {
        title: "¿No te gusta? Te devuelvo el dinero",
        body: "Si no es lo acordado, no pagas. El riesgo es mío, no tuyo.",
      },
      {
        title: "Personalizado   y solo tuyo",
        body: "No revendo el mismo software. Lo que recibes es único. No lo verás en nadie más.",
      },
      {
        title: "Algo que sí puedes usar",
        body: "Me aseguro de que obtengas lo que quieres   práctico, claro y útil en tu día a día.",
      },
    ],
  },
} as const;

export function WhatIOffer(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();
    const steps = Array.from(
      section.querySelectorAll<HTMLElement>("[data-offer-step]"),
    );
    const progress = section.querySelector<HTMLElement>("[data-offer-progress]");
    const counter = counterRef.current;
    const stepCount = steps.length;

    if (reduced || stepCount === 0) {
      gsap.set(steps, { autoAlpha: 1, clearProps: "transform" });
      if (progress) gsap.set(progress, { scaleX: 1 });
      if (counter) {
        counter.textContent = String(stepCount).padStart(2, "0");
      }
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(steps, { autoAlpha: 0 });
      gsap.set(steps[0], { autoAlpha: 1 });
      if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "left" });

      const fade = 0.5;
      const hold = 0.4;
      const totalDuration = (stepCount - 1) * (fade + hold) + hold;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * stepCount * 0.7}`,
          pin: pin,
          scrub: 0.25,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!counter) return;
            const index = Math.min(
              stepCount - 1,
              Math.floor(self.progress * stepCount),
            );
            counter.textContent = String(index + 1).padStart(2, "0");
          },
        },
      });

      if (progress) {
        tl.fromTo(
          progress,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: totalDuration },
          0,
        );
      }

      steps.forEach((step, index) => {
        if (index === 0) {
          tl.to({}, { duration: hold }, 0);
          return;
        }

        const prev = steps[index - 1];
        const at = index * (fade + hold) - fade;

        tl.to(
          prev,
          {
            autoAlpha: 0,
            duration: fade,
            ease: "power1.inOut",
          },
          at,
        );
        tl.fromTo(
          step,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: fade,
            ease: "power1.inOut",
          },
          at,
        );
        tl.to({}, { duration: hold }, at + fade);
      });
    }, section);

    return () => ctx.revert();
  }, [locale]);

  const total = String(t.items.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="offer"
      className="relative"
      aria-labelledby="offer-heading"
    >
      <div
        ref={pinRef}
        className="flex min-h-svh flex-col justify-center py-[clamp(4rem,10vw,7rem)]"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
          <h2
            id="offer-heading"
            className="max-w-xl font-sans text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-ink"
          >
            {t.headline}
          </h2>

          <div className="relative mt-14 min-h-[14rem] overflow-hidden md:mt-20 md:min-h-[16rem]">
            {t.items.map((item, index) => {
              const number = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={item.title}
                  data-offer-step
                  className="absolute inset-0 flex flex-col justify-center"
                  aria-hidden={index === 0 ? undefined : true}
                >
                  <span
                    className="font-sans text-5xl font-semibold tracking-tight text-ink/15 md:text-6xl"
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  <h3 className="mt-4 max-w-2xl font-sans text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-2 md:text-lg">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex max-w-md items-center gap-4">
            <div
              className="relative h-[2px] min-w-0 flex-1 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-label={t.progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                data-offer-progress
                className="absolute inset-y-0 left-0 w-full origin-left bg-ink"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <p
              className="shrink-0 text-[0.75rem] tabular-nums tracking-[0.14em] text-ink-3"
              aria-hidden="true"
            >
              <span ref={counterRef}>01</span>
              <span className="mx-1 text-ink-3/50">/</span>
              <span>{total}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
