import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import employees from "@/data/demophorius-com-d11dd431/employees.json";

export function generateStaticParams() {
  return employees.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = employees.find((e) => e.slug === slug);
  return { title: e ? `${e.name} – Demophorius healthcare` : "Employee" };
}

export default async function EmployeePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const employee = employees.find((e) => e.slug === slug);
  if (!employee) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
        <div className="flex items-baseline justify-between border-b border-black/10 pb-4">
          <h1 className="text-2xl lg:text-4xl">{employee.name}</h1>
          <time className="text-sm text-[#999]">{employee.date}</time>
        </div>
      </main>
      <Footer />
    </div>
  );
}
