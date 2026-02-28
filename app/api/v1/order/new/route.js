import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";
import { generatePaymentIntent } from "@/lib/generatePaymentIntent";

export async function POST(req) {
  try {
    const user = await isAuthenticated(req);
    const { full_name, state, city, country, address, pincode, phone, orderedItems } = await req.json();
    if (!full_name || !state || !city || !country || !address || !pincode || !phone)
      return NextResponse.json({ success: false, message: "Please provide complete shipping details." }, { status: 400 });
    const items = Array.isArray(orderedItems) ? orderedItems : JSON.parse(orderedItems);
    if (!items || items.length === 0)
      return NextResponse.json({ success: false, message: "No items in cart." }, { status: 400 });

    const productIds = items.map(item => item.product.id);
    const { rows: products } = await database.query(`SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`, [productIds]);

    let total_price = 0;
    const values = [];
    const placeholders = [];

    items.forEach((item, index) => {
      const product = products.find(p => p.id === item.product.id);
      if (!product) throw { message: `Product not found`, statusCode: 404 };
      if (item.quantity > product.stock) throw { message: `Only ${product.stock} units available for ${product.name}`, statusCode: 400 };
      total_price += product.price * item.quantity;
      values.push(null, product.id, item.quantity, product.price, item.product.images[0]?.url || "", product.name);
      const offset = index * 6;
      placeholders.push(`($${offset+1}, $${offset+2}, $${offset+3}, $${offset+4}, $${offset+5}, $${offset+6})`);
    });

    const tax_price = 0.18;
    const shipping_price = total_price >= 50 ? 0 : 2;
    total_price = Math.round(total_price + total_price * tax_price + shipping_price);

    const orderResult = await database.query(
      "INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.id, total_price, tax_price, shipping_price]
    );
    const orderId = orderResult.rows[0].id;
    for (let i = 0; i < values.length; i += 6) values[i] = orderId;

    await database.query(`INSERT INTO order_items (order_id, product_id, quantity, price, image, title) VALUES ${placeholders.join(", ")}`, values);
    await database.query(
      "INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [orderId, full_name, state, city, country, address, pincode, phone]
    );
    const paymentResponse = await generatePaymentIntent(orderId, total_price);
    if (!paymentResponse.success)
      return NextResponse.json({ success: false, message: "Payment failed. Try again." }, { status: 500 });
    return NextResponse.json({ success: true, message: "Order placed successfully.", orderId, paymentIntent: paymentResponse.clientSecret, total_price });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
