import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";

export async function PUT(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    const { productId } = await params;
    const { rating, comment } = await req.json();
    if (!rating || !comment)
      return NextResponse.json({ success: false, message: "Please provide rating and comment." }, { status: 400 });
    const { rows } = await database.query(
      `SELECT oi.product_id FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.buyer_id = $1 AND oi.product_id = $2 AND o.order_status = 'Delivered' LIMIT 1`,
      [user.id, productId]
    );
    if (rows.length === 0)
      return NextResponse.json({ success: false, message: "You can only review a product you have purchased." }, { status: 403 });
    const isAlreadyReviewed = await database.query("SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2", [productId, user.id]);
    let review;
    if (isAlreadyReviewed.rows.length > 0) {
      review = await database.query("UPDATE reviews SET rating = $1, comment = $2 WHERE product_id = $3 AND user_id = $4 RETURNING *", [rating, comment, productId, user.id]);
    } else {
      review = await database.query("INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *", [productId, user.id, rating, comment]);
    }
    const avg = await database.query("SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1", [productId]);
    const updated = await database.query("UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *", [avg.rows[0].avg_rating, productId]);
    return NextResponse.json({ success: true, message: "Review posted.", review: review.rows[0], product: updated.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
