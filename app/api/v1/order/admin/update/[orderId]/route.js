import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";

export async function PUT(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const { orderId } = await params;
    const { status } = await req.json();
    if (!status)
      return NextResponse.json({ success: false, message: "Provide a valid status for order." }, { status: 400 });
    const exists = await database.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    if (exists.rows.length === 0)
      return NextResponse.json({ success: false, message: "Invalid order ID." }, { status: 404 });
    const updated = await database.query("UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *", [status, orderId]);
    return NextResponse.json({ success: true, message: "Order status updated.", updatedOrder: updated.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
