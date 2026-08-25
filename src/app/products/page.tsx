import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { RootCategoryGrid } from "@/components/sites/demophorius-com-d11dd431/shared/RootCategoryGrid";
import { InquiryCta } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryCta";

export const metadata: Metadata = { title: "Product portfolio – Demophorius healthcare" };

export default function ProductsPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Product portfolio</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed">
          Demophorius is dedicated to manufacturing medical related products of the highest quality and standards.
          Demotek blood bags are manufactured under strict quality control to ensure safety, reliability, as well as
          excellent product quality. D-vac blood collection system has been designed to conform to worldwide
          standards and safety. D-tek sutures have achieved to be branded among the top brands due to the company&apos;s
          commitment of manufacturing high quality surgical sutures. Demotek medical disposables have proved to be
          one of the most reputable brands in general hospital supplies.
        </p>
        <div className="mt-14">
          <RootCategoryGrid />
        </div>
        <InquiryCta title="Do you need more info?" subtitle="Send us your inquiry" href="/contact-us/" />
      </main>
      <Footer />
    </div>
  );
}
