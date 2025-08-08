import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  type: "sublimable" | "personalizado";
  alt: string;
  keywords: string[];
  priceFlex: number;
  priceDura?: number;
  images: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["sublimable", "personalizado"], default: "sublimable" },
  alt: { type: String, required: true },
  keywords: { type: [String], default: [] },
  priceFlex: { type: Number, required: true },
  priceDura: { type: Number },
  images: { type: [String], default: [] },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;