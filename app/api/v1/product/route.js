import { NextResponse } from "next/server";
import database from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const availability = searchParams.get("availability");
    const price = searchParams.get("price");
    const category = searchParams.get("category");
    const ratings = searchParams.get("ratings");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const conditions = [];
    let values = [];
    let index = 1;

    if (availability === "in-stock") conditions.push("stock > 5");
    else if (availability === "limited") conditions.push("stock > 0 AND stock <= 5");
    else if (availability === "out-of-stock") conditions.push("stock = 0");

    if (price) {
      const [min, max] = price.split("-");
      if (min && max) { conditions.push(`price BETWEEN $${index} AND $${index + 1}`); values.push(min, max); index += 2; }
    }
    if (category) { conditions.push(`category ILIKE $${index}`); values.push(`%${category}%`); index++; }
    if (ratings) { conditions.push(`ratings >= $${index}`); values.push(ratings); index++; }
    if (search) { conditions.push(`(p.name ILIKE $${index} OR p.description ILIKE $${index})`); values.push(`%${search}%`); index++; }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const totalResult = await database.query(`SELECT COUNT(*) FROM products p ${whereClause}`, values);
    const totalProducts = parseInt(totalResult.rows[0].count);

    const limitPlaceholder = `$${index}`; values.push(limit); index++;
    const offsetPlaceholder = `$${index}`; values.push(offset);

    const result = await database.query(
      `SELECT p.*, COUNT(r.id) AS review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id ${whereClause} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      values
    );
    const newProducts = await database.query(
      `SELECT p.*, COUNT(r.id) AS review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE p.created_at >= NOW() - INTERVAL '30 days' GROUP BY p.id ORDER BY p.created_at DESC LIMIT 8`
    );
    const topRated = await database.query(
      `SELECT p.*, COUNT(r.id) AS review_count FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE p.ratings >= 4.5 GROUP BY p.id ORDER BY p.ratings DESC LIMIT 8`
    );
    return NextResponse.json({ success: true, products: result.rows, totalProducts, newProducts: newProducts.rows, topRatedProducts: topRated.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
