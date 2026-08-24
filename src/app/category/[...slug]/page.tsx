import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { CategoryPage as CategoryPageView } from "@/components/sites/demophorius-com-d11dd431/shared/CategoryPage";
import categories from "@/data/demophorius-com-d11dd431/categories.json";
import type { CategoryPageData } from "@/components/sites/demophorius-com-d11dd431/shared/types";

const CATEGORIES = categories as CategoryPageData[];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    slug: c.path.split("/").filter(Boolean).slice(1),
  }));
}

function findCategory(slug: string[]) {
  const path = `/category/${slug.join("/")}/`;
  return CATEGORIES.find((c) => c.path === path);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  return { title: category ? `${category.title} – Demophorius healthcare` : "Category" };
}

export default async function CategoryRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <CategoryPageView category={category} />
      </main>
      <Footer />
    </div>
  );
}
