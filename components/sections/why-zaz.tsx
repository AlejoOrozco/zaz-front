"use client";

import { useEffect, useRef, type JSX } from "react";
import { BookCallButton } from "@/components/ui/book-call-button";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

const copy = {
  en: {
    headline: "Why zaz.",
    closing: "That's it. The risk is on me.",
    cta: "Schedule a call",
    steps: [
      {
        title: "Schedule a call",
        body: "Pick a time. That's the whole start.",
      },
      {
        title: "You tell me the problem   and your budget",
        body: "What hurts, what you need, and what you can spend. Clear and honest.",
      },
      {
        title: "I show you the solution for that budget",
        body: "No vague promises. A real plan that fits what you can invest.",
      },
      {
        title: "I build. You only see the progress",
        body: "I create it. You watch it take shape   without the noise.",
      },
    ],
  },
  es: {
    headline: "Por qué zaz.",
    closing: "Eso es todo. El riesgo es mío.",
    cta: "Agenda una llamada",
    steps: [
      {
        title: "Agenda una llamada",
        body: "Elige un horario. Así empieza todo.",
      },
      {
        title: "Me cuentas el problema y tu presupuesto",
        body: "Qué necesitas y cuanto estás dispuesto a invertir.",
      },
      {
        title: "Te muestro la solución para ese presupuesto",
        body: "Sin promesas falsas. Un plan real que seguiré basado en tu presupuesto.",
      },
      {
        title: "Yo creo. Tú solo ves el progreso",
        body: "Yo lo construyo. Tú ves cómo toma forma.",
      },
    ],
  },
} as const;

const NODE_COL_PX = 36;

export function WhyZaz(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const track = trackRef.current;
    if (!section || !list || !track) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();

    const layoutTrack = (): void => {
      const anchors = list.querySelectorAll<HTMLElement>("[data-why-node-slot]");
      if (anchors.length < 2) return;

      const centerY = (el: HTMLElement): number => {
        let y = el.offsetTop + el.offsetHeight / 2;
        let parent = el.offsetParent as HTMLElement | null;
        while (parent && parent !== list) {
          y += parent.offsetTop;
          parent = parent.offsetParent as HTMLElement | null;
        }
        return y;
      };

      const top = centerY(anchors[0]);
      const bottom = centerY(anchors[anchors.length - 1]);

      track.style.top = `${top}px`;
      track.style.height = `${Math.max(0, bottom - top)}px`;
      track.style.left = `${NODE_COL_PX / 2}px`;
    };

    layoutTrack();
    void document.fonts.ready.then(layoutTrack);
    const resizeObserver = new ResizeObserver(layoutTrack);
    resizeObserver.observe(list);

    const ctx = gsap.context(() => {
      const headerBits = section.querySelectorAll("[data-why-header]");
      const progress = section.querySelector("[data-why-progress]");
      const steps = section.querySelectorAll("[data-why-step]");
      const bodies = section.querySelectorAll("[data-why-body]");
      const nodes = section.querySelectorAll("[data-why-node]");
      const numbers = section.querySelectorAll("[data-why-number]");
      const closing = section.querySelector("[data-why-closing]");

      if (reduced) {
        gsap.set([headerBits, progress, bodies, nodes, numbers, closing], {
          clearProps: "all",
        });
        gsap.set(progress, { scaleY: 1 });
        gsap.set(numbers, {
          color: "var(--ink)",
          webkitTextStroke: "0px transparent",
        });
        gsap.set(nodes, { backgroundColor: "var(--ink)" });
        layoutTrack();
        return;
      }

      gsap.from(headerBits, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      gsap.set(numbers, {
        color: "transparent",
        webkitTextStroke: "1.5px var(--ink-3)",
      });
      gsap.set(nodes, { backgroundColor: "transparent" });

      const stepCount = Math.max(numbers.length, 1);
      const turnOnDuration = 0.12;

      const spine = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top 55%",
          end: "bottom 45%",
          scrub: true,
          onRefresh: layoutTrack,
        },
      });

      spine.fromTo(
        progress,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", duration: 1 },
        0,
      );

      numbers.forEach((number, index) => {
        const at = stepCount === 1 ? 0 : index / (stepCount - 1);
        const startAt = Math.max(0, at - turnOnDuration * 0.35);

        spine.fromTo(
          number,
          {
            color: "transparent",
            webkitTextStroke: "1.5px var(--ink-3)",
          },
          {
            color: "var(--ink)",
            webkitTextStroke: "0px transparent",
            ease: "power2.out",
            duration: turnOnDuration,
          },
          startAt,
        );

        const node = nodes[index];
        if (node) {
          spine.fromTo(
            node,
            { backgroundColor: "transparent" },
            {
              backgroundColor: "var(--ink)",
              ease: "power2.out",
              duration: turnOnDuration,
            },
            startAt,
          );
        }
      });

      steps.forEach((step, index) => {
        const body = bodies[index];
        if (body) {
          gsap.fromTo(
            body,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                once: true,
              },
            },
          );
        }
      });

      gsap.from(closing, {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: closing, start: "top 88%", once: true },
      });
    }, section);

    requestAnimationFrame(layoutTrack);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative py-[clamp(5rem,12vw,10rem)]"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <h2
          data-why-header
          id="why-heading"
          className="max-w-xl font-sans text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-ink"
        >
          {t.headline}
        </h2>

        <ol ref={listRef} className="relative mt-16">
          <div
            ref={trackRef}
            className="pointer-events-none absolute z-0 w-px -translate-x-1/2 bg-line"
            style={{ left: NODE_COL_PX / 2 }}
            aria-hidden="true"
          >
            <div
              data-why-progress
              className="h-full w-full origin-top bg-ink"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {t.steps.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <li
                key={step.title}
                data-why-step
                className="relative grid grid-cols-[36px_1fr] items-start gap-3 py-8 md:gap-8"
              >
                <div
                  data-why-node-slot
                  className="relative z-10 flex h-10 items-center justify-center md:h-12"
                >
                  <span
                    data-why-node
                    className="block h-3 w-3 shrink-0 rounded-full border-2 border-ink bg-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div
                  data-why-body
                  className="grid min-w-0 grid-cols-[3.25rem_1fr] items-start gap-3 md:grid-cols-[5rem_1fr] md:gap-8"
                >
                  <span
                    data-why-number
                    className="flex h-10 items-center font-sans text-3xl font-semibold leading-none tracking-tight text-transparent md:h-12 md:text-5xl"
                    style={{ WebkitTextStroke: "1px var(--ink-3)" }}
                    aria-hidden="true"
                  >
                    {number}
                  </span>

                  <div className="min-w-0 rounded-[14px] border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <h3 className="text-lg font-semibold tracking-tight text-ink md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-2">
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div data-why-closing className="mt-10 flex flex-col items-start gap-4">
          <p className="text-lg font-medium text-ink">{t.closing}</p>
          <BookCallButton href="#book">{t.cta}</BookCallButton>
        </div>
      </div>
    </section>
  );
}
