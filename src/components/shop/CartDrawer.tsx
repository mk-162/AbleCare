"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <h2 className="text-lg font-bold text-ac-black">Your cart</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ac-grey/50 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-ac-black/50 mb-4">Your cart is empty</p>
                  <Link href="/shop" onClick={onClose}>
                    <Button className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90">
                      Browse products
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.slug}
                      className="flex gap-4 py-3 border-b border-black/5 last:border-0"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="w-16 h-16 rounded-xl bg-ac-grey/30 flex-shrink-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-ac-blue/20">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-semibold text-ac-black hover:text-ac-blue transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-bold text-ac-black/80 mt-0.5">
                          ${item.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-black/10 hover:bg-ac-grey/50 disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-black/10 hover:bg-ac-grey/50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="ml-auto w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-ac-black/40 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-black/5 px-6 py-5 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-ac-black/60">Subtotal</span>
                  <span className="font-bold text-ac-black">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold h-12"
                  >
                    Checkout
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block text-center text-sm text-ac-blue hover:underline"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
