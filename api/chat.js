// api/chat.js — Vercel Serverless OpenAI Proxy
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const body = await readBody(req);
    const { prompt } = body;

    if (!prompt) {
      return res.status(400).json({ reply: "Missing prompt in request" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY missing in environment");
      return res.status(500).json({ reply: "Server not configured with API key" });
    }

    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 120,
    });

    const reply = response.choices?.[0]?.message?.content ?? "(no reply)";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 OpenAI API error:", err);
    return res.status(500).json({ reply: "(Offline mode 🌿) API server error." });
  }
}

// --- Helper for parsing body safely ---
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return {};
  }
}
