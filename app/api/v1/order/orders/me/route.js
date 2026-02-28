import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    const user = await isAuthenticated(req);
    const result = await database.query(
      `SELECT o.*, COALESCE(json_agg(json_build_object('order_item_id', oi.id, 'order_id', oi.order_id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'image', oi.image, 'title', oi.title)) FILTER (WHERE oi.id IS NOT NULL), '[]') AS order_items, json_build_object('full_name', s.full_name, 'state', s.state, 'city', s.city, 'country', s.country, 'address', s.address, 'pincode', s.pincode, 'phone', s.phone) AS shipping_info FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id LEFT JOIN shipping_info s ON o.id = s.order_id WHERE o.buyer_id = $1 GROUP BY o.id, s.id ORDER BY o.created_at DESC`,
      [user.id]
    );
    return NextResponse.json({ success: true, message: "All your orders are fetched.", myOrders: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
