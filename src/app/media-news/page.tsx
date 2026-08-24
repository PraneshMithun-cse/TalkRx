import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { NewsIndex } from "@/components/sites/demophorius-com-d11dd431/shared/NewsIndex";
import news from "@/data/demophorius-com-d11dd431/news.json";
import type { NewsArticleData } from "@/components/sites/demophorius-com-d11dd431/shared/types";

export const metadata: Metadata = { title: "News & Updates – Demophorius healthcare" };

export default function MediaNewsPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">News &amp; Updates</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed">
          The latest news at a glance: we keep our customers and potential customers up to date. Here you can find
          recent press releases, event information, and information from the company that concern in-scope medical
          devices, lab and diagnostic equipment for haematology.
        </p>
        <div className="mt-10">
          <NewsIndex articles={news as NewsArticleData[]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
