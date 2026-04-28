import type { Metadata } from "next";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = {
  title: "Order Form",
  description:
    "Order Able Assess sensors and annual data subscriptions. Request a price estimate or send an invoice request.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function OrderPage() {
  return <OrderForm />;
}
