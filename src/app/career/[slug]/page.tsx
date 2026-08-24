import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { BackButton } from "@/components/sites/demophorius-com-d11dd431/shared/BackButton";
import { InquiryForm } from "@/components/sites/demophorius-com-d11dd431/shared/InquiryForm";
import careers from "@/data/demophorius-com-d11dd431/careers.json";

export function generateStaticParams() {
  return careers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = careers.find((c) => c.slug === slug);
  return { title: job ? `${job.title} – Demophorius healthcare` : "Career" };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = careers.find((c) => c.slug === slug);
  if (!job) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <div className="flex items-center justify-between">
          <BackButton href="/careers/" />
          <div className="text-right text-xs uppercase tracking-[1px] text-[#999]">Published on {job.publishedOn}</div>
        </div>

        <h1 className="mt-8 text-4xl leading-tight lg:text-6xl">{job.title}</h1>

        <div className="mt-8 flex flex-wrap gap-6 border-y border-black/10 py-4 text-sm">
          <div>
            <span className="text-[#999]">Dpt: </span>
            {job.department}
          </div>
          <div>
            <span className="text-[#999]">Type: </span>
            {job.type}
          </div>
          <div>
            <span className="text-[#999]">Code: </span>
            {job.code}
          </div>
        </div>

        <div
          className="prose prose-neutral mt-10 max-w-2xl text-sm leading-relaxed [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
        />

        <section className="mt-20 lg:mt-28">
          <h2 className="text-2xl lg:text-4xl">Apply for this position</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#666]">
            If there&rsquo;s no job opening that apply to your skills and experience, feel free to send us your
            request by filling the form below. We will get back to you as soon as possible.
          </p>
          <div className="mt-8">
            <InquiryForm
              detailsHeader="General information:"
              fields={[
                { name: "full_name", label: "Full name:", required: true },
                { name: "phone_number", label: "Phone number:" },
                { name: "email", label: "Email:", required: true },
                { name: "attachment", label: "Attach your CV:", type: "file", required: true },
              ]}
              successMessage="Thank you for submitting your request."
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
