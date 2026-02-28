import { NextResponse } from "next/server";
import database from "@/lib/db";
import bcrypt from "bcrypt";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function PUT(req) {
  try {
    const user = await isAuthenticated(req);
    const { currentPassword, newPassword, confirmNewPassword } = await req.json();
    if (!currentPassword || !newPassword || !confirmNewPassword)
      return NextResponse.json({ success: false, message: "Please provide all required fields." }, { status: 400 });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 401 });
    if (newPassword !== confirmNewPassword)
      return NextResponse.json({ success: false, message: "New passwords do not match." }, { status: 400 });
    if (newPassword.length < 8 || newPassword.length > 16)
      return NextResponse.json({ success: false, message: "Password must be between 8 and 16 characters." }, { status: 400 });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await database.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
