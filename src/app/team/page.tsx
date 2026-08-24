import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";

export const metadata: Metadata = { title: "Team – Demophorius healthcare" };

const DEPARTMENTS = ["Administration", "Sales", "Accounting & Finance", "Human Resources", "Quality", "Regulatory", "Logistics"];

export default function TeamPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Demophorius Team</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium uppercase">The &ldquo;A&rdquo; Team</div>
            <p className="mt-3 text-sm leading-relaxed text-[#666]">
              &ldquo;A&rdquo; goes for amazing. Demophorius team is going to amaze you. You will be supported in any
              way in order to achieve your goal. You will be served and treated with absolute perfection and
              professionalism, like you have never been before. We develop the strongest and the most trustful
              relationships that will last through years. It is a win-win situation and that is how it should be for
              both sides.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium uppercase">Qualified experience</div>
            <p className="mt-3 text-sm leading-relaxed text-[#666]">
              Description: Demophorius manufacturing facilities have been selected to satisfy international quality
              control standards. Our customer-centered approach to product development is reinforced by listening
              and understanding our customers&rsquo; needs.
            </p>
          </div>
        </div>

        <div className="mt-14 border-y border-black/10 py-6">
          <div className="text-xs font-medium uppercase tracking-[1px]">Filter departments:</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {DEPARTMENTS.map((d) => (
              <span key={d} className="rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-wide text-[#999]">
                {d}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-12 text-sm text-[#999]">Team profiles are temporarily unavailable.</p>
      </main>
      <Footer />
    </div>
  );
}
