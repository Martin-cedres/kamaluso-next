// /data/products.ts

export interface Variant {
  tipo: "tapa-flex" | "tapa-dura";
  price: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  images: string[];
  description: string;
  price: number;
  destacado?: boolean; // Optional 
  category: "productos";
  subcategory: "sublimables" | "personalizados";
  variantes?: Variant[]; // Opcional: solo para personalizados para establecer precios distintos en tapa dura y tapa flex
}

export const products: Product[] = [
  {
    id: 1,
    name: "Agenda Semanal 2026",
    slug: "agenda-semanal-2026",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Agenda semanal 2026 con diseño moderno y práctico para organizar tus días.",
    price: 170,
    destacado: true, //Si va a destacados True, si no va a destacados False
    category: "productos",
    subcategory: "sublimables",

  },
  {
    id: 2,
    name: "Recetario Personalizado",
    slug: "recetario-personalizado",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Recetario personalizado con tapa dura y hojas de alta calidad.",
    price: 1500,
    destacado: true,
    category: "productos",
    subcategory: "personalizados",
    variantes: [
      { tipo: "tapa-flex", price: 1500 },
      { tipo: "tapa-dura", price: 1800 },
    ],
  },

  {
    id: 3,
    name: "Cuaderno sublimable",
    slug: "cuaderno-sublimable",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Cuaderno sublimable con tapa flexible, ideal para personalizar con tus diseños.",
    price: 150,
    destacado: true,
    category: "productos",
    subcategory: "sublimables",

  },


  {
    id: 4,
    name: "Recetario Personalizado",
    slug: "recetario-personalizado",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Recetario personalizado con tapa flexible y hojas de alta calidad.",
    price: 1500,
    destacado: false,
    category: "productos",
    subcategory: "personalizados",
     variantes: [
      { tipo: "tapa-flex", price: 400 },
      { tipo: "tapa-dura", price: 500 },
    ],

  },

  {
    id: 5,
    name: "Cuaderno Personalizado",
    slug: "cuaderno-personalizado",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Cuaderno personalizado con tapa dura, ideal para tus notas y dibujos.",
    price: 2000,
    destacado: false,
    category: "productos",
    subcategory: "personalizados",
     variantes: [
      { tipo: "tapa-flex", price: 350 },
      { tipo: "tapa-dura", price: 450 },
    ],
  },

  {
    id: 6,
    name: "Cuaderno Sublimable",
    slug: "cuaderno-sublimable",
    images: [
      "/img/agenda1.webp",
      "/img/agenda2.webp",
      "/img/agenda3.webp",
    ],
    description:
      "Cuaderno sublimable con tapa flexible, perfecto para personalizar con tus diseños.",
    price: 150,
    destacado: false,
    category: "productos",
    subcategory: "sublimables",

  },


];