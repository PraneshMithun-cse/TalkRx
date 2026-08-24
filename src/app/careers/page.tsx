import type { Metadata } from "next";
import Link from "next/link";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryForm } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryForm";
import careers from "@/data/demophorius-com-d11dd431/careers.json";

export const metadata: Metadata = { title: "Join our team – Demophorius healthcare" };

export default function CareersPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Join our team</h1>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium uppercase">Contact Demophorius Healthcare Ltd</div>
            <p className="mt-3 text-sm leading-relaxed text-[#666]">
              196 Archbishop Makarios III Ave
              <br />
              Limassol, CY-3030 – Cyprus
              <br />
              E. <a href="mailto:info@demophorius.com" className="hover:underline">info@demophorius.com</a>
              <br />
              T. <a href="tel:+35725749896" className="hover:underline">+357 25 74 98 96</a>
              <br />
              F. +357 25 74 99 07
            </p>
          </div>
          <div>
            <div className="text-sm font-medium uppercase">Elevate your career</div>
            <p className="mt-3 text-sm leading-relaxed text-[#666]">
              Do meaningful work. Take ownership. Never stop learning. Are you interested in working with us?
              We&rsquo;re curiosity-driven entrepreneurs from over 40 different countries. We&rsquo;ve come together
              to share the power of big ideas, build a meaningful product, and foster a supportive culture of
              self-empowerment, creativity, and trust.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <div className="text-xs font-medium uppercase tracking-[1px]">Open positions</div>
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {careers.map((c) => (
              <li key={c.slug}>
                <Link href={`/career/${c.slug}/`} className="flex items-center justify-between py-5">
                  <span className="text-lg">{c.title}</span>
                  <span className="text-xs uppercase tracking-wide text-[#999]">{c.department}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-20 lg:mt-28">
          <h2 className="text-2xl lg:text-4xl">Apply unsolicitedly</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#666]">
            If there&rsquo;s no job opening that apply to your skills and experience, feel free to send us your
            request by filling the form below. We will get back to you as soon as possible.
          </p>
          <div className="mt-8">
            <InquiryForm
              detailsHeader="General information:"
              fields={[
                { name: "full_name", label: "Full name:", required: true },
                { name: "email", label: "Email:", required: true },
                { name: "mobile", label: "Mobile:" },
                { name: "attachment", label: "Attach your CV:", type: "file", required: true },
              ]}
              textarea={{ label: "Interested in:", placeholder: "Tell us a little bit about the job position you would like to fill..." }}
              successMessage="Thank you for submitting your request."
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
