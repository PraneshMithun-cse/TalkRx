import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { TALKRX_MODULES, type ModuleMeta } from "./modules";

export function ModulePageShell({
  moduleId,
  children,
}: {
  moduleId: string;
  children: React.ReactNode;
}) {
  const current = TALKRX_MODULES.find((m) => m.id === moduleId);
  if (!current) throw new Error(`Unknown TalkRx module: ${moduleId}`);
  const others = TALKRX_MODULES.filter((m) => m.id !== moduleId);
  const Icon = current.icon;
  const t = current.theme;

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <section className="relative px-6 pt-10 pb-4 md:px-10 lg:px-[72px] overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -left-20 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
            style={{ background: `radial-gradient(circle, ${t.from} 0%, ${t.to} 45%, transparent 70%)` }}
          />
          <div className="relative max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1px] text-neutral-500 mb-6" style={{ fontFamily: "var(--do-font-label)" }}>
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#platform" className="hover:text-black transition-colors">Platform</Link>
              <span>/</span>
              <span className="text-neutral-900">{current.shortName}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] pb-9">
              <div>
                <div
                  className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[12px] font-bold uppercase tracking-[1.5px] shadow-sm mb-4 backdrop-blur-md"
                  style={{
                    fontFamily: "var(--do-font-label)",
                    background: `linear-gradient(150deg, ${t.from} 0%, ${t.to} 100%)`,
                    borderColor: t.border,
                    color: t.accent,
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{current.tag}</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-[64px] lg:leading-[66px] font-normal tracking-tight text-neutral-950">
                  {current.name}
                </h1>
                <p className="mt-4 text-base md:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                  {current.description}
                </p>
              </div>
              <span
                className="text-[11px] font-semibold uppercase tracking-[1px] text-neutral-500 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm px-3.5 py-1.5 shrink-0"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                ABDM Sandbox &bull; DPDP 2023
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 md:px-10 lg:px-[72px]">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative overflow-hidden rounded-[28px] border p-2 sm:p-4 md:p-6 backdrop-blur-2xl"
              style={{
                background: `linear-gradient(165deg, ${t.from}cc 0%, rgba(255,255,255,0.75) 45%, ${t.to}bb 100%)`,
                borderColor: t.border,
                boxShadow: `0 28px 90px ${t.shadow}`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[28px]"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 35%)",
                }}
              />
              <div className="relative">{children}</div>
            </div>
          </div>
        </section>

        <RelatedModules current={current} others={others} />
      </main>
      <Footer />
    </div>
  );
}

function RelatedModules({ current, others }: { current: ModuleMeta; others: ModuleMeta[] }) {
  return (
    <section className="px-6 pb-20 md:px-10 lg:px-[72px]" id="platform">
      <div className="max-w-7xl mx-auto border-t border-black/[0.08] pt-10">
        <div className="flex items-center justify-between gap-4 mb-7">
          <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-neutral-950">
            Explore the rest of the TalkRx ecosystem
          </h2>
          <Link
            href="/#platform"
            className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[1px] text-neutral-600 hover:text-black transition-colors"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            All modules <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {others.map((m) => {
            const Icon = m.icon;
            const t = m.theme;
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(150deg, ${t.from} 0%, ${t.to} 100%)`,
                  borderColor: t.border,
                  boxShadow: `0 14px 34px ${t.shadow}`,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%)" }}
                />
                <span
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl backdrop-blur-md border border-white/60 shadow-sm"
                  style={{ background: t.chip, color: t.accent }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="relative min-w-0">
                  <span className="block text-base font-medium text-neutral-950 group-hover:underline">{m.shortName}</span>
                  <span
                    className="block text-[11px] font-bold mt-1 uppercase tracking-wide"
                    style={{ fontFamily: "var(--do-font-label)", color: t.accent }}
                  >
                    {m.tag}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-neutral-600 hover:text-black transition-colors" style={{ fontFamily: "var(--do-font-label)" }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <span className="text-[11px] text-neutral-400 uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
            Currently viewing: {current.shortName}
          </span>
        </div>
      </div>
    </section>
  );
}
