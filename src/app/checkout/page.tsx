import type { Metadata } from "next";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
