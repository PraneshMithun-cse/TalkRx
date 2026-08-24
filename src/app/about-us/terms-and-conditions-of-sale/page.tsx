import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";

export const metadata: Metadata = { title: "Terms and Conditions of Sale – Demophorius healthcare" };

export default function TermsOfSalePage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Terms and Conditions of Sale</h1>
        <a
          href="https://demophorius.com/wp-content/uploads/2022/10/F-252-TERMS-AND-CONDITIONS-OF-SALES-V1.2.pdf"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm text-white hover:opacity-80"
        >
          Click here: Demophorius Ltd Terms and Conditions of Sale (PDF)
        </a>
      </main>
      <Footer />
    </div>
  );
}
