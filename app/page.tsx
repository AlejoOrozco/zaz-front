import type { JSX } from "react";
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
import { PageBackground } from "@/components/shell/page-background";
import { PageScrollBlur } from "@/components/shell/page-scroll-blur";
import { Hero } from "@/components/sections/hero";
import { WhyZaz } from "@/components/sections/why-zaz";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { WhatIOffer } from "@/components/sections/what-i-offer";
import { Founder } from "@/components/sections/founder";
import { Contact } from "@/components/sections/contact";
import { Booking } from "@/components/sections/booking";

export default function Home(): JSX.Element {
  return (
    <>
      <PageBackground />
      <PageScrollBlur />
      <Header />
      <main className="relative z-0">
        <Hero />
        <WhyZaz />
        <WhatWeBuild />
        <WhatIOffer />
        <Founder />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
