import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { BareArchive } from "@/components/sites/demophorius-com-d11dd431/shared/BareArchive";
import archives from "@/data/demophorius-com-d11dd431/archives.json";

const EMPLOYEE_CATEGORIES = archives.employee_category as Record<string, { title: string; items: { title: string; href: string; date: string }[] }>;

export function generateStaticParams() {
  return Object.keys(EMPLOYEE_CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = EMPLOYEE_CATEGORIES[slug];
  return { title: cat ? `${cat.title} – Demophorius healthcare` : "Category" };
}

export default async function EmployeeCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = EMPLOYEE_CATEGORIES[slug];
  if (!cat) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <BareArchive title={cat.title} items={cat.items} />
      </main>
      <Footer />
    </div>
  );
}
