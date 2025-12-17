
import { GoogleGenAI, Type } from "@google/genai";
import { CardData, Rarity } from "../types";

// This is a client-side only service for the "Forge" feature
export const generateCardFromPrompt = async (prompt: string): Promise<Partial<CardData> | null> => {
  if (!process.env.API_KEY) {
    console.error("No API Key provided");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Schema for card generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crea una carta única y equilibrada para un juego de cartas de fantasía sci-fi basado en este tema: "${prompt}". 
      La respuesta DEBE estar en ESPAÑOL (nombre y descripción).
      La rareza debe ser aleatoria pero sesgada hacia Rara/Épica. 
      Equilibra las estadísticas (ataque/salud) alrededor del costo (1-8). 
      Ataque y Salud deben estar entre 1 y 10.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: ["COMMON", "RARE", "EPIC", "LEGENDARY"] },
            stats: {
              type: Type.OBJECT,
              properties: {
                attack: { type: Type.INTEGER },
                health: { type: Type.INTEGER },
                cost: { type: Type.INTEGER },
                speed: { type: Type.STRING, enum: ["SLOW", "NORMAL", "FAST"] }
              },
              required: ["attack", "health", "cost", "speed"]
            }
          },
          required: ["name", "description", "rarity", "stats"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as Partial<CardData>;
    }
    return null;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};
