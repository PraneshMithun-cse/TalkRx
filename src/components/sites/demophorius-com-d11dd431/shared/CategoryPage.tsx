import Link from "next/link";
import { BackButton } from "./BackButton";
import { InquiryCta } from "./InquiryCta";
import { resolveImage } from "./resolve-image";
import { BRAND_LOGOS } from "./icons";
import type { CategoryPageData } from "./types";

export function CategoryPage({ category }: { category: CategoryPageData }) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <BackButton href={category.backHref || "/products/"} />
          <div className="text-sm">
            {category.breadcrumb.map((b, i) => (
              <span key={b.href}>
                <Link href={b.href} className="uppercase hover:underline">
                  {b.label}
                </Link>
                {i < category.breadcrumb.length - 1 && <span className="mx-1">/</span>}
              </span>
            ))}
          </div>
        </div>

        {category.dropdownOptions.length > 0 && (
          <div className="text-xs uppercase tracking-[1px] text-[#666]" style={{ fontFamily: "var(--do-font-label)" }}>
            {category.dropdownOptions.map((o, i) => (
              <span key={o.href}>
                <Link href={o.href} className="hover:text-black hover:underline">
                  {o.label}
                </Link>
                {i < category.dropdownOptions.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <h1 className="mt-8 text-4xl uppercase leading-none lg:text-[64px]">{category.title}</h1>
      {category.description && <p className="mt-4 max-w-2xl text-base leading-relaxed">{category.description}</p>}

      {category.subcategories.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.subcategories.map((s, i) => (
            <Link key={s.href} href={s.href} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-[10px] bg-[#f3f1f2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(s.image)} alt={s.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-3 text-xs text-[#999]">#{i + 1}</div>
              <div className="mt-1 text-lg">{s.name}</div>
              {s.descriptionSmall && <div className="mt-1 text-sm text-[#666]">{s.descriptionSmall}</div>}
            </Link>
          ))}
        </div>
      )}

      {category.products.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {category.products.map((p) => (
            <Link key={p.href} href={p.href} className="group block">
              <div className="aspect-square overflow-hidden rounded-[10px] bg-[#f3f1f2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(p.image)} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              {p.codes.length > 0 && (
                <div className="mt-2 text-[11px] uppercase tracking-[1px] text-[#999]" style={{ fontFamily: "var(--do-font-label)" }}>
                  {p.codes.join(", ")}
                </div>
              )}
              <div className="mt-1 text-sm">{p.title}</div>
            </Link>
          ))}
        </div>
      )}

      {category.subcategories.length === 0 && category.products.length === 0 && (
        <p className="mt-12 text-sm text-[#999]">This category is temporarily unavailable.</p>
      )}

      {category.hasBrandsCrossSell && (
        <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-black/10 pt-8">
          <span className="text-xs uppercase tracking-[1px] text-[#999]" style={{ fontFamily: "var(--do-font-label)" }}>
            Explore other brands:
          </span>
          {Object.entries(BRAND_LOGOS).map(([key, src]) => (
            <Link key={key} href={`/category/${key === "dtek" ? "d-tek" : key === "dvac" ? "d-vac" : key === "dmach" ? "d-mach" : key}/`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={key} className="h-6 w-auto opacity-70 hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}

      <InquiryCta title="Do you need more info?" subtitle="Send us your inquiry" href="/product-inquiry/" />
    </div>
  );
}
