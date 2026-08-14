import type { Metadata } from "next";
import type { JSX } from "react";
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
import { PageBackground } from "@/components/shell/page-background";
import { PageScrollBlur } from "@/components/shell/page-scroll-blur";
import { PrivacyPolicy } from "@/components/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Personal data policy  zaz",
  description:
    "Política de tratamiento de datos personales de zaz, en cumplimiento de la Ley 1581 de 2012.",
};

export default function PrivacyPage(): JSX.Element {
  return (
    <>
      <PageBackground />
      <PageScrollBlur />
      <Header />
      <main className="relative z-0">
        <PrivacyPolicy />
      </main>
      <Footer />
    </>
  );
}
