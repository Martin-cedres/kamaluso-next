"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Variant {
  tipo: "tapa-dura" | "tapa-flex";
  price: number;
}

interface Product {
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

interface Props {
  product: Product;
}

function validarUrl(src: string): string {
  try {
    const url = new URL(src);
    return url.toString();
  } catch {
    console.warn("URL inválida en ProductDetailClient:", src);
    return "/placeholder.webp";
  }
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variantes?.[0] || null
  );

  const [mainImage, setMainImage] = useState<string>(
    validarUrl(product.images?.[0] || "/placeholder.webp")
  );

  const displayPrice = selectedVariant ? selectedVariant.price : product.price || 0;

  const whatsappNumber = "59898615074";
  const mensajeWhatsapp = encodeURIComponent(
    `Hola, estoy interesado en el producto *${product.name}* ${
      selectedVariant ? `(Opción: ${selectedVariant.tipo === "tapa-dura" ? "Tapa dura" : "Tapa flex"})` : ""
    }. ¿Podrían enviarme más información?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsapp}`;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-pink-600 text-center">{product.name}</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Imágenes */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border border-pink-200">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <div className="flex gap-3 mt-2">
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 border rounded overflow-hidden cursor-pointer"
                onClick={() => setMainImage(validarUrl(img))}
              >
                <Image
                  src={validarUrl(img)}
                  alt={`Vista ${idx + 1}`}
                  fill
                  className={`object-cover rounded border-2 ${
                    mainImage === validarUrl(img) ? "border-pink-600" : "border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info del producto */}
        <div className="flex-1 space-y-6">
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>

          {product.variantes && (
            <div>
              <label htmlFor="variant" className="block text-sm font-medium text-pink-600 mb-1">
                Elegí tipo de tapa:
              </label>
              <select
                id="variant"
                value={selectedVariant?.tipo}
                onChange={(e) => {
                  const found = product.variantes!.find((v) => v.tipo === e.target.value);
                  setSelectedVariant(found || null);
                }}
                className="w-full p-2 border border-pink-400 rounded focus:ring-2 focus:ring-pink-500"
              >
                {product.variantes.map((v) => (
                  <option key={v.tipo} value={v.tipo}>
                    {v.tipo === "tapa-dura" ? "Tapa dura" : "Tapa flex"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-2xl font-bold text-pink-700">
            Precio: <span className="text-black">UYU {displayPrice}</span>
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded shadow transition"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}