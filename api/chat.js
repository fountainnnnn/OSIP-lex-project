// api/chat.js — Vercel serverless route for Daoer Zenee chatbot (OpenAI)
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Vercel body parsing: ensure JSON
    const { prompt } = req.body || {};

    if (!prompt) {
      res.status(400).json({ reply: "Missing prompt" });
      return;
    }

    // ✅ Read key from Vercel env vars
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error("❌ Missing OPENAI_API_KEY");
      res.status(500).json({ reply: "API key not configured" });
      return;
    }

    // ✅ Initialize client
    const openai = new OpenAI({ apiKey: openaiKey });

    // ✅ Query OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 120,
    });

    const reply = response.choices?.[0]?.message?.content || "(no reply)";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 OpenAI API error:", err);
    res.status(500).json({ reply: "(Offline mode 🌿) API error on server." });
  }
}
