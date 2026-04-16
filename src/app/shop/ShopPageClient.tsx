"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { products, categories } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function ShopPageClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { itemCount } = useCart();

  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ac-blue text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, #00FFD2, transparent)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-36 pb-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ac-aqua mb-4">
                Shop
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                Assessment kits &amp; accessories
              </h1>
              <p className="text-lg text-white/80 max-w-xl font-light">
                Everything you need to run fast, objective falls risk screenings
                — from starter kits to team licenses.
              </p>
            </motion.div>

            {/* Cart shortcut */}
            {itemCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 bg-ac-aqua text-ac-black font-bold px-5 py-3 rounded-full hover:bg-white transition-colors text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View cart ({itemCount})
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute left-0 bottom-0 w-full leading-none" aria-hidden="true" style={{ marginBottom: "-1px" }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full" style={{ height: "60px" }}>
            <path
              fill="#ffffff"
              d="M0,60 L0,20 C360,55 720,0 1080,30 C1260,45 1380,25 1440,20 L1440,60 Z"
            />
          </svg>
        </div>
      </section>

      {/* Category filter + Product grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-ac-blue text-white"
                  : "bg-ac-grey/40 text-ac-black/70 hover:bg-ac-grey"
              }`}
            >
              All products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-ac-blue text-white"
                    : "bg-ac-grey/40 text-ac-black/70 hover:bg-ac-grey"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-ac-black/50 py-16">
              No products in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-black/5 py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Free shipping",
                desc: "On orders over $250",
              },
              {
                title: "2-year warranty",
                desc: "On all hardware devices",
              },
              {
                title: "30-day returns",
                desc: "No questions asked",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-bold text-ac-black mb-1">{item.title}</h3>
                <p className="text-sm text-ac-black/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
