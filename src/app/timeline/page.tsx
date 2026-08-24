import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { resolveImage } from "@/components/sites/demophorius-com-d11dd431/shared/resolve-image";
import timeline from "@/data/demophorius-com-d11dd431/timeline.json";
import type { TimelineEvent } from "@/components/sites/demophorius-com-d11dd431/shared/types";

export const metadata: Metadata = { title: "Timeline – Demophorius healthcare" };

const EVENTS = timeline as TimelineEvent[];

export default function TimelinePage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Discover our story through time</h1>
        <p className="mt-3 text-lg text-[#666]">1996 – 2026</p>

        <ol className="mt-16 list-none border-l border-black/10">
          {EVENTS.map((e, i) => (
            <li key={i} className="relative flex flex-col gap-6 py-10 pl-8 sm:flex-row sm:items-start">
              <div className="absolute -left-[5px] top-14 h-2.5 w-2.5 rounded-full bg-black" />
              <div className="shrink-0 sm:w-40">
                <div className="text-3xl">{e.year}</div>
                <div className="text-xs uppercase tracking-[1px] text-[#999]">{e.month}</div>
              </div>
              <div className="flex-1">
                <div className="text-xl">{e.title}</div>
                <p className="mt-2 max-w-xl whitespace-pre-line text-sm text-[#666]">{e.description}</p>
              </div>
              {e.image && (
                <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#f3f1f2] sm:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(e.image)} alt={e.title} className="h-full w-full object-cover" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </div>
  );
}
