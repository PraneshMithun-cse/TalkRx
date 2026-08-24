import Link from "next/link";
import { BackButton } from "./BackButton";
import { InquiryCta } from "./InquiryCta";
import { resolveImage } from "./resolve-image";
import type { ProductDetailData, BreadcrumbLink } from "./types";

function isBreadcrumbArray(v: unknown): v is BreadcrumbLink[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0] !== null && "href" in (v[0] as object);
}

export function ProductDetail({ product }: { product: ProductDetailData }) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
      <div className="flex items-center gap-4">
        <BackButton href={product.breadcrumb[product.breadcrumb.length - 1]?.href ?? "/products/"} />
        <div className="text-sm">
          {product.breadcrumb.map((b, i) => (
            <span key={b.href}>
              <Link href={b.href} className="uppercase hover:underline">
                {b.label}
              </Link>
              {i < product.breadcrumb.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
        <div className="order-2 aspect-[4/5] overflow-hidden rounded-[10px] bg-[#f3f1f2] lg:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveImage(product.image)} alt={product.title} className="h-full w-full object-cover" />
        </div>

        <div className="order-1 lg:order-2">
          {product.codes.length > 0 && (
            <ul className="flex flex-wrap gap-3 text-xs uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
              {product.codes.map((c) => (
                <li key={c} className="rounded-full border border-black/20 px-3 py-1">
                  {c}
                </li>
              ))}
            </ul>
          )}
          <h1 className="mt-4 text-3xl leading-tight lg:text-5xl">{product.title}</h1>

          {product.descriptionSmall && <p className="mt-6 text-base leading-relaxed">{product.descriptionSmall}</p>}
          {product.description && <p className="mt-4 text-sm leading-relaxed text-[#666]">{product.description}</p>}

          {product.specRows.length > 0 && (
            <div className="mt-10">
              <div className="text-xs font-medium uppercase tracking-[1px]">Specification</div>
              <hr className="mt-3 border-t border-black" />
              {product.specRows.map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-4 border-b border-black/10 py-3 text-sm">
                  <div className="col-span-1 uppercase text-[#666]">{row.label}</div>
                  <div className="col-span-2">
                    {isBreadcrumbArray(row.value) ? (
                      <ul>
                        {row.value.map((v) => (
                          <li key={v.href}>
                            <Link href={v.href} className="hover:underline">
                              {v.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : Array.isArray(row.value) ? (
                      row.value.map((v, i) => <div key={i}>{v}</div>)
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {product.variants.length > 1 && (
            <div className="mt-10">
              <div className="text-xs font-medium uppercase tracking-[1px]">Other variants</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Link
                    key={v.href}
                    href={v.href}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${v.label === product.currentVariant ? "border-black bg-black text-white" : "border-black/20 hover:border-black"}`}
                  >
                    {v.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <InquiryCta title="Do you need more info?" subtitle="Send us your inquiry" href="/product-inquiry/" />
    </div>
  );
}
