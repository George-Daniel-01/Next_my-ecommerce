import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLIENT_NAME, api_key: process.env.CLOUDINARY_CLIENT_API, api_secret: process.env.CLOUDINARY_CLIENT_SECRET });

export async function DELETE(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { id } = await params;
    const deleted = await database.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (deleted.rows.length === 0)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    if (deleted.rows[0].avatar?.public_id) await cloudinary.uploader.destroy(deleted.rows[0].avatar.public_id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
