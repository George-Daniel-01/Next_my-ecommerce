import { NextResponse } from "next/server";
import Stripe from "stripe";
import database from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
  if (event.type === "payment_intent.succeeded") {
    const clientSecret = event.data.object.client_secret;
    try {
      const paymentResult = await database.query(
        "UPDATE payments SET payment_status = 'Paid' WHERE payment_intent_id = $1 RETURNING *",
        [clientSecret]
      );
      const orderId = paymentResult.rows[0].order_id;
      await database.query("UPDATE orders SET paid_at = NOW() WHERE id = $1", [orderId]);
      const { rows: items } = await database.query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [orderId]);
      for (const item of items) {
        await database.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]);
      }
    } catch (error) {
      return new NextResponse("Error processing payment webhook", { status: 500 });
    }
  }
  return NextResponse.json({ received: true });
}
