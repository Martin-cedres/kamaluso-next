// lib/models/Product.ts
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["sublimable", "personalizado"], required: true },
  alt: { type: String, required: false },
  keywords: { type: [String], required: false },
  priceFlex: { type: Number, required: true },
  priceHard: { type: Number, required: true },
  destacado: { type: Boolean, default: false },
  images: { type: [String], required: false },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
