import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. Please configure it in your secrets.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const CHAT_MODEL = "gemini-3.1-pro-preview"; // Using pro for high-quality chat as requested
