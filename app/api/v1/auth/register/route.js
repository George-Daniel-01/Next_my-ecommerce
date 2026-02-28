import { NextResponse } from "next/server";
import database from "@/lib/db";
import bcrypt from "bcrypt";
import ErrorHandler from "@/lib/ErrorHandler";
import { sendToken } from "@/lib/sendToken";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: "Please provide all required fields." }, { status: 400 });
    if (password.length < 8 || password.length > 16)
      return NextResponse.json({ success: false, message: "Password must be between 8 and 16 characters." }, { status: 400 });
    const existing = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return NextResponse.json({ success: false, message: "User already registered with this email." }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await database.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return sendToken(user.rows[0], 201, "User registered successfully");
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
