import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import { uploadImageToS3 } from "@/lib/s3";
import sharp from "sharp";

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({}).lean();
    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error GET productos:", error);
    return NextResponse.json({ message: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const type = (formData.get("type")?.toString() as "sublimable" | "personalizado") || "sublimable";
    const alt = formData.get("alt")?.toString() || "";
    const keywordsStr = formData.get("keywords")?.toString() || "";
    const priceFlex = parseFloat(formData.get("priceFlex")?.toString() || "0");
    const priceDuraStr = formData.get("priceDura")?.toString();
    const priceDura = priceDuraStr ? parseFloat(priceDuraStr) : undefined;

    if (!name || !description || !alt || !priceFlex) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const keywords = keywordsStr ? keywordsStr.split(",").map(k => k.trim()) : [];

    // Procesar imágenes
    const files = formData.getAll("files") as File[];
    let uploadedImages: string[] = [];

    if (files.length > 0 && files[0] instanceof File) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

        const fileName = `${Date.now()}-${file.name?.replace(/\s+/g, "-").split(".")[0] || "img"}.webp`;

        const url = await uploadImageToS3(webpBuffer, fileName);
        uploadedImages.push(url);
      }
    }

    const newProduct = new Product({
      name,
      description,
      type,
      alt,
      keywords,
      priceFlex,
      priceDura: type === "personalizado" ? priceDura : undefined,
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json({
      message: "Producto creado correctamente",
      product: { ...savedProduct.toObject(), _id: savedProduct._id.toString() },
    });
  } catch (error) {
    console.error("Error POST producto:", error);
    return NextResponse.json({ message: "Error al crear producto" }, { status: 500 });
  }
}