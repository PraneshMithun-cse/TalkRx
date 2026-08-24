import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { LegalPage } from "@/components/sites/demophorius-com-d11dd431/shared/LegalPage";
import legalPages from "@/data/demophorius-com-d11dd431/legal-pages.json";

export const metadata: Metadata = { title: "Privacy Policy – Demophorius healthcare" };

export default function PrivacyPolicyPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <LegalPage html={legalPages["privacy-policy"].html} />
      </main>
      <Footer />
    </div>
  );
}
