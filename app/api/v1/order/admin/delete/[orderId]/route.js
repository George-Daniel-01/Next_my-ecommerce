import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";

export async function DELETE(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { orderId } = await params;
    const result = await database.query("DELETE FROM orders WHERE id = $1 RETURNING *", [orderId]);
    if (result.rows.length === 0)
      return NextResponse.json({ success: false, message: "Invalid order ID." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Order deleted.", order: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
