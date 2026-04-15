import type { Metadata } from "next";
import { RoiCalculator } from "./RoiCalculator";

export const metadata: Metadata = {
  title: "Savings Calculator",
  description:
    "See how much a care home could save in additional care costs by preventing falls with Able Care. Adjust residents and savings per prevented fall to model your own numbers.",
};

export default function RoiCalculatorPage() {
  return <RoiCalculator />;
}
