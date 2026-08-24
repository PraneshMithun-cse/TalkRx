import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryForm } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryForm";
import { CircleArrowRightIcon } from "@/components/sites/demophorius-com-d11dd431/shared/icons";
import { resolveImage } from "@/components/sites/demophorius-com-d11dd431/shared/resolve-image";

export const metadata: Metadata = { title: "Demophorius Healthcare – Contact us" };

export default function ContactUsPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <h1 className="text-4xl leading-tight lg:text-6xl">Demophorius Healthcare</h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <address className="not-italic text-lg leading-relaxed">
              196, Archbishop
              <br />
              Makarios III Avenue
              <br />
              Limassol, CY-3030 Cyprus
            </address>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <div>
                <span className="text-[#999]">E </span>
                <a href="mailto:info@demophorius.com" className="hover:underline">info@demophorius.com</a>
              </div>
              <div>
                <span className="text-[#999]">T </span>
                <a href="tel:+35725749896" className="hover:underline">+357 25 74 98 96</a>
              </div>
              <div>
                <span className="text-[#999]">F </span>
                +357 25 74 99 07
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/Demophorius+Healthcare/@34.6876414,33.0423453,17z"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 text-sm"
            >
              <CircleArrowRightIcon className="h-8 w-8 rounded-full border border-black p-2" />
              Find us on Google maps
            </a>
          </div>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-[#f3f1f2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImage("https://demophorius.com/wp-content/uploads/2021/08/New-Project.jpg")}
              alt="Demophorius offices"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <section className="mt-20 lg:mt-28">
          <h2 className="text-2xl lg:text-4xl">Send us your inquiry</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#666]">
            We are always here to help you out and provide you with solutions. Should you have any special
            requirements or inquiry, please fill the form below and we will get back to you as soon as possible.
          </p>
          <div className="mt-8">
            <InquiryForm
              detailsHeader="General information:"
              fields={[
                { name: "full_name", label: "Full name:", required: true },
                { name: "email", label: "Email:", required: true },
                { name: "mobile", label: "Mobile:" },
                { name: "country", label: "Country:", required: true },
                { name: "org", label: "Hospital, distributor or public sector:" },
              ]}
              radioGroup={{
                label: "Department you would like to contact: *",
                options: ["Administration", "Sales", "Accounting & Finance", "Quality", "Regulatory", "Logistics", "Other"],
              }}
              textarea={{ label: "Comments:", placeholder: "Should you have any comments, please write them here." }}
              successMessage="Thank you for submitting your request."
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
