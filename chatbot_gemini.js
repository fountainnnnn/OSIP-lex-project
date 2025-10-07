// Daoer Zenee Smart Chatbot — Gemini 2.5 Flash (Secure Server Proxy + RAG) 🌿
// Works safely on static Vercel sites.  The browser never sees the API key.
// Uses daoer-zenee-data.txt as lightweight RAG knowledge.

const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatBody   = document.getElementById("chat-body");
const chatInput  = document.getElementById("chat-input");
const chatSend   = document.getElementById("chat-send");

let daoerData = [];
let chatMemory = [];

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

// --- Smart RAG retrieval ---
function retrieveContext(userText, topN = 8) {
  if (daoerData.length === 0) return "";
  const lower = userText.toLowerCase();
  const words = lower.split(/\s+/);

  const synonyms = {
    address: ["address","where","located","location","place","find","visit","office"],
    product: ["product","item","sell","buy","price","catalog","make"],
    contact: ["contact","phone","email","whatsapp"],
    founder: ["founder","who started","who runs","leader","creator"],
    community: ["community","group","member","volunteer","people"],
    mission: ["mission","goal","purpose","vision"],
    origin: ["origin","start","history","founded","began"],
  };

  const scored = daoerData.map(line => {
    let score = 0;
    const l = line.toLowerCase();
    for (const w of words) if (l.includes(w) || w.includes(l)) score += 1;
    if (l.includes("daoer zenee")) score += 3;
    if (l.includes("jakarta")) score += 2;
    if (l.includes("community")) score += 2;
    for (const group of Object.values(synonyms))
      if (group.some(g => lower.includes(g) && l.includes(g))) score += 2;
    return { line, score };
  });

  return scored
    .filter(t => t.score > 0)
    .sort((a,b)=>b.score-a.score)
    .slice(0, topN)
    .map(t=>t.line)
    .join(" ");
}

// --- Query Gemini through Vercel backend ---
async function queryGemini(prompt) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("Gemini API route error");
    const data = await res.json();
    return data.reply || "(no response)";
  } catch (err) {
    console.warn("⚠️ Falling back to offline mode:", err);
    return "(Offline mode 🌿) My creator’s API quota ran out — but I can still chat from memory!";
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

Short-term memory (last 2 exchanges):
${memoryContext || "(no prior messages)"}

Relevant knowledge from Daoer Zenee data:
${retrieved || "(no extra context found)"}

Instructions:
- Infer answers even if exact wording isn’t present.
- Combine multiple facts if needed.
- Reply naturally in 1–2 short sentences.
- If question is about Daoer Zenee, reflect its brand, crafts, or social mission.
- Otherwise, reply plainly and briefly.

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
  console.log("💬 Initializing Daoer Zenee Assistant (Gemini Secure Mode)...");
  await loadContext();
  console.log("✅ Ready — backend /api/gemini will use GEMINI_API_KEY from Vercel env vars.");
})();

// --- Events ---
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    const t = chatInput.value.trim();
    chatInput.value = "";
    respond(t);
  }
});
chatSend.addEventListener("click", () => {
  if (chatInput.value.trim()) {
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    chatInput.dispatchEvent(event);
  }
});
chatToggle.addEventListener("click", () => chatWindow.classList.toggle("show"));
document.addEventListener("click", e => {
  if (!chatWindow.contains(e.target) && !chatToggle.contains(e.target))
    chatWindow.classList.remove("show");
});
