import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImageToS3 } from "@/lib/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ message: "No se recibieron archivos" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-").split(".")[0]}.webp`;

      const url = await uploadImageToS3(webpBuffer, fileName);

      uploadedUrls.push(url);
    }

    return NextResponse.json({ message: "Archivos subidos", urls: uploadedUrls });
  } catch (error: any) {
    console.error("Error en upload-to-s3:", error);
    return NextResponse.json({ message: "Error subiendo archivos", error: error.message }, { status: 500 });
  }
}