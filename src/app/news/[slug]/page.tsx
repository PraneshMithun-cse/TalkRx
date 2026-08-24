import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { NewsArticle } from "@/components/sites/demophorius-com-d11dd431/shared/NewsArticle";
import news from "@/data/demophorius-com-d11dd431/news.json";
import type { NewsArticleData } from "@/components/sites/demophorius-com-d11dd431/shared/types";

const NEWS = news as NewsArticleData[];

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = NEWS.find((n) => n.slug === slug);
  return { title: article ? `${article.title} – Demophorius healthcare` : "News" };
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = NEWS.find((n) => n.slug === slug);
  if (!article) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <NewsArticle article={article} />
      </main>
      <Footer />
    </div>
  );
}
