import { NextResponse } from "next/server";
import aws from "aws-sdk";
import sharp from "sharp";

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No se recibió archivo" }, { status: 400 });
    }

    const alt = formData.get("alt")?.toString() || "";
    const keywords = formData.get("keywords")?.toString() || "";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

    const fileName = `${Date.now()}-${file.name?.replace(/\s+/g, "-")}.webp`;

    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: webpBuffer,
        ContentType: "image/webp",
        ACL: "public-read",
        Metadata: {
          alt,
          keywords,
        },
      })
      .promise();

    return NextResponse.json({ message: "Archivo subido con éxito", url: uploadResult.Location });
  } catch (error: any) {
    console.error("Error upload-to-s3:", error);
    return NextResponse.json({ message: error.message || "Error inesperado" }, { status: 500 });
  }
}