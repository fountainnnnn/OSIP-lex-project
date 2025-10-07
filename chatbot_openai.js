// Daoer Zenee Smart Chatbot — OpenAI GPT-4o Mini (Enhanced RAG + Summarization) 🌿
// Browser-safe, works on Vercel/static sites
// Uses daoer-zenee-data.txt as lightweight RAG context
// Intelligently infers + summarizes related info from multiple lines
// Memory: remembers last 2 exchanges
// Replies: short, clear, and cheap

import OpenAI from "https://cdn.jsdelivr.net/npm/openai@4.57.0/+esm";

const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

let daoerData = [];
let openaiKey = null;
let chatMemory = [];
let client = null;

// --- Load Daoer Zenee knowledge base ---
async function loadContext() {
  try {
    const res = await fetch("daoer-zenee-data.txt");
    if (!res.ok) throw new Error("daoer-zenee-data.txt not found");
    const text = await res.text();
    daoerData = text.split("\n").map(l => l.trim()).filter(Boolean);
    console.log("✅ Daoer Zenee data loaded:", daoerData.length, "lines");
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
    "Every piece has a story 🌿",
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

    for (const w of words) if (l.includes(w) || w.includes(l)) score += 1;

    if (l.includes("daoer zenee")) score += 3;
    if (l.includes("jakarta")) score += 2;
    if (l.includes("community")) score += 2;

    for (const group of Object.values(synonyms)) {
      if (group.some(g => lower.includes(g) && l.includes(g))) score += 2;
    }

    return { line, score };
  });

  const top = scored
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return top.map(t => t.line).join(" ");
}

// --- OpenAI query (browser-safe) ---
async function queryOpenAI(prompt) {
  if (!client) throw new Error("OpenAI client not initialized");

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 120,
    });
    return response.choices[0].message.content || "(no response)";
  } catch (err) {
    if (err.status === 429) {
      console.warn("⚠️ Rate limit or quota exceeded — switching to offline mode");
      return "(Offline mode 🌿) My creator’s API quota ran out — but I can still chat from memory!";
    }
    throw err;
  }
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

    const reply = await queryOpenAI(ragPrompt);
    chatMemory.push({ role: "assistant", content: reply });
    if (chatMemory.length > 4) chatMemory.shift();

    chatBody.lastChild.textContent = reply;
  } catch (err) {
    console.warn("⚠️ OpenAI unavailable, switching to offline mode:", err);
    chatBody.lastChild.textContent =
      "(Offline mode 🌿) " + offlineReply(userText);
  }
}

// --- Initialize chatbot ---
(async () => {
  console.log("💬 Initializing Daoer Zenee Assistant (OpenAI RAG Mode)...");
  await loadContext();

  try {
    openaiKey =
      window.OPENAI_API_KEY ||
      (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_OPENAI_API_KEY) ||
      (typeof process !== "undefined" && process.env?.OPENAI_API_KEY);

    if (!openaiKey) {
      console.warn("⚠️ No OPENAI_API_KEY found → offline mode only.");
    } else {
      console.log("✅ OpenAI API key loaded successfully.");
      client = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
    }
  } catch (err) {
    console.warn("⚠️ Could not init OpenAI client, offline mode.", err);
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

// --- Chat toggle + close on outside click ---
chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("show");
});

chatSend.addEventListener("click", () => {
  if (chatInput.value.trim()) {
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    chatInput.dispatchEvent(event);
  }
});

// Optional: Close when clicking outside chat
document.addEventListener("click", e => {
  if (!chatWindow.contains(e.target) && !chatToggle.contains(e.target)) {
    chatWindow.classList.remove("show");
  }
});
