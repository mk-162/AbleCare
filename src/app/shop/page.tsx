import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Able Care assessment kits, replacement devices, platform licenses, and accessories.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}
