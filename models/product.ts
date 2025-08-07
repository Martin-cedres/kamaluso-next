// models/Product.ts
import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: String,
  description: String,
  slug: { type: String, unique: true },
  type: String,
  alt: String,
  keywords: [String],
  priceFlex: Number,
  priceDura: Number,
  images: [String],
});

const ProductModel = models.Product || model("Product", ProductSchema);

export default ProductModel;