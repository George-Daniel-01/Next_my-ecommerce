import { NextResponse } from "next/server";
import database from "@/lib/db";
import { createTables } from "@/lib/createTables";

export async function GET() {
  try {
    await createTables();
    const result = await database.query("SELECT NOW() as time, current_database() as db");
    return NextResponse.json({
      success: true,
      message: "Database connected!",
      database: result.rows[0].db,
      time: result.rows[0].time,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
