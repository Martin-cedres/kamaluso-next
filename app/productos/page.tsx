"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ProductosPage() {
  useEffect(() => {
    console.log("Página de productos cargada");
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categorías de Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/productos/sublimables"
          className="p-6 border border-pink-400 rounded-xl hover:bg-pink-100 transition"
        >
          Sublimables
        </Link>

        <Link
          href="/productos/personalizados"
          className="p-6 border border-pink-400 rounded-xl hover:bg-pink-100 transition"
        >
          Personalizados
        </Link>
      </div>
    </div>
  );
}
