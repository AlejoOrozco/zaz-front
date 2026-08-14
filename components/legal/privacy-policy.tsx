"use client";

import type { JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import { privacyPolicyByLocale } from "@/lib/legal/privacy-policy";

export function PrivacyPolicy(): JSX.Element {
  const { locale } = useSite();
  const policy = privacyPolicyByLocale[locale];

  return (
    <article className="mx-auto w-full max-w-[760px] px-6 pt-28 pb-20 md:px-8 md:pt-32 md:pb-28">
      <h1 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-ink">
        {policy.title}
      </h1>
      <p className="mt-3 text-sm text-ink-3">{policy.updated}</p>

      <div className="mt-10 space-y-5 text-base leading-relaxed text-ink-2">
        {policy.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 space-y-12">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-sans text-lg font-semibold tracking-tight text-ink">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-base leading-relaxed text-ink-2">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            {section.items ? (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-ink-2">
                {section.items.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
