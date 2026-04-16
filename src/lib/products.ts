export interface Product {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  category: string;
  badge?: string;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  inStock: boolean;
}

/**
 * Product catalog.
 * Launching with a single product — the GripAble sensor.
 * When a headless e-commerce backend is connected, replace this with API calls.
 */
export const products: Product[] = [
  {
    slug: "gripable-sensor",
    name: "The GripAble Sensor",
    price: 299,
    image: "/images/product/gripable-sensor-cutout-min.png",
    images: [
      "/images/product/gripable-sensor-cutout-min.png",
      "/images/product/hand-holding-gripable-w-bg-resized-min.jpg",
      "/images/product/sensor-on-podium-min.jpg",
      "/images/product/gripable-sensor-with-tablets-1054x722-min.png",
    ],
    category: "Devices",
    badge: "Flagship Device",
    shortDescription:
      "One best-in-class sensor, many applications. Clinical-grade digital grip strength measurement in the palm of your hand.",
    description:
      "The GripAble sensor is the heart of the Able Assess platform — a best-in-class, clinical-grade sensor that captures grip strength with lab-level accuracy, then pairs with any smartphone or tablet for instant, objective assessment. Designed for the bedside, the kitchen table and everywhere in between, it unlocks falls screening, functional assessment and the fifth vital sign in a single device.",
    features: [
      "Clinical-grade grip strength capture",
      "Pairs with any iOS or Android smartphone or tablet via Bluetooth",
      "Under five minutes per assessment",
      "Usable by clinical and non-clinical staff",
      "Works for falls prevention, grip strength screening and rehabilitation",
      "Kit includes sensor, pouch and measuring tape",
    ],
    specs: [
      { label: "Connectivity", value: "Bluetooth 5.0" },
      { label: "Compatibility", value: "iOS and Android" },
      { label: "Battery", value: "Replaceable, 6-month typical life" },
      { label: "In the box", value: "Sensor, pouch, measuring tape" },
      { label: "Certification", value: "FDA listed, CE marked" },
      { label: "Warranty", value: "2 years" },
    ],
    inStock: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export const categories = [...new Set(products.map((p) => p.category))];
