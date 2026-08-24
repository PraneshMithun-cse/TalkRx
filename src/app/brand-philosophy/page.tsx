import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { resolveImage } from "@/components/sites/demophorius-com-d11dd431/shared/resolve-image";
import data from "@/data/demophorius-com-d11dd431/brand-philosophy.json";

export const metadata: Metadata = { title: "Multi-awarded rebranding – Demophorius healthcare" };

type Section =
  | { type: "image"; src: string; caption: string }
  | { type: "gallery"; images: string[] }
  | { type: "big-text"; text: string }
  | { type: "text"; html: string };

const SECTIONS = data.sections as Section[];

export default function BrandPhilosophyPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">{data.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed">{data.description}</p>

        <div className="mt-10 flex flex-wrap items-center gap-8">
          {data.awardImages.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={resolveImage(src)} alt="Award" className="h-12 w-auto opacity-80" />
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          {SECTIONS.map((s, i) => {
            if (s.type === "image") {
              return (
                <figure key={i}>
                  <div className="aspect-[3/2] w-full overflow-hidden rounded-[10px] bg-[#f3f1f2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveImage(s.src)} alt="" className="h-full w-full object-cover" />
                  </div>
                  {s.caption && <figcaption className="mt-3 max-w-2xl text-sm text-[#666]">{s.caption}</figcaption>}
                </figure>
              );
            }
            if (s.type === "gallery") {
              return (
                <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {s.images.map((img) => (
                    <div key={img} className="aspect-[3/4] overflow-hidden rounded-[10px] bg-[#f3f1f2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              );
            }
            if (s.type === "big-text") {
              return (
                <p key={i} className="max-w-3xl text-2xl leading-snug lg:text-4xl">
                  {s.text}
                </p>
              );
            }
            return (
              <div
                key={i}
                className="prose prose-neutral max-w-2xl text-sm leading-relaxed [&_a]:underline [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: s.html }}
              />
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
