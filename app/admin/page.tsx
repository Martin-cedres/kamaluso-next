"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  type: "sublimable" | "personalizado";
  alt: string;
  keywords: string[];
  priceFlex: number;
  priceDura?: number;
  images: string[];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    _id: "",
    name: "",
    description: "",
    type: "sublimable" as "sublimable" | "personalizado",
    alt: "",
    keywords: "",
    priceFlex: "",
    priceDura: "",
    images: [] as string[],
    newFiles: [] as File[],
  });

  // Cargar productos
  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Error cargando productos");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Manejar inputs
  function handleInput(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Manejar selección de archivos para imágenes nuevas (corregido)
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setForm((f) => ({ ...f, newFiles: Array.from(files) }));
  }

  // Subir archivos a S3
  async function uploadFiles(files: File[]): Promise<string[]> {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload-to-s3", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error subiendo imágenes");

    const data = await res.json();
    return data.urls as string[];
  }

  // Reset form
  function resetForm() {
    setForm({
      _id: "",
      name: "",
      description: "",
      type: "sublimable",
      alt: "",
      keywords: "",
      priceFlex: "",
      priceDura: "",
      images: [],
      newFiles: [],
    });
  }

  // Crear o actualizar producto
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      let uploadedUrls: string[] = [];

      // Si hay archivos nuevos, subirlos primero
      if (form.newFiles.length > 0) {
        uploadedUrls = await uploadFiles(form.newFiles);
      }

      // Para edición, combinamos imágenes antiguas + nuevas
      const imagesToSend = [...form.images, ...uploadedUrls];

      // Crear objeto producto a enviar
      const productPayload = {
        name: form.name,
        description: form.description,
        type: form.type,
        alt: form.alt,
        keywords: form.keywords,
        priceFlex: parseFloat(form.priceFlex),
        priceDura: form.type === "personalizado" ? parseFloat(form.priceDura) || 0 : undefined,
        images: imagesToSend,
      };

      let res: Response;

      if (form._id) {
        // Editar producto
        res = await fetch(`/api/products/${form._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
      } else {
        // Crear producto nuevo
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error guardando producto");
      }

      await fetchProducts();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  // Cargar datos en formulario para editar
  function handleEdit(p: Product) {
    setForm({
      _id: p._id,
      name: p.name,
      description: p.description,
      type: p.type,
      alt: p.alt,
      keywords: p.keywords.join(", "),
      priceFlex: p.priceFlex.toString(),
      priceDura: p.priceDura?.toString() || "",
      images: p.images,
      newFiles: [],
    });
    window.scrollTo(0, 0);
  }

  // Eliminar producto
  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error eliminando producto");
      }

      await fetchProducts();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel Admin - Productos</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {loading && <p className="mb-4 text-blue-600">Cargando...</p>}

      <form onSubmit={handleSubmit} className="mb-10 border p-6 rounded shadow">
        <h2 className="text-2xl mb-4">{form._id ? "Editar Producto" : "Crear Producto"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleInput}
          className="mb-3 w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleInput}
          className="mb-3 w-full p-2 border rounded"
          rows={3}
          required
        />

        <select name="type" value={form.type} onChange={handleInput} className="mb-3 p-2 border rounded" required>
          <option value="sublimable">Sublimable</option>
          <option value="personalizado">Personalizado</option>
        </select>

        <input
          type="text"
          name="alt"
          placeholder="Texto alternativo para imágenes (alt)"
          value={form.alt}
          onChange={handleInput}
          className="mb-3 w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="keywords"
          placeholder="Palabras clave (separadas por coma)"
          value={form.keywords}
          onChange={handleInput}
          className="mb-3 w-full p-2 border rounded"
        />

        <input
          type="number"
          name="priceFlex"
          placeholder="Precio Sublimable"
          value={form.priceFlex}
          onChange={handleInput}
          className="mb-3 w-full p-2 border rounded"
          required
          step="0.01"
          min="0"
        />

        {form.type === "personalizado" && (
          <input
            type="number"
            name="priceDura"
            placeholder="Precio Personalizado"
            value={form.priceDura}
            onChange={handleInput}
            className="mb-3 w-full p-2 border rounded"
            step="0.01"
            min="0"
          />
        )}

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Imágenes actuales:</label>
          <div className="flex gap-2 flex-wrap">
            {form.images.length === 0 && <p>No hay imágenes</p>}
            {form.images.map((img, i) => (
              <img key={i} src={img} alt={form.alt} width={80} height={80} className="border rounded" />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Agregar nuevas imágenes:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          {form.newFiles.length > 0 && (
            <p>{form.newFiles.length} archivo{form.newFiles.length > 1 ? "s" : ""} seleccionado{form.newFiles.length > 1 ? "s" : ""}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {form._id ? "Actualizar Producto" : "Crear Producto"}
        </button>

        {form._id && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      <hr className="mb-6" />

      <h2 className="text-2xl mb-4">Lista de Productos</h2>
      {products.length === 0 && <p>No hay productos</p>}

      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <strong>{p.name}</strong> - {p.type} - ${p.priceFlex.toFixed(2)}
            </div>
            <div>
              <button
                onClick={() => handleEdit(p)}
                className="mr-2 bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}