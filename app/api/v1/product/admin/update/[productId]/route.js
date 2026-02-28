import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLIENT_NAME, api_key: process.env.CLOUDINARY_CLIENT_API, api_secret: process.env.CLOUDINARY_CLIENT_SECRET });

export async function PUT(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { productId } = await params;
    const product = await database.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (product.rows.length === 0)
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    const existingProduct = product.rows[0];
    const formData = await req.formData();
    const updates = {};
    const name = formData.get("name"); if (name) updates.name = name;
    const description = formData.get("description"); if (description) updates.description = description;
    const price = formData.get("price"); if (price) updates.price = parseFloat(price) / 283;
    const category = formData.get("category"); if (category) updates.category = category;
    const stock = formData.get("stock"); if (stock) updates.stock = parseInt(stock);
    let uploadedImages = existingProduct.images || [];
    const imageFiles = formData.getAll("images");
    const hasNewImages = imageFiles.some(f => f.size > 0);
    if (hasNewImages) {
      for (const img of existingProduct.images || []) { await cloudinary.uploader.destroy(img.public_id); }
      uploadedImages = [];
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
    }
    const fields = [...Object.keys(updates), "images"];
    const values = [...Object.values(updates), JSON.stringify(uploadedImages), productId];
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const result = await database.query(`UPDATE products SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
    return NextResponse.json({ success: true, message: "Product updated successfully.", updatedProduct: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
