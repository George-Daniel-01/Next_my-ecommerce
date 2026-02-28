import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    const user = await isAuthenticated(req);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 401 });
  }
}
