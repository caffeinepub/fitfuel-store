// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductSize {
  label: string; // e.g. "1kg", "400g", "510g"
  mrp: number; // MRP in rupees
  price: number; // selling price in rupees
  discountPct: number;
}

export interface ProductVariant {
  label: string; // e.g. "Caffe Mocha", "Creamy"
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  variants: ProductVariant[];
  sizes: ProductSize[];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "hp-oats",
    name: "Pintola High Protein Oats",
    category: "Oats",
    description:
      "Packed with 20g protein per serving. Made with whole grain oats, perfect for post-workout recovery. No added sugar, naturally gluten-free, FSSAI approved.",
    variants: [
      {
        label: "Caffe Mocha",
        image: "https://www.pintola.in/cdn/shop/files/HPoats-caffe-mocha.jpg",
      },
      {
        label: "Dark Chocolate",
        image: "https://www.pintola.in/cdn/shop/files/HPoats-dark-choco.jpg",
      },
    ],
    sizes: [
      { label: "1kg", mrp: 620, price: 500, discountPct: 19 },
      { label: "400g", mrp: 310, price: 250, discountPct: 19 },
    ],
  },
  {
    id: "hp-muesli",
    name: "Pintola High Protein Muesli",
    category: "Muesli",
    description:
      "High protein muesli with real fruits & nuts. 18g protein per serving. Great for a power-packed breakfast. No artificial additives, naturally wholesome.",
    variants: [
      {
        label: "Fruits & Nuts",
        image:
          "https://www.pintola.in/cdn/shop/files/HP-Muesli-FruitsNNuts.jpg",
      },
      {
        label: "Cranberry",
        image: "https://www.pintola.in/cdn/shop/files/HP-Muesli-Cranberry.jpg",
      },
    ],
    sizes: [
      { label: "1kg", mrp: 710, price: 600, discountPct: 15 },
      { label: "400g", mrp: 325, price: 275, discountPct: 15 },
    ],
  },
  {
    id: "hp-peanut-butter",
    name: "Pintola High Protein Peanut Butter",
    category: "Peanut Butter",
    description:
      "30g protein per 100g. No added sugar, no hydrogenated oils. Pure protein power for serious athletes. Supercharged with whey protein for maximum muscle gains.",
    variants: [
      {
        label: "Creamy",
        image: "https://www.pintola.in/cdn/shop/files/HP-PB-Creamy.jpg",
      },
      {
        label: "Crunchy",
        image: "https://www.pintola.in/cdn/shop/files/HP-PB-Crunchy.jpg",
      },
    ],
    sizes: [
      { label: "1kg", mrp: 665, price: 500, discountPct: 25 },
      { label: "510g", mrp: 355, price: 300, discountPct: 15 },
    ],
  },
  {
    id: "perf-peanut-butter",
    name: "Pintola Performance Peanut Butter",
    category: "Peanut Butter",
    description:
      "Engineered for peak performance. Loaded with BCAAs, protein, and healthy fats. Your pre-workout fuel. No palm oil, no trans fat, no artificial preservatives.",
    variants: [
      {
        label: "Original",
        image: "https://www.pintola.in/cdn/shop/files/Performance-PB.jpg",
      },
    ],
    sizes: [{ label: "1kg", mrp: 575, price: 450, discountPct: 22 }],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
