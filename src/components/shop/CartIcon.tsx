"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-ac-grey/40 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-5 h-5 text-ac-black" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-ac-blue text-white text-[10px] font-bold rounded-full leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
