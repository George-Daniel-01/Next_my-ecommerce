import { NextResponse } from "next/server";
import database from "@/lib/db";
import { isAuthenticated } from "@/lib/authMiddleware";
import { getAIRecommendation } from "@/lib/getAIRecommendation";

export async function POST(req) {
  try {
    await isAuthenticated(req);
    const { userPrompt } = await req.json();
    if (!userPrompt)
      return NextResponse.json({ success: false, message: "Provide a valid prompt." }, { status: 400 });
    const stopWords = new Set(["the","they","i","we","you","is","a","an","of","and","or","to","for","from","on","with","this","that","in","at","by"]);
    const keywords = userPrompt.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => !stopWords.has(w)).map(w => `%${w}%`);
    const result = await database.query(`SELECT * FROM products WHERE name ILIKE ANY($1) OR description ILIKE ANY($1) OR category ILIKE ANY($1) LIMIT 200`, [keywords]);
    if (result.rows.length === 0)
      return NextResponse.json({ success: true, message: "No products found.", products: [] });
    const aiResult = await getAIRecommendation(userPrompt, result.rows);
    if (!aiResult.success)
      return NextResponse.json({ success: false, message: aiResult.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "AI filtered products.", products: aiResult.products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode || 500 });
  }
}
