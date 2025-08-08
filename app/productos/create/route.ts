import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Tipamos lean para que TS sepa qué devuelve
    const products = await Product.find().lean<IProduct[]>();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const type = (formData.get("type")?.toString() as "sublimable" | "personalizado") || "sublimable";
    const alt = formData.get("alt")?.toString() || "";
    const keywordsStr = formData.get("keywords")?.toString() || "";
    const priceFlex = parseFloat(formData.get("priceFlex")?.toString() || "0");
    const priceDuraStr = formData.get("priceDura")?.toString();
    const priceDura = priceDuraStr ? parseFloat(priceDuraStr) : undefined;

    if (!name || !description || !alt) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const keywords = keywordsStr ? keywordsStr.split(",").map((k) => k.trim()) : [];

    const newProduct = new Product({
      name,
      description,
      type,
      alt,
      keywords,
      priceFlex,
      priceDura: type === "personalizado" ? priceDura : undefined,
    });

    await newProduct.save();

    return NextResponse.json({ message: "Producto creado", id: newProduct._id.toString() });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { message: "Error interno" },
      { status: 500 }
    );
  }
}