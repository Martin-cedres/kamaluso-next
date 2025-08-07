import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("kamaluso");

    const collections = await db.listCollections().toArray();

    res.status(200).json({ message: "Conexión OK", collections });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}