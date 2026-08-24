"use client";

import { useInView } from "@/components/sites/demophorius-com-d11dd431/shared/use-in-view";
import { CircleArrowButton } from "@/components/sites/demophorius-com-d11dd431/shared/CircleArrowButton";

const FEATURES = [
  {
    title: "The Two-Minute Bottleneck (BMJ Open 2017)",
    body: "The single most valuable diagnostic instrument in medicine is a conversation: 70 to 80% of correct diagnoses stem from clinical history alone. Yet Indian primary care consultations average ~2 minutes (vs 22 in Sweden). A doctor seeing 100+ patients in a morning has no choice but to compress exhaustive inquiry into 3 or 4 rushed questions.",
  },
  {
    title: "Doctor-Time vs Patient-Time",
    body: "The scarce resource in an Indian OPD is not patient time — it is doctor time. Every existing EMR or AI scribe consumes precious physician minutes. TalkRx flips the equation: harvesting 20 minutes of queue waiting into a structured, NAMASTE & ICD-11 coded summary delivered before the patient sits down.",
  },
];

export function About() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="px-6 py-16 md:px-10 lg:px-[72px] lg:py-24 border-t border-neutral-100" ref={ref} id="engine">
      <div className="max-w-5xl">
        <div className="text-xs uppercase tracking-[2px] font-bold text-blue-600 mb-3" style={{ fontFamily: "var(--do-font-label)" }}>
          Clinical Problem Context
        </div>
        <h1
          className={`anim-fade-up text-4xl leading-tight md:text-5xl lg:text-[62px] lg:leading-[65px] font-normal tracking-tight text-neutral-950 ${isInView ? "is-inview" : ""}`}
        >
          India’s Clinical Bottleneck
          <br />
          Is Not Knowledge. It Is Minutes.
        </h1>

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:gap-12">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`anim-fade-up flex-1 rounded-xl bg-neutral-50/80 p-6 border border-neutral-100 ${isInView ? "is-inview" : ""}`}
              style={{ transitionDelay: isInView ? `${i * 120}ms` : undefined }}
            >
              <h2 className="text-lg font-semibold text-neutral-900">{f.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#555]">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-medium">
            Ministry of Ayush · SIH26047 · Smart Automation Category
          </div>
          <CircleArrowButton href="#ayush" label="Explore AYUSH Integration" />
        </div>
      </div>
    </section>
  );
}
