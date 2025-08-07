"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../../../components/ProductCard";
import { CategoryPageLayout } from "../../../components/CategoryPageLayout";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  description: string;
  subcategory: string;
  // Podés agregar más campos si querés tiparlo mejor
}

export default function PersonalizadosPage() {
  const [personalizados, setPersonalizados] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPersonalizados = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const filtrados = data.filter((p: Product) => p.subcategory === "personalizados");
        setPersonalizados(filtrados);
      } catch (err) {
        setError("Error al cargar productos");
        console.error(err);
      }
    };

    fetchPersonalizados();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <CategoryPageLayout title="Productos Personalizados">
      {personalizados.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </CategoryPageLayout>
  );
}