import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  type: "sublimable" | "personalizado";
  alt: string;
  keywords: string[];
  priceFlex: number;
  priceDura?: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["sublimable", "personalizado"],
      default: "sublimable",
    },
    alt: { type: String, required: true },
    keywords: [{ type: String }],
    priceFlex: { type: Number, required: true },
    priceDura: { type: Number },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export { Product };
export type { IProduct };