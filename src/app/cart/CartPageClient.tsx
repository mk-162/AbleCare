"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export function CartPageClient() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  const shipping = subtotal >= 250 ? 0 : 14.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Header */}
      <section className="bg-white pt-32 pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ac-black">
            Your cart
          </h1>
          {itemCount > 0 && (
            <p className="text-sm text-ac-black/50 mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <ShoppingBag className="w-12 h-12 text-ac-black/15 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-ac-black mb-2">
                Your cart is empty
              </h2>
              <p className="text-ac-black/50 mb-6">
                Browse our products and add items to get started.
              </p>
              <Link href="/shop">
                <Button className="rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold px-8">
                  Browse products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Line items */}
              <div className="lg:col-span-2">
                <div className="border-b border-black/5 pb-2 mb-4 hidden sm:grid grid-cols-[1fr_120px_100px_48px] gap-4 text-xs font-medium uppercase tracking-wider text-ac-black/40">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                <ul className="divide-y divide-black/5">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="py-5 grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_48px] gap-4 items-center"
                    >
                      {/* Product info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-ac-grey/25 flex-shrink-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-ac-blue/15">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            className="font-semibold text-ac-black hover:text-ac-blue transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-ac-black/50 mt-0.5">
                            ${item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-black/10 rounded-full overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-ac-grey/50 disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-ac-grey/50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="text-right font-bold text-ac-black text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Remove */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-ac-black/30 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-ac-blue hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-sm text-ac-black/40 hover:text-red-500 transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-ac-grey/15 rounded-2xl p-6 sticky top-28">
                  <h2 className="font-bold text-ac-black mb-5">
                    Order summary
                  </h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ac-black/60">Subtotal</dt>
                      <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ac-black/60">Shipping</dt>
                      <dd className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </dd>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-ac-black/40">
                        Free shipping on orders over $250
                      </p>
                    )}
                    <div className="flex justify-between pt-3 border-t border-black/10 text-base">
                      <dt className="font-bold">Total</dt>
                      <dd className="font-bold">${total.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <Link href="/checkout" className="block mt-6">
                    <Button
                      size="lg"
                      className="w-full rounded-full bg-ac-blue text-white hover:bg-ac-blue/90 font-bold h-12"
                    >
                      Proceed to checkout
                    </Button>
                  </Link>

                  <div className="mt-5 text-center space-y-1">
                    <p className="text-xs text-ac-black/40">
                      Secure checkout · 30-day returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
