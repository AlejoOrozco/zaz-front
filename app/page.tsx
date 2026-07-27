import type { JSX } from "react";
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
import { PageBackground } from "@/components/shell/page-background";
import { Hero } from "@/components/sections/hero";
import { WhyZaz } from "@/components/sections/why-zaz";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { WhatIOffer } from "@/components/sections/what-i-offer";
import { Founder } from "@/components/sections/founder";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home(): JSX.Element {
  return (
    <>
      <PageBackground />
      <Header />
      <main className="relative z-0">
        <Hero />
        <WhyZaz />
        <WhatWeBuild />
        <WhatIOffer />
        <Founder />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
