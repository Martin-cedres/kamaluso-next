import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    console.log("Intentando conectar a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("¡Conexión exitosa a MongoDB Atlas!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
}

testConnection();
// Este script se utiliza para probar la conexión a MongoDB Atlas