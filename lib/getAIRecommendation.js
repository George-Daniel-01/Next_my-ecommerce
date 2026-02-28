export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "models/gemini-2.0-flash";
  const URL = https://generativelanguage.googleapis.com/v1/+MODEL+:generateContent?key=+API_KEY;
  try {
    const geminiPrompt = Here is a list of available products:\n+JSON.stringify(products, null, 2)+\nBased on the following user request, filter and suggest the best matching products:\n"+userPrompt+"\nOnly return the matching products in JSON format.;
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: geminiPrompt }] }] }),
    });
    const data = await response.json();
    if (data.error) return { success: false, message: data.error.message };
    const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const cleanedText = aiResponseText.replace(/"`json|"`/g, "").trim();
    if (!cleanedText) return { success: false, message: "AI response empty." };
    const parsedProducts = JSON.parse(cleanedText);
    return { success: true, products: parsedProducts };
  } catch (error) {
    return { success: false, message: "Internal server error." };
  }
}
