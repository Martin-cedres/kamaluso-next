import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";  // No necesitas importar IProduct si no lo usas acá
import { uploadImageToS3 } from "@/lib/s3";
import sharp from "sharp";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).lean();

    const productsSerialized = products.map(product => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json(productsSerialized);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const type = formData.get("type")?.toString() || "sublimable";
    const alt = formData.get("alt")?.toString() || "";
    const keywordsStr = formData.get("keywords")?.toString() || "";
    const priceFlex = parseFloat(formData.get("priceFlex")?.toString() || "0");
    const priceDuraStr = formData.get("priceDura")?.toString();
    const priceDura = priceDuraStr ? parseFloat(priceDuraStr) : undefined;

    if (!name || !description || !alt) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const keywords = keywordsStr ? keywordsStr.split(",").map(k => k.trim()) : [];

    // Procesar imágenes
    const files = formData.getAll("files") as File[];
    const images: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convertir a WebP optimizado
      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${Date.now()}-${file.name.split(".")[0]}.webp`;

      // Subir a S3 y obtener URL
      const url = await uploadImageToS3(webpBuffer, fileName);
      images.push(url);
    }

    const newProduct = new Product({
      name,
      description,
      type,
      alt,
      keywords,
      priceFlex,
      priceDura: type === "personalizado" ? priceDura : undefined,
      images,
    });

    await newProduct.save();

    // Aquí corregimos el casteo para que TypeScript entienda que _id es ObjectId
    return NextResponse.json({
      message: "Producto creado correctamente",
      id: (newProduct._id as mongoose.Types.ObjectId).toString(),
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}