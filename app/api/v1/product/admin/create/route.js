import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export async function POST(req) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const stock = formData.get("stock");
    const imageFiles = formData.getAll("images");

    if (!name || !description || !price || !category || !stock)
      return NextResponse.json({ success: false, message: "Please provide complete product details." }, { status: 400 });

    let uploadedImages = [];
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "Ecommerce_Product_Images", width: 1000, crop: "scale" }, (err, result) => {
            if (err) reject(err); else resolve(result);
          }).end(buffer);
        });
        uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
      }
    }

    const product = await database.query(
      "INSERT INTO products (name, description, price, category, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, description, parseFloat(price) / 283, category, parseInt(stock), JSON.stringify(uploadedImages), user.id]
    );
    return NextResponse.json({ success: true, message: "Product created successfully.", product: product.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
