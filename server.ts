import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("GoogleGenAI initialized with key success");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  } else {
    console.log("No GEMINI_API_KEY env. Interactive fallbacks will be used.");
  }

  // API for chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request payload. 'messages' array expected." });
      }

      // System instructions for the bilingual AI Teacher
      const systemInstruction = `
You are "Bolo English AI Teacher" (or "Bolo English Mentor"), a highly supportive, friendly bilingual (Bengali-English) English language coach specializing in helping native Bengali speakers transition to fluent, natural spoken English.

Core Mission:
Identify and constructively correct common mistakes native Bengali speakers make when speaking English. These include:
1. Literal translations (translating literally from Bengali word-for-word, like "My cold is looking" for "আমার ঠান্ডা লেগেছে / I have a cold", or "eating a cigarette" for "ধুমপান করা / smoking", or "eating a blow" for "মার খাওয়া / getting beaten up").
2. Syntax differences (Subject-Object-Verb in Bengali vs. Subject-Verb-Object in English, e.g., "I rice eat" vs "I eat rice").
3. Phonetics & pronunciation (mispronouncing silent 'h' in 'honest', mixing 'v' and 'b' sounds, mixing 'p' and 'f' sounds, or missing terminal 't' and 'd' consonants leading to speaking "wan" instead of "want").
4. Contextual survival (IT software company interviews, ordering fast food, texting on WhatsApp politely, email writing style).

Response Rules:
- Keep responses extremely warm, gamified, structured, clear, and highly motivating.
- Use bilingual cues (explain in Bengali when helpful, using Bangla alphabet or Banglish, then write English sentences clearly).
- Frame key English lessons using phonetic tips (e.g., "[B-V] sound - place your upper teeth on your lower lip for V, like Voice!") or literal-idioms repair (e.g., "Olpo joler mach" translates idiomatically as "a small fry", not "fish of small water").
- Bold key terms or corrected phrases.
- Speak in a friendly hybrid code-mixed manner that feels approachable. For example: "Bhalobasa! Let's conquer that sentence today."
- Keep replies brief and conversational, as if in a chat app.
`;

      // Fallback mock responses if API Key is not set or client fails
      if (!ai) {
        const userMsg = messages[messages.length - 1]?.content || "";
        let reply = "";
        
        const textLower = userMsg.toLowerCase();
        if (textLower.includes("hello") || textLower.includes("hi") || textLower.includes("hey") || textLower.includes("kemon")) {
          reply = "Assalamu Alaikum! Hello learner! I am your **Bolo English Mentor** 🇧🇩✨. Kemon achen? \n\nI am here to help you speak English fearlessly! We will practice: \n1. **Literal Translation Fixes** ('my head is turning' ❌ -> 'I feel dizzy' ✅)\n2. **Phonetic Drills** ('feese' ❌ -> 'Fish' ✅)\n3. **Contextual Survival** (IT Interviews, Coffee shop conversations)\n\nWhat would you like to try? Just tell or ask me anything!";
        } else if (textLower.includes("cold") || textLower.includes("looking")) {
          reply = "Ah! You said *'My cold is looking'*! 🤧 \nThis is a classic **literal translation habit** from Bengali 'আমার ঠান্ডা লেগেছে' (Amar thhonda legeche). \n\nIn English, never say 'cold is looking'. Instead, say: \n👉 **'I have a cold'** \n👉 **'I've caught a cold'** \n\nLet's repeat after me out loud: *'I caught a cold!'* 🌟 Does that make sense?";
        } else if (textLower.includes("fish") || textLower.includes("olpo") || textLower.includes("mach")) {
          reply = "Chomokdar proshno! (Great question!) 🐟 \nIn Bengali, we say *'Olpo joler mach'* (অল্প জলের মাছ) to mean someone of insignificant status. But if you translate that literally as *'fish of little water'*, English speakers will be confused! \n\nThe situational idiom you want is:\n👉 **'A small fry'** \n\n*Example:* 'In this massive corporation, I'm just a **small fry**, but I will work my way up!' Let's practice using *'small fry'* in a sentence!";
        } else if (textLower.includes("interview") || textLower.includes("job") || textLower.includes("recruit")) {
          reply = "Brilliant! Let's get you ready for that big IT job interview! 💻👔 \n\nWhen a recruiter asks: *'Can you tell us about your experience?'*, avoid saying *'I completed passing from College since 3 years.'* \n\nInstead say: \n👉 **'I graduated from X College three years ago and have been working as a Software Engineer...'** \n\nPhonetic tip: Say **'gradu-A-ted'** with a clear sound, not 'gradu-ate'. Try reading those words out loud!";
        } else if (textLower.includes("head") || textLower.includes("turn") || textLower.includes("ghurchhe")) {
          reply = "Oh! 'Matha ghurchhe' (মাথা ঘুরছে) translates literally to *'My head is spinning/turning'*. While 'My head is spinning' is sometimes used, a more common, natural phrase is: \n👉 **'I feel dizzy'** or **'I feel lightheaded'** \n\n*Example:* 'I didn't eat breakfast today, so now **I feel dizzy**.' try saying: *'I feel dizzy!'*!";
        } else {
          reply = `That's great practice! 🌟 Let's correct your phrasing into natural English. 

Did you know many of us say "I will eat a cigarette"? In English, always use **"smoke"**:
❌ *"I want to eat a cigarette"*
✅ **"I want to smoke"** or **"I'm going for a smoke."**

What else would you like to translate, or what conversation scenario should we try next? 🇧🇩🇬🇧`;
        }
        
        return res.json({ text: reply });
      }

      // Create content request
      let promptWithHistory = "Previous exchange history summary:\n";
      messages.slice(-6).forEach((m: any) => {
        promptWithHistory += `${m.role === "user" ? "Student" : "Teacher"}: ${m.content}\n`;
      });
      promptWithHistory += `\nStudent's new message: "${messages[messages.length - 1]?.content}"\n\nPlease formulate an extremely warm, encouraging response in character as the supportive "Bolo English Mentor". Fix their spelling, syntax, or literal habit slip-ups with bilingual explanations if applicable. Avoid repeating previous explanations. Code-mix gently in Bengali/English. Keep it conversational!`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptWithHistory,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Amar bondhu! Let's keep practicing to become English fluent!";
      return res.json({ text: replyText });
    } catch (err: any) {
      console.error("Gemini API server route error:", err);
      return res.status(500).json({ error: err.message || "Conversational system experienced a brief hiccup." });
    }
  });

  // Serve static assets from build in production, otherwise Vite passes dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
