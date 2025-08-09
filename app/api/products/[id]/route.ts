import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product, IProduct } from "@/lib/models/Product";
import { uploadImageToS3 } from "@/lib/s3";
import sharp from "sharp";
import { Types } from "mongoose";

interface Params {
  params: { id: string };
}

type ProductDocument = IProduct & { _id: Types.ObjectId };

export async function PUT(request: Request, { params }: Params) {
  await dbConnect();

  const id = params.id;

  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const type =
      (formData.get("type")?.toString() as "sublimable" | "personalizado") ||
      "sublimable";
    const alt = formData.get("alt")?.toString() || "";
    const keywordsStr = formData.get("keywords")?.toString() || "";
    const priceFlex = parseFloat(formData.get("priceFlex")?.toString() || "0");
    const priceDuraStr = formData.get("priceDura")?.toString();
    const priceDura = priceDuraStr ? parseFloat(priceDuraStr) : undefined;

    if (!name || !description || !alt || !priceFlex) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const keywords = keywordsStr
      ? keywordsStr.split(",").map((k) => k.trim())
      : [];

    const files = formData.getAll("files") as File[];
    let uploadedImages: string[] = [];

    if (files.length > 0 && files[0] instanceof File) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const webpBuffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer();

        const fileName = `${Date.now()}-${file.name
          ?.replace(/\s+/g, "-")
          .split(".")[0] || "img"}.webp`;

        const url = await uploadImageToS3(webpBuffer, fileName);
        uploadedImages.push(url);
      }
    }

    const updateData: Partial<IProduct> = {
      name,
      description,
      type,
      alt,
      keywords,
      priceFlex,
      priceDura: type === "personalizado" ? priceDura : undefined,
    };

    if (uploadedImages.length > 0) {
      updateData.images = uploadedImages;
    }

    const updatedProduct = (await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )) as ProductDocument | null;

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Producto actualizado correctamente",
      product: {
        ...updatedProduct.toObject(),
        _id: updatedProduct._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { message: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();

  const id = params.id;

  try {
    const deletedProduct = (await Product.findByIdAndDelete(
      id
    )) as ProductDocument | null;

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { message: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}