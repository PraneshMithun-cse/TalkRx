import type { Metadata } from "next";
import Link from "next/link";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";

export const metadata: Metadata = { title: "Sitemap – Demophorius healthcare" };

const SECTIONS = [
  {
    title: "Homepage",
    href: "/",
    children: [],
  },
  {
    title: "About us",
    href: "/about-us/",
    children: [
      { title: "Team", href: "/team/" },
      { title: "Timeline", href: "/timeline/" },
      { title: "Terms and Conditions of Sale", href: "/about-us/terms-and-conditions-of-sale/" },
    ],
  },
  {
    title: "Products",
    href: "/products/",
    children: [
      { title: "demotek", href: "/category/demotek/" },
      { title: "d·vac", href: "/category/d-vac/" },
      { title: "d·mach", href: "/category/d-mach/" },
      { title: "d·tek", href: "/category/d-tek/" },
      { title: "demoflush", href: "/category/demoflush/" },
    ],
  },
  { title: "Demophorius Lab", href: "/demophorius-lab/", children: [] },
  { title: "Career", href: "/careers/", children: [] },
  { title: "Media & News", href: "/media-news/", children: [] },
  { title: "Contact us", href: "/contact-us/", children: [] },
];

export default function SitemapPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <div className="max-w-2xl">
          {SECTIONS.map((s, i) => (
            <div key={s.href}>
              {i > 0 && <hr className="my-6 border-t border-black/10" />}
              <Link href={s.href} className="text-2xl uppercase hover:underline lg:text-3xl">
                {s.title}
              </Link>
              {s.children.length > 0 && (
                <ul className="mt-3 list-none space-y-1">
                  {s.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-lg hover:underline">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <hr className="my-6 border-t border-black/10" />
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy/" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-conditions/" className="hover:underline">Terms &amp; Conditions</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
