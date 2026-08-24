import type { Metadata } from "next";
import Link from "next/link";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryCta } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryCta";
import { resolveImage } from "@/components/sites/demophorius-com-d11dd431/shared/resolve-image";

export const metadata: Metadata = { title: "About Demophorius – Demophorius healthcare" };

const BELIEFS = [
  {
    index: "01",
    title: "International quality control standards",
    description: "Demophorius manufacturing facilities have been selected to satisfy international quality control standards.",
  },
  {
    index: "02",
    title: "Customer-centered approach",
    description: "Our customer-centered approach to product development is reinforced by listening and understanding our customers' needs.",
  },
  {
    index: "03",
    title: "Experienced and well qualified sales executives",
    description: "Provide support to existing as well as to potential distributors through regular contact and visits.",
  },
  {
    index: "04",
    title: "An ever-expanding worldwide distributor network",
    description: "Undertakes the efficient distribution of our products range, while our company representatives' support through regular visits reinforces the company's presence in those markets.",
  },
];

const DISTRIBUTION_POINTS = [
  "Athina, Greece",
  "Konstantinoupoleos 100, Athina, Greece",
  "Marikas Kotopouli 1, Athina, Greece",
  "La Güera, Western Sahara",
  "New York, NY, USA",
];

const LINKS = [
  { title: "Product Categories", subtitle: "our story through time", href: "/products/", image: "https://demophorius.com/wp-content/uploads/2021/03/image-1.jpg" },
  { title: "Demophorius lab", subtitle: "reinventing the future", href: "/demophorius-lab/", image: "https://demophorius.com/wp-content/uploads/2021/01/dummy.jpg" },
  { title: "Timeline", subtitle: "our story through time", href: "/timeline/", image: "https://demophorius.com/wp-content/uploads/2021/02/timeline.png" },
];

export default function AboutUsPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <section>
          <h1 className="text-4xl leading-tight lg:text-6xl">About Demophorius</h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed">
            <p>
              At Demophorius Healthcare, we believe in the power of medical technology to provide high-quality as
              well as safe and effective healthcare products at the same time. Founded in May 1996 in Limassol
              Cyprus, for over two decades, Demophorius Healthcare has been characterised by reliability and loyalty
              to the patient, continuously striving to contribute to human health.
            </p>
            <p>
              Our manufacturing facilities comply with the highest international quality control standards for
              healthcare. Our ISO and CE certifications stand proof. Demophorius&rsquo; aim is therefore to deliver
              quality healthcare services and products in full conformity with client requirements, on time and at
              the most competitive prices.
            </p>
            <p>
              Demophorius Healthcare is a global provider of medical devices dedicated to improving health and
              quality of people&rsquo;s lives.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveImage("https://demophorius.com/wp-content/uploads/2021/09/About-us-Offices-Demophorius-01.jpg")} alt="Demophorius offices" className="aspect-[4/3] w-full rounded-[10px] object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveImage("https://demophorius.com/wp-content/uploads/2021/09/About-us-Offices-Demophorius-02.jpg")} alt="Demophorius offices" className="aspect-[4/3] w-full rounded-[10px] object-cover" />
          </div>
        </section>

        <section className="mt-20 lg:mt-28">
          <div className="text-xs font-medium uppercase tracking-[1px]">A solid set of beliefs</div>
          <ul className="mt-6 list-none divide-y divide-black/10 border-t border-black/10">
            {BELIEFS.map((b) => (
              <li key={b.index} className="flex flex-col gap-4 py-8 lg:flex-row lg:items-start">
                <div className="text-4xl text-[#ccc] lg:w-24 lg:text-5xl">{b.index}</div>
                <div>
                  <div className="text-xl lg:text-2xl">{b.title}</div>
                  <p className="mt-2 max-w-xl text-sm text-[#666]">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 lg:mt-28">
          <div className="text-xs font-medium uppercase tracking-[1px]">Available distribution points</div>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DISTRIBUTION_POINTS.map((p) => (
              <li key={p} className="rounded-[10px] border border-black/10 px-4 py-3 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 max-w-2xl lg:mt-28">
          <blockquote className="space-y-4 text-lg leading-relaxed">
            <p>
              Being a proud member of this family for over 20 years, I have watched the company grow on the strong
              foundations set by its creator Anthony Gibbs and develop into one of the leading companies in its
              field.
            </p>
            <p>
              Today, our products are known as a guarantee of health and are used by thousands of doctors, clinics
              and hospitals worldwide. While growing, our focus remains on developing our relations with existing
              clients while at the same time welcoming new ones.
            </p>
            <p>Sharing a drive for perfection is what leads us to constant improvement and brings us closer to you.</p>
            <p className="font-medium">Demophorius is not just a company; it is a culture.</p>
          </blockquote>
          <div className="mt-8">
            <div className="text-base">Sakis Papaspyrou</div>
            <div className="text-xs uppercase tracking-[1px] text-[#666]">CEO, Demophorius Healthcare</div>
          </div>
        </section>

        <section className="mt-20 lg:mt-28">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-[#f3f1f2] p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImage(l.image)} alt={l.title} className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative z-[1] text-xl text-white drop-shadow">{l.title}</div>
              </Link>
            ))}
          </ul>
        </section>

        <InquiryCta title="Do you have any question?" subtitle="Contact us" href="/contact-us/" />
      </main>
      <Footer />
    </div>
  );
}
