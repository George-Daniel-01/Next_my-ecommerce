import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLIENT_NAME, api_key: process.env.CLOUDINARY_CLIENT_API, api_secret: process.env.CLOUDINARY_CLIENT_SECRET });

export async function DELETE(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { productId } = await params;
    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (product.rows.length === 0)
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    await database.query("DELETE FROM products WHERE id = $1", [productId]);
    for (const img of product.rows[0].images || []) { await cloudinary.uploader.destroy(img.public_id); }
    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
