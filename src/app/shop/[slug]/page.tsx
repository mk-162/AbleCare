import type { Metadata } from "next";
import { products, getProduct } from "@/lib/products";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
