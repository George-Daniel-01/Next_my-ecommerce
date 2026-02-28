import { NextResponse } from "next/server";
import database from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendToken } from "@/lib/sendToken";

export async function PUT(req, { params }) {
  try {
    const { token } = await params;
    const { password, confirmPassword } = await req.json();
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await database.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()",
      [resetPasswordToken]
    );
    if (user.rows.length === 0)
      return NextResponse.json({ success: false, message: "Invalid or expired reset token." }, { status: 400 });
    if (password !== confirmPassword)
      return NextResponse.json({ success: false, message: "Passwords do not match." }, { status: 400 });
    if (password.length < 8 || password.length > 16)
      return NextResponse.json({ success: false, message: "Password must be between 8 and 16 characters." }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await database.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2 RETURNING *",
      [hashedPassword, user.rows[0].id]
    );
    return sendToken(updated.rows[0], 200, "Password reset successfully");
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
