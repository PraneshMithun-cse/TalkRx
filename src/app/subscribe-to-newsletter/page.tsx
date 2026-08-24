import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { InquiryForm } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryForm";

export const metadata: Metadata = { title: "Subscribe to our newsletter – Demophorius healthcare" };

export default function SubscribeToNewsletterPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-6 py-16 md:px-10 lg:px-[72px]">
        <div className="w-full max-w-xl">
          <InquiryForm
            detailsHeader="Subscribe to our newsletter:"
            fields={[
              { name: "first_name", label: "First name:", required: true },
              { name: "last_name", label: "Last name:", required: true },
              { name: "email", label: "Email:", required: true },
              { name: "company", label: "Company:", required: true },
              { name: "country", label: "Country:", required: true },
            ]}
            successMessage="Thank you for registering to our newsletter."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
