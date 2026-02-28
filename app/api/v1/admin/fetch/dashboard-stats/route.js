import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated, authorizeAdmin } from "@/lib/authMiddleware";

export async function GET(req) {
  try {
    const user = await isAuthenticated(req);
    authorizeAdmin(user);
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const [totalRevQ, totalUsersQ, orderStatusQ, todayRevQ, yesterdayRevQ, monthlySalesQ, topProductsQ, currentMonthQ, lowStockQ, lastMonthQ, newUsersQ] = await Promise.all([
      database.query("SELECT SUM(total_price) FROM orders WHERE paid_at IS NOT NULL"),
      database.query("SELECT COUNT(*) FROM users WHERE role = 'User'"),
      database.query("SELECT order_status, COUNT(*) FROM orders WHERE paid_at IS NOT NULL GROUP BY order_status"),
      database.query("SELECT SUM(total_price) FROM orders WHERE created_at::date = $1 AND paid_at IS NOT NULL", [todayDate]),
      database.query("SELECT SUM(total_price) FROM orders WHERE created_at::date = $1 AND paid_at IS NOT NULL", [yesterdayDate]),
      database.query("SELECT TO_CHAR(created_at, 'Mon YYYY') AS month, DATE_TRUNC('month', created_at) as date, SUM(total_price) as totalsales FROM orders WHERE paid_at IS NOT NULL GROUP BY month, date ORDER BY date ASC"),
      database.query("SELECT p.name, p.images->0->>'url' AS image, p.category, p.ratings, SUM(oi.quantity) AS total_sold FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE o.paid_at IS NOT NULL GROUP BY p.name, p.images, p.category, p.ratings ORDER BY total_sold DESC LIMIT 5"),
      database.query("SELECT SUM(total_price) AS total FROM orders WHERE paid_at IS NOT NULL AND created_at BETWEEN $1 AND $2", [currentMonthStart, currentMonthEnd]),
      database.query("SELECT name, stock FROM products WHERE stock <= 5"),
      database.query("SELECT SUM(total_price) AS total FROM orders WHERE paid_at IS NOT NULL AND created_at BETWEEN $1 AND $2", [previousMonthStart, previousMonthEnd]),
      database.query("SELECT COUNT(*) FROM users WHERE created_at >= $1 AND role = 'User'", [currentMonthStart]),
    ]);

    const orderStatusCounts = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orderStatusQ.rows.forEach(row => { orderStatusCounts[row.order_status] = parseInt(row.count); });
    const currentMonthSales = parseFloat(currentMonthQ.rows[0].total) || 0;
    const lastMonthRevenue = parseFloat(lastMonthQ.rows[0].total) || 0;
    let revenueGrowth = "0%";
    if (lastMonthRevenue > 0) {
      const rate = ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
      revenueGrowth = `${rate >= 0 ? "+" : ""}${rate.toFixed(2)}%`;
    }

    return NextResponse.json({
      success: true,
      totalRevenueAllTime: parseFloat(totalRevQ.rows[0].sum) || 0,
      totalUsersCount: parseInt(totalUsersQ.rows[0].count) || 0,
      orderStatusCounts,
      todayRevenue: parseFloat(todayRevQ.rows[0].sum) || 0,
      yesterdayRevenue: parseFloat(yesterdayRevQ.rows[0].sum) || 0,
      monthlySales: monthlySalesQ.rows.map(r => ({ month: r.month, totalsales: parseFloat(r.totalsales) || 0 })),
      topSellingProducts: topProductsQ.rows,
      currentMonthSales,
      lowStockProducts: lowStockQ.rows,
      revenueGrowth,
      newUsersThisMonth: parseInt(newUsersQ.rows[0].count) || 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
