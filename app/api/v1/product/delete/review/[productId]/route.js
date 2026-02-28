import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function DELETE(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    const { productId } = await params;
    const review = await database.query("DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING *", [productId, user.id]);
    if (review.rows.length === 0)
      return NextResponse.json({ success: false, message: "Review not found." }, { status: 404 });
    const avg = await database.query("SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1", [productId]);
    const updated = await database.query("UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *", [avg.rows[0].avg_rating, productId]);
    return NextResponse.json({ success: true, message: "Your review has been deleted.", review: review.rows[0], product: updated.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
