import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export async function PUT(req) {
  try {
    const user = await isAuthenticated(req);
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const avatarFile = formData.get("avatar");

    if (!name || !email)
      return NextResponse.json({ success: false, message: "Please provide all required fields." }, { status: 400 });

    let avatarData = user.avatar || null;

    if (avatarFile && avatarFile.size > 0) {
      if (user.avatar?.public_id) await cloudinary.uploader.destroy(user.avatar.public_id);
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "Ecommerce_Avatars", width: 150, crop: "scale" }, (err, result) => {
          if (err) reject(err); else resolve(result);
        }).end(buffer);
      });
      avatarData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const updated = await database.query(
      "UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING *",
      [name, email, JSON.stringify(avatarData), user.id]
    );
    return NextResponse.json({ success: true, message: "Profile updated successfully.", user: updated.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
