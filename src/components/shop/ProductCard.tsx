"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative flex flex-col bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300"
    >
      {/* Image area */}
      <Link href={`/shop/${product.slug}`} className="relative aspect-[4/3] bg-ac-grey/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ac-blue/5 via-ac-aqua/10 to-ac-grey/20" />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          priority={index < 3}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-ac-blue text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ac-blue/60 mb-1.5">
          {product.category}
        </span>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-lg font-bold text-ac-black leading-snug mb-2 group-hover:text-ac-blue transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-ac-black/60 leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-ac-black">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-ac-black/40 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 gap-1.5 px-4"
            onClick={(e) => {
              e.preventDefault();
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
