import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Hero } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Hero";
import { About } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/About";
import { BlockCta } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/BlockCta";
import { Products } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Products";
import { News } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/News";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";

import { TalkRxInteractiveExperience } from "@/components/talkrx/TalkRxInteractiveExperience";

export const metadata: Metadata = {
  title: "TalkRx — AI-Powered Patient Case-Taking and Health Passport Platform",
  description:
    "TalkRx converts dead queue waiting time in Indian OPDs into structured, AI-conducted multilingual clinical histories, Dashavidha Pariksha, and longitudinal Health Passports before the consultation begins.",
};

export default function Home() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <Hero />
        <TalkRxInteractiveExperience />
        <BlockCta />
        <Products />
        <News />
      </main>
      <Footer />
    </div>
  );
}
