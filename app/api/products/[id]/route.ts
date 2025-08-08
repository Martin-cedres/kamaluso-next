import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  await dbConnect();

  const id = params.id;

  try {
    const data = await request.json();

    if (!data.name || !data.description || !data.alt || !data.priceFlex) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const keywords = data.keywords ? data.keywords.split(",").map((k: string) => k.trim()) : [];

    const updateData: any = {
      name: data.name,
      description: data.description,
      type: data.type || "sublimable",
      alt: data.alt,
      keywords,
      priceFlex: parseFloat(data.priceFlex),
      priceDura: data.priceDura ? parseFloat(data.priceDura) : undefined,
    };

    if (data.images && data.images.length > 0) {
      updateData.images = data.images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Producto actualizado",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json({ message: "Error actualizando producto", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();

  const id = params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error: any) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ message: "Error eliminando producto", error: error.message }, { status: 500 });
  }
}
