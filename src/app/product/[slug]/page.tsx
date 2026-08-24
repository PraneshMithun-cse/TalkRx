import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";
import { ProductDetail } from "@/components/sites/demophorius-com-d11dd431/shared/ProductDetail";
import products from "@/data/demophorius-com-d11dd431/products.json";
import type { ProductDetailData } from "@/components/sites/demophorius-com-d11dd431/shared/types";

const PRODUCTS = products as ProductDetailData[];

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  return { title: product ? `${product.title} – Demophorius healthcare` : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  );
}
