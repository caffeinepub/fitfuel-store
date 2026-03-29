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

// ─── Real Pintola CDN Images (cdn.shopify.com – publicly accessible, access-control-allow-origin: *) ─
// Source: pintola.in (Shopify store: pintola-online.myshopify.com)

export const FALLBACK_IMAGE =
  "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/01-11_d446c524-4dc6-4543-ae82-d3fdfe7428e2.jpg?v=1751603962";

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
        label: "Dark Chocolate",
        // Pintola High Protein Dark Chocolate Oats – 400g pack
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/01-11_d446c524-4dc6-4543-ae82-d3fdfe7428e2.jpg?v=1751603962",
      },
      {
        label: "Caffe Mocha",
        // Pintola High Protein Dark Chocolate Oats – alternate pack shot
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/02_5.jpg?v=1751603962",
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
      "High protein muesli with real fruits, nuts & cranberry. 18g protein per serving. Great for a power-packed breakfast. No artificial additives, naturally wholesome.",
    variants: [
      {
        label: "Dark Choc & Cranberry",
        // Pintola High Protein Dark Chocolate & Cranberry Muesli – 400g
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/01-400g_036d38df-2958-4daa-9955-bb13c39e1f46.jpg?v=1745572996",
      },
      {
        label: "1kg Pack",
        // Pintola High Protein Dark Chocolate & Cranberry Muesli – 1kg
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/01-1kg_50458ff8-eb03-4a32-8bd4-5616a2d797fb.jpg?v=1745572996",
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
        // Pintola High Protein All Natural Unsweetened – Creamy 510g
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/High_Protein_Unsweetened_Creamy_510gm_600x600_3a0184fa-3ada-440e-b24b-0172023c4929.jpg?v=1732019345",
      },
      {
        label: "Crunchy",
        // Pintola High Protein All Natural Unsweetened – Crunchy 510g
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/High_Protein_Unsweetened_Crunchy_510gm_600x600_c2c7682f-fdb6-4686-90a6-7e7bd3bf7129.jpg?v=1742189095",
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
        label: "Creamy",
        // Pintola American Recipe Performance Peanut Butter – Creamy 1kg
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/American_Recipe_Performance_Creamy_1kg_600x600_50a65ca3-0f87-43db-a7b9-69e7e367d20d.jpg?v=1742190896",
      },
      {
        label: "Crunchy",
        // Pintola American Recipe Performance Peanut Butter – Crunchy 1kg
        image:
          "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/American_Recipe_Performance_Crunchy_1kg_600x600_5fee4378-78a1-41e3-b966-f3da43a940cd.jpg?v=1742190896",
      },
    ],
    sizes: [{ label: "1kg", mrp: 575, price: 450, discountPct: 22 }],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
