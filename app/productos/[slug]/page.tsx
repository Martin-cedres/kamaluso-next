import React from "react";
import ProductDetailClient from "@/components/ProductDetailClient";
import Product, { IProduct } from "@/models/product";
import connectDB from "@/lib/dbConnect";

interface Variant {
  tipo: "tapa-dura" | "tapa-flex";
  price: number;
}

interface ProductType {
  id: string;
  name: string;
  slug: string;
  images: string[];
  description: string;
  destacado?: boolean;
  category: "productos";
  subcategory: "sublimables" | "personalizados";
  variantes?: Variant[];
  price?: number;
}

async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectDB();

  const productFromDB = await Product.findOne({ slug }).lean<IProduct>();

  if (!productFromDB) return null;

  return {
    id: (productFromDB._id as { toString(): string }).toString(),
    name: productFromDB.name,
    slug: productFromDB.slug,
    images: productFromDB.images || [],
    description: productFromDB.description,
    destacado: false,
    category: "productos",
    subcategory:
      productFromDB.type === "sublimable" ? "sublimables" : "personalizados",
    variantes: [
      { tipo: "tapa-flex", price: productFromDB.priceFlex },
      { tipo: "tapa-dura", price: productFromDB.priceDura || 0 },
    ],
    price: productFromDB.priceFlex,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) return <div>Producto no encontrado</div>;

  return <ProductDetailClient product={product} />;
}
