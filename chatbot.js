// Daoer Zenee Smart Chatbot — Gemini 2.5 Flash (Enhanced RAG + Summarization) 🌿
// Browser-safe, works on Vercel/static sites
// Uses daoer-zenee-data.txt as lightweight RAG context
// Now intelligently infers + summarizes related info from multiple lines
// Memory: remembers last 2 exchanges
// Replies: short, clear, and cheap

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatBody   = document.getElementById("chat-body");
const chatInput  = document.getElementById("chat-input");

let daoerData = [];
let geminiKey = null;
let chatMemory = [];
let model = null;

// --- Load Daoer Zenee knowledge base ---
async function loadContext() {
  try {
    const res = await fetch("daoer-zenee-data.txt");
    if (!res.ok) throw new Error("daoer-zenee-data.txt not found");
    const text = await res.text();
    daoerData = text.split("\n").map(l => l.trim()).filter(Boolean);
    console.log(" Daoer Zenee data loaded:", daoerData.length, "lines");
  } catch (err) {
    console.error(err);
    appendMsg("bot", "Hmm… I can’t find my Daoer Zenee knowledge 😢");
  }
}

// --- Display messages ---
function appendMsg(sender, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// --- Offline fallback ---
function offlineReply(input) {
  input = input.toLowerCase();
  const casual = {
    hi: "Hi! Always happy to chat about Daoer Zenee 🌿",
    hello: "Hello there 👋",
    "how are": "Feeling creative as always 💚",
    bye: "Goodbye 👋 Thanks for supporting handmade art!",
    thanks: "You’re welcome 🙏",
  };
  for (const k in casual) if (input.includes(k)) return casual[k];
  for (const line of daoerData)
    if (input.split(/\s+/).some(w => line.toLowerCase().includes(w))) return line;
  const random = [
    "That’s interesting 🌸",
    "Could you tell me a bit more?",
    "Every piece has a story 🌿"
  ];
  return random[Math.floor(Math.random() * random.length)];
}

// --- Smart RAG: brand-sensitive, semantic scoring ---
function retrieveContext(userText, topN = 8) {
  if (daoerData.length === 0) return "";

  const lower = userText.toLowerCase();
  const words = lower.split(/\s+/);

  const synonyms = {
    address: ["address", "where", "located", "location", "place", "find", "visit", "office"],
    product: ["product", "item", "sell", "buy", "price", "catalog", "make"],
    contact: ["contact", "phone", "email", "whatsapp"],
    founder: ["founder", "who started", "who runs", "leader", "creator"],
    community: ["community", "group", "member", "volunteer", "people"],
    mission: ["mission", "goal", "purpose", "vision"],
    origin: ["origin", "start", "history", "founded", "began"],
  };

  const scored = daoerData.map(line => {
    let score = 0;
    const l = line.toLowerCase();

    // Partial matches
    for (const w of words)
      if (l.includes(w) || w.includes(l)) score += 1;

    // Brand sensitivity
    if (l.includes("daoer zenee")) score += 3;
    if (l.includes("jakarta")) score += 2;
    if (l.includes("community")) score += 2;

    // Synonym matching
    for (const group of Object.values(synonyms)) {
      if (group.some(g => lower.includes(g) && l.includes(g))) score += 2;
    }

    return { line, score };
  });

  // Keep top matches even with low score to infer broader context
  const top = scored
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // Summarize related info for Gemini
  const summarized = top.map(t => t.line).join(" ");
  return summarized;
}

// --- Gemini query (browser-safe) ---
async function queryGemini(prompt) {
  if (!model) throw new Error("Gemini model not initialized");
  const result = await model.generateContent(prompt);
  const text = await result.response.text();
  return text || "(no response)";
}

// --- Respond logic ---
async function respond(userText) {
  if (!userText.trim()) return;
  appendMsg("user", userText);
  appendMsg("bot", "Thinking…");

  try {
    chatMemory.push({ role: "user", content: userText });
    if (chatMemory.length > 4) chatMemory.shift();

    const retrieved = retrieveContext(userText, 8);
    const memoryContext = chatMemory
      .slice(-4)
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const ragPrompt = `
You are Daoer Zenee’s friendly assistant.
You have access to summarized facts about Daoer Zenee below.

Short-term memory (last 2 exchanges):
${memoryContext || "(no prior messages)"}

Relevant knowledge from Daoer Zenee data:
${retrieved || "(no extra context found)"}

Instructions:
- Infer answers even if exact wording isn’t present.
- Combine multiple facts if needed to form a complete answer.
- Reply naturally in 1–2 short sentences.
- If the question is about Daoer Zenee, ensure the reply reflects its brand, crafts, or social mission.
- If unrelated, just answer plainly and briefly.

User: "${userText}"
`;

    const reply = await queryGemini(ragPrompt);
    chatMemory.push({ role: "assistant", content: reply });
    if (chatMemory.length > 4) chatMemory.shift();

    chatBody.lastChild.textContent = reply;
  } catch (err) {
    console.warn("⚠️ Gemini unavailable, switching to offline mode:", err);
    chatBody.lastChild.textContent =
      "(Offline mode 🌿) " + offlineReply(userText);
  }
}

// --- Initialize chatbot ---
(async () => {
  console.log("💬 Initializing Daoer Zenee Assistant (Enhanced RAG Mode)...");
  await loadContext();

  try {
    geminiKey =
      window.GEMINI_API_KEY ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
      (typeof process !== "undefined" && process.env?.GEMINI_API_KEY);

    if (!geminiKey) {
      console.warn("⚠️ No GEMINI_API_KEY found → offline mode only.");
    } else {
      console.log(" Gemini API key loaded successfully.");
      const ai = new GoogleGenerativeAI(geminiKey);
      model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
  } catch (err) {
    console.warn("⚠️ Could not init Gemini client, offline mode.", err);
  }
})();

// --- Events ---
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    const t = chatInput.value.trim();
    chatInput.value = "";
    respond(t);
  }
});

chatToggle.addEventListener("click", () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
});
