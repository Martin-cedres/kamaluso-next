"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    const fetchDestacados = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      const destacadosFiltrados = data.filter((prod: any) => prod.destacado);
      setDestacados(destacadosFiltrados);
    };

    fetchDestacados();
  }, []);

  return (
    <main>
      <section className="text-center py-16 bg-gradient-to-br from-pink-100 to-yellow-100">
        <h2 className="text-4xl font-bold mb-4 text-black">Agendas que inspiran</h2>
        <p className="text-lg text-gray-700">
          Personalizá tu día a tu manera. Elegí la tuya.
        </p>
      </section>

      <section className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-black">Destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {destacados.map((prod: any) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>
    </main>
  );
}