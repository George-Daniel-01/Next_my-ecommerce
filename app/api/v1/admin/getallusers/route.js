import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const totalResult = await database.query("SELECT COUNT(*) FROM users WHERE role = $1", ["User"]);
    const totalUsers = parseInt(totalResult.rows[0].count);
    const offset = (page - 1) * 10;
    const users = await database.query("SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", ["User", 10, offset]);
    return NextResponse.json({ success: true, totalUsers, currentPage: page, users: users.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
