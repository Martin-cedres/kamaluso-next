import aws from "aws-sdk";
import sharp from "sharp";
import multer from "multer";
import nextConnect from "next-connect";

// Configuración S3
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Multer configuración para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB por archivo
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ message: `Error inesperado: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  try {
    const { alt, keywords } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo" });
    }

    // Convertir imagen a WebP con sharp
    const webpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Nombre único para el archivo
    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}.webp`;

    // Subir a S3
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: webpBuffer,
        ContentType: "image/webp",
        ACL: "public-read",
        Metadata: {
          alt: alt || "",
          keywords: keywords || "",
        },
      })
      .promise();

    res.status(200).json({ message: "Archivo subido con éxito", url: uploadResult.Location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // multer lo maneja
  },
};

export default apiRoute;