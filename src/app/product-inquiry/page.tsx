import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryForm } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryForm";

export const metadata: Metadata = { title: "Product inquiry form – Demophorius healthcare" };

export default function ProductInquiryPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Product inquiry form</h1>
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
            <div className="text-sm font-medium uppercase">Are you interested in a specific product?</div>
            <p className="mt-3 text-sm leading-relaxed text-[#666]">
              Please let us know about your product requirement specification and we will get back to you as soon as
              possible. We&rsquo;re curiosity-driven entrepreneurs from over 40 different countries. We&rsquo;ve come
              together to share the power of big ideas, build a meaningful product, and foster a supportive culture
              of self-empowerment, creativity, and trust.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <InquiryForm
            detailsHeader="General information:"
            fields={[
              { name: "full_name", label: "Full name:", required: true },
              { name: "email", label: "Email:", required: true },
              { name: "mobile", label: "Mobile:" },
              { name: "product", label: "Product of interest:" },
            ]}
            textarea={{ label: "Comments:", placeholder: "Should you have any comments, please write them here." }}
            successMessage="Thank you for submitting your request."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
