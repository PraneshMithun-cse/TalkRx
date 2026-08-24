import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryCta } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryCta";
import { resolveImage } from "@/components/sites/demophorius-com-d11dd431/shared/resolve-image";

export const metadata: Metadata = { title: "Demophorius Lab – Demophorius healthcare" };

const PHASES = [
  { no: "1", title: "TEST AND PERFORMANCE", items: ["Product Demonstration", "Product Evaluation", "Complaint Analysis"] },
  { no: "2", title: "EVALUATION", items: ["Product Test and Variables", "Product challenges and opportunities", "Product Review"] },
  { no: "3", title: "IMPLEMENTATION & RISK ASSESSMENT", items: ["Quality control analysis", "Risk Assessment", "Verification", "Validation"] },
  { no: "4", title: "MONITORING AND EVALUATION", items: ["Collecting", "Storing", "Analyzing", "Transforming data into strategic information"] },
];

export default function DemophoriusLabPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Demophorius Lab</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed">
          Every company does its best to provide its customers with the finest products and thus stay satisfied. So,
          at Demophorius Healthcare we are testing current and new products before entering them into the market in
          order to respond to any challenges coming up. Demophorius&rsquo; aim is to supply quality products which
          comply with customers&rsquo; requirements, as we listen to what our customers say and understand their
          needs.
        </p>

        <div className="mt-12 aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-[#f3f1f2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImage("https://demophorius.com/wp-content/uploads/2021/09/Demophorisu-Lab.jpg")}
            alt="Demophorius Lab"
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mt-10 max-w-2xl text-base leading-relaxed">
          From safety and regulatory consulting to reverse engineering and product development to product failure
          analysis and quality control services, Demophorius&rsquo; consumer product testing laboratory can help
          solve a variety of complex analytical problems and questions.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {PHASES.map((p) => (
            <div key={p.no}>
              <div className="flex items-end justify-between border-b border-black pb-3">
                <div className="text-xs uppercase tracking-[1px] text-[#999]">
                  Phase #<span className="text-black">{p.no}</span>
                </div>
                <div className="text-sm font-medium uppercase">{p.title}</div>
              </div>
              <ul className="mt-2 list-none">
                {p.items.map((item) => (
                  <li key={item} className="border-b border-black/10 py-4 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <InquiryCta title="Do you need more info?" subtitle="Send us your inquiry" href="/product-inquiry/" />
      </main>
      <Footer />
    </div>
  );
}
