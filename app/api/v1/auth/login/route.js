import { NextResponse } from "next/server";
import database from "@/lib/db";
import bcrypt from "bcrypt";
import { sendToken } from "@/lib/sendToken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ success: false, message: "Please provide email and password." }, { status: 400 });
    const user = await database.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0)
      return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch)
      return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
    return sendToken(user.rows[0], 200, "Logged In.");
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
