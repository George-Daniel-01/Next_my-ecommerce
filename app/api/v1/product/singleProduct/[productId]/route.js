import { NextResponse } from "next/server";
import database from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { productId } = await params;
    const result = await database.query(
      `SELECT p.*, COALESCE(json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'comment', r.comment, 'reviewer', json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar))) FILTER (WHERE r.id IS NOT NULL), '[]') AS reviews FROM products p LEFT JOIN reviews r ON p.id = r.product_id LEFT JOIN users u ON r.user_id = u.id WHERE p.id = $1 GROUP BY p.id`,
      [productId]
    );
    return NextResponse.json({ success: true, message: "Product fetched successfully.", product: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
