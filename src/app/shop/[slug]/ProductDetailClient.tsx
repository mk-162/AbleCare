"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Minus, Plus, ShoppingBag, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/products";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const gallery = product.images.length > 0 ? product.images : [product.image];

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  function handleAdd() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white pt-28 pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-ac-black/50" aria-label="Breadcrumb">
            <Link href="/shop" className="hover:text-ac-blue transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ac-black/70">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="relative aspect-square rounded-3xl bg-ac-grey/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ac-blue/5 via-ac-aqua/10 to-ac-grey/20" />
                <Image
                  key={gallery[activeImage]}
                  src={gallery[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-8"
                  priority
                />
                {product.badge && (
                  <span className="absolute top-5 left-5 bg-ac-blue text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`Show image ${i + 1}`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                        activeImage === i ? "border-ac-blue" : "border-transparent hover:border-ac-blue/40"
                      } bg-ac-grey/20`}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} — view ${i + 1}`}
                        fill
                        sizes="160px"
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ac-blue/60 mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-ac-black leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-ac-black">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-ac-black/35 line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    Save ${product.compareAtPrice - product.price}
                  </span>
                )}
              </div>

              <p className="text-base text-ac-black/70 leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-black/10 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-ac-grey/50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-ac-grey/50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAdd}
                  className={`rounded-full font-bold px-8 h-12 gap-2 transition-all ${
                    added
                      ? "bg-green-600 hover:bg-green-600 text-white"
                      : "bg-ac-blue text-white hover:bg-ac-blue/90"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to cart
                    </>
                  )}
                </Button>
              </div>

              {/* Features list */}
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ac-black/50 mb-3">
                  What&apos;s included
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm text-ac-black/75"
                    >
                      <Check className="w-4 h-4 text-ac-aqua flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs */}
              {product.specs.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ac-black/50 mb-3">
                    Specifications
                  </h2>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="flex flex-col">
                        <dt className="text-xs text-ac-black/45">
                          {spec.label}
                        </dt>
                        <dd className="text-sm font-medium text-ac-black/80">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-16 bg-ac-grey/15 border-t border-black/5">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold text-ac-black mb-8">
              You might also need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-ac-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all products
          </Link>
        </div>
      </div>
    </>
  );
}
