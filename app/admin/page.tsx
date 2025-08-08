// C:\Users\LENOVO\Desktop\kamaluso-next-completo\app\admin\page.tsx
"use client";

import React, { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  type: "sublimable" | "personalizado";
  alt: string;
  keywords: string[];
  priceFlex: number;
  priceDura?: number;
  images: string[];
  destacado?: boolean;
  slug?: string;
};

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [altText, setAltText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceFlex, setPriceFlex] = useState("");
  const [priceDura, setPriceDura] = useState("");
  const [type, setType] = useState<"sublimable" | "personalizado">("sublimable");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error cargando productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("fetchProducts:", err);
        setMessage({ type: "error", text: "Error cargando productos" });
      }
      setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  function startEdit(p: Product) {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setType(p.type);
    setAltText(p.alt);
    setKeywords(p.keywords.join(", "));
    setPriceFlex(p.priceFlex.toString());
    setPriceDura(p.priceDura ? p.priceDura.toString() : "");
    setFiles([]);
    setMessage(null);
  }

  function resetForm() {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setType("sublimable");
    setAltText("");
    setKeywords("");
    setPriceFlex("");
    setPriceDura("");
    setFiles([]);
    setMessage(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function deleteProduct(id: string) {
    if (!confirm("¿Querés eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando producto");
      setProducts(products.filter((p) => p._id !== id));
      setMessage({ type: "success", text: "Producto eliminado" });

      if (editingProduct?._id === id) resetForm();
    } catch (err) {
      console.error("deleteProduct:", err);
      setMessage({ type: "error", text: "No se pudo eliminar el producto" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !description || !altText || !priceFlex || (type === "personalizado" && !priceDura)) {
      setMessage({ type: "error", text: "Completar todos los campos obligatorios" });
      return;
    }

    setLoadingSubmit(true);
    setMessage(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("alt", altText);
    formData.append("keywords", keywords);
    formData.append("priceFlex", priceFlex);
    if (type === "personalizado") {
      formData.append("priceDura", priceDura);
    }

    try {
      let res: Response;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error inesperado");

      setMessage({ type: "success", text: editingProduct ? "Producto actualizado" : "Producto creado" });

      if (editingProduct) {
        setProducts(products.map((p) => (p._id === editingProduct._id ? data : p)));
      } else {
        setProducts((prev) => [...prev, data]);
      }

      resetForm();
    } catch (error: any) {
      console.error("handleSubmit:", error);
      setMessage({ type: "error", text: error.message || "Error inesperado" });
    }

    setLoadingSubmit(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Panel Admin de Productos</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${message.type === "error" ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Productos existentes</h3>

        {loadingProducts ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p>No hay productos aún.</p>
        ) : (
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-pink-100">
              <tr>
                <th className="border px-3 py-1">Nombre</th>
                <th className="border px-3 py-1">Tipo</th>
                <th className="border px-3 py-1">Precio Flex</th>
                <th className="border px-3 py-1">Precio Dura</th>
                <th className="border px-3 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="border px-3 py-1">{p.name}</td>
                  <td className="border px-3 py-1">{p.type}</td>
                  <td className="border px-3 py-1">
                    ${p.priceFlex != null ? p.priceFlex.toFixed(2) : "0.00"}
                  </td>
                  <td className="border px-3 py-1">
                    {p.priceDura != null ? `$${p.priceDura.toFixed(2)}` : "-"}
                  </td>
                  <td className="border px-3 py-1 space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">{editingProduct ? "Editar producto" : "Nuevo producto"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <textarea
            placeholder="Descripción del producto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "sublimable" | "personalizado")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="sublimable">Sublimable</option>
            <option value="personalizado">Personalizado</option>
          </select>

          {type === "personalizado" ? (
            <>
              <input
                type="number"
                placeholder="Precio tapa flex"
                value={priceFlex}
                onChange={(e) => setPriceFlex(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Precio tapa dura"
                value={priceDura}
                onChange={(e) => setPriceDura(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </>
          ) : (
            <input
              type="number"
              placeholder="Precio"
              value={priceFlex}
              onChange={(e) => setPriceFlex(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}

          <input
            type="text"
            placeholder="Texto alternativo (alt) para accesibilidad"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Palabras clave SEO (separadas por coma)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input type="file" multiple accept="image/*" onChange={handleFileChange} />

          <div className="flex flex-wrap gap-4 mt-2">
            {files.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              {loadingSubmit ? "Guardando..." : editingProduct ? "Actualizar" : "Guardar"}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}