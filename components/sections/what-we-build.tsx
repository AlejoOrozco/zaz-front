"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
} from "react";
import {
  IconAiAgents,
  IconAnimatedPages,
  IconLandingPages,
  IconPersonalizedSoftware,
  IconWebPages,
} from "@/components/ui/build-feature-icons";
import { useSite } from "@/components/shell/site-provider";
import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

type FeatureId =
  | "animated-web-pages"
  | "web-pages"
  | "landing-pages"
  | "personalized-software"
  | "ai-agents";

interface FeatureCopy {
  id: FeatureId;
  phrase: string;
  label: string;
  description: string;
}

const FEATURE_IMAGES: Record<FeatureId, string> = {
  "animated-web-pages": "/images/what-we-build/animated-web-pages.webp",
  "web-pages": "/images/what-we-build/web-pages.webp",
  "landing-pages": "/images/what-we-build/landing-pages.webp",
  "personalized-software": "/images/what-we-build/personalized-software.webp",
  "ai-agents": "/images/what-we-build/ai-agents.webp",
};

const FEATURE_ICONS: Record<
  FeatureId,
  (props: { className?: string }) => JSX.Element
> = {
  "animated-web-pages": IconAnimatedPages,
  "web-pages": IconWebPages,
  "landing-pages": IconLandingPages,
  "personalized-software": IconPersonalizedSoftware,
  "ai-agents": IconAiAgents,
};

const AUTO_MS = 4000;
const PAUSE_MS = 6000;

const copy = {
  en: {
    headline: "If you can describe it, I can build it.",
    lead: "I build",
    closing: "Don't see yours? That's the point, tell me.",
    features: [
      {
        id: "animated-web-pages",
        phrase: "animated web pages",
        label: "Animated web pages",
        description:
          "Sites with motion that feels intentional, presence, not noise.",
      },
      {
        id: "web-pages",
        phrase: "web pages",
        label: "Web pages",
        description:
          "Clear, fast pages that carry your brand and convert visitors.",
      },
      {
        id: "landing-pages",
        phrase: "landing pages",
        label: "Landing pages",
        description:
          "Focused pages built to launch offers, waitlists, and campaigns.",
      },
      {
        id: "personalized-software",
        phrase: "personalized software",
        label: "Personalized software",
        description:
          "Tools shaped around your process, never a reused template.",
      },
      {
        id: "ai-agents",
        phrase: "AI agents",
        label: "AI agents",
        description:
          "Agents that handle real work inside your workflows.",
      },
    ] satisfies FeatureCopy[],
  },
  es: {
    headline: "Si puedes describirlo, puedo construirlo.",
    lead: "Construyo",
    closing: "¿No ves lo tuyo? De eso se trata, cuéntame.",
    features: [
      {
        id: "animated-web-pages",
        phrase: "páginas web animadas",
        label: "Páginas web animadas",
        description:
          "Sitios con movimiento intencional, presencia, no ruido.",
      },
      {
        id: "web-pages",
        phrase: "páginas web",
        label: "Páginas web",
        description:
          "Páginas claras y rápidas que cargan tu marca y convierten.",
      },
      {
        id: "landing-pages",
        phrase: "landing pages",
        label: "Landing pages",
        description:
          "Páginas enfocadas para lanzar ofertas, listas y campañas.",
      },
      {
        id: "personalized-software",
        phrase: "software a la medida",
        label: "Software a la medida",
        description:
          "Herramientas hechas a tu proceso, nunca una plantilla reciclada.",
      },
      {
        id: "ai-agents",
        phrase: "agentes de IA",
        label: "Agentes de IA",
        description:
            "Agentes que hacen trabajo real en tus flujos.",
      },
    ] satisfies FeatureCopy[],
  },
} as const;

function GlowPreview({
  features,
  activeId,
}: {
  features: readonly FeatureCopy[];
  activeId: FeatureId;
}): JSX.Element {
  const active = features.find((f) => f.id === activeId) ?? features[0];

  return (
    <div className="build-glow-frame relative w-full">
      {/* ~2:1 matches the screenshots so contain fills the frame; radius clips all corners */}
      <div className="build-glow-mask relative aspect-[2/1] w-full overflow-hidden rounded-2xl">
        {features.map((feature) => {
          const isActive = feature.id === activeId;
          return (
            <Image
              key={feature.id}
              src={FEATURE_IMAGES[feature.id]}
              alt={feature.label}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={cn(
                "rounded-2xl object-contain object-center transition-opacity duration-500 ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
              priority={feature.id === features[0].id}
            />
          );
        })}
      </div>
      <p className="sr-only">{active.label}</p>
    </div>
  );
}

export function WhatWeBuild(): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const reducedRef = useRef(false);

  const active = t.features[activeIndex] ?? t.features[0];
  const ActiveIcon = FEATURE_ICONS[active.id];

  const selectIndex = useCallback((index: number, pause: boolean): void => {
    setActiveIndex(index);
    if (pause) {
      setPausedUntil(Date.now() + PAUSE_MS);
    }
  }, []);

  const onAutoAdvance = useEffectEvent((): void => {
    if (reducedRef.current) return;
    if (Date.now() < pausedUntil) return;
    setActiveIndex((prev) => (prev + 1) % t.features.length);
  });

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
    if (reducedRef.current) return;

    const id = window.setInterval(() => {
      onAutoAdvance();
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [locale, t.features.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const gsap = ensureGsap();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const parts = section.querySelectorAll("[data-build-reveal]");
      if (reduced) {
        gsap.set(parts, { clearProps: "all" });
        return;
      }

      gsap.from(parts, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [locale]);

  const onPhraseKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next =
      (index + delta + t.features.length) % t.features.length;
    selectIndex(next, true);
    const buttons = sectionRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-build-phrase]",
    );
    buttons?.[next]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="build"
      className="relative py-[clamp(5rem,12vw,10rem)]"
      aria-labelledby="build-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <h2
          data-build-reveal
          id="build-heading"
          className="max-w-2xl font-sans text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-ink"
        >
          {t.headline}
        </h2>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-build-reveal className="min-w-0">
            <p
              className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-[1.45] tracking-tight"
              role="group"
              aria-label={t.headline}
            >
              <span className="text-ink-3">{t.lead} </span>
              {t.features.map((feature, index) => {
                const isActive = index === activeIndex;
                const isLast = index === t.features.length - 1;
                return (
                  <span key={feature.id}>
                    <button
                      type="button"
                      data-build-phrase
                      aria-pressed={isActive}
                      onClick={() => selectIndex(index, true)}
                      onKeyDown={(event) => onPhraseKeyDown(event, index)}
                      className={cn(
                        "rounded-sm transition-[color,text-shadow,opacity] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
                        isActive
                          ? "text-ink build-phrase-active"
                          : "text-ink-3/70 hover:text-ink-2",
                      )}
                    >
                      {feature.phrase}
                    </button>
                    <span className="text-ink-3/70">
                      {isLast ? "." : ". "}
                    </span>
                  </span>
                );
              })}
            </p>

            <div
              className="mt-10 border-t border-line pt-6"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink">
                  <ActiveIcon className="size-4" />
                </span>
                <p className="font-sans text-sm font-medium tracking-tight text-ink">
                  {active.label}
                </p>
              </div>
              <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-ink-2">
                {active.description}
              </p>
            </div>
          </div>

          <div data-build-reveal className="min-w-0 lg:sticky lg:top-28">
            <GlowPreview features={t.features} activeId={active.id} />
          </div>
        </div>

        <p data-build-reveal className="mt-12 text-base text-ink-2">
          <a
            href="#book"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {t.closing}
          </a>
        </p>
      </div>
    </section>
  );
}
