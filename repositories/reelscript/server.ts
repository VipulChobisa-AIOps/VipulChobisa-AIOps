import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Generate Scripts
  app.post("/api/generate-scripts", async (req, res) => {
    const { links, manualTranscript } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured. Please configure GEMINI_API_KEY in Settings > Secrets." });
    }

    if (!links || !Array.isArray(links) || links.length === 0) {
      return res.status(400).json({ error: "Please provide valid source link(s) for the generator." });
    }

    const prompt = `
      You are an expert Reels and Shorts scriptwriter specialized in viral content.
      
      SOURCE DATA:
      Links: ${links.join(', ')}
      Context/Transcript: ${manualTranscript || 'None provided'}

      CORE REQUIREMENT:
      Create UNIQUE and SPECIFIC scripts matching the themes or content of the sources provided. 
      If multiple links are provided, analyze their individual themes (different topics, tones, or industries) and ensure 
      each generated script reflects a different source or a specific hybrid of them.

      TASK:
      Generate 3 distinct, viral scripts.
      Each script must include:
      1. A catchy Title and Category.
      2. An English version (Hook, Body, CTA).
      3. A Hindi version (Hook, Body, CTA).
      4. Relevant Audio/Vibe suggestion.
      5. A descriptive AI Image Prompt for the background.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                english: {
                  type: Type.OBJECT,
                  properties: {
                    hook: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING },
                  },
                  required: ["hook", "body", "cta"]
                },
                hindi: {
                  type: Type.OBJECT,
                  properties: {
                    hook: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING },
                  },
                  required: ["hook", "body", "cta"]
                },
                audioSuggestion: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
              },
              required: ["title", "category", "english", "hindi", "audioSuggestion", "imagePrompt"]
            },
          },
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text was returned by Gemini.");
      }

      const parsed = JSON.parse(text.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini Generation Error on Server:", error);
      let errMsg = error?.message || "An unexpected error occurred during generation.";
      if (errMsg.includes('PERMISSION_DENIED')) {
        errMsg = "Permission Denied: Please check if the Gemini API is enabled for this API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
