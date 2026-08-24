"use client";

import { useInView } from "@/components/sites/demophorius-com-d11dd431/shared/use-in-view";
import { CircleArrowButton } from "@/components/sites/demophorius-com-d11dd431/shared/CircleArrowButton";
import { RootCategoryGrid } from "@/components/sites/demophorius-com-d11dd431/shared/RootCategoryGrid";

export function Products() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);

  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-[72px] lg:py-24">
      <div
        className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[600px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, #a9c1ff 0%, #cdf3f6 50%, transparent 75%)" }}
      />
      <div className="relative" ref={ref}>
        <div className="text-xs uppercase tracking-[2px] font-bold text-blue-600 mb-3" style={{ fontFamily: "var(--do-font-label)" }}>
          Modular Architecture
        </div>
        <h2 className={`anim-fade-up text-5xl leading-none md:text-7xl lg:text-[90px] font-normal tracking-tight text-neutral-950 ${isInView ? "is-inview" : ""}`}>
          Platform Architecture
        </h2>
        <p className={`anim-fade-up mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 lg:text-lg ${isInView ? "is-inview" : ""}`} style={{ transitionDelay: "150ms" }}>
          Five interoperable engines engineered for low-cost Android tablets, noisy OPD queues, and national-scale ABDM / FHIR R4 interoperability.
        </p>

        <div className="mt-14 lg:mt-16">
          <RootCategoryGrid />
        </div>

        <div className="mt-10 flex justify-end">
          <CircleArrowButton href="#passport" label="Explore Health Passport" />
        </div>
      </div>
    </section>
  );
}
