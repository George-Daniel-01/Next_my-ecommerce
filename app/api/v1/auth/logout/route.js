import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    await isAuthenticated(req);
    const res = NextResponse.json({ success: true, message: "Logged out successfully." }, { status: 200 });
    res.cookies.set("token", "", { expires: new Date(0), httpOnly: true, path: "/" });
    return res;
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
