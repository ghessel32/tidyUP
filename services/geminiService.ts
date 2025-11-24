import { GoogleGenAI, Type } from "@google/genai";
import { RoomAnalysis } from "../types";
const apiKey = __GEMINI_KEY__;

if (!apiKey) throw new Error("Missing Gemini API key");

const ai = new GoogleGenAI({
  apiKey
});

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    roomType: {
      type: Type.STRING,
      description: "The type of room identified (e.g., Bedroom, Kitchen, Home Office).",
    },
    clutterLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Extreme"],
      description: "The assessed level of clutter in the room.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, friendly summary of the room's current state and potential.",
    },
    actionableSteps: {
      type: Type.ARRAY,
      description: "A list of specific, actionable steps to declutter and organize the room.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short title of the action." },
          description: { type: Type.STRING, description: "Detailed instruction on what to do." },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Priority level of this task." },
          estimatedTimeMinutes: { type: Type.NUMBER, description: "Estimated time in minutes to complete this task." },
        },
        required: ["title", "description", "priority", "estimatedTimeMinutes"],
      },
    },
    storageSolutions: {
      type: Type.ARRAY,
      description: "Suggested products or storage methods to help organize.",
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Name of the storage item or furniture." },
          usage: { type: Type.STRING, description: "How to use this item in the specific context of this room." },
          category: { type: Type.STRING, enum: ["Furniture", "Organizer", "Decor", "Other"] },
        },
        required: ["item", "usage", "category"],
      },
    },
    motivationalQuote: {
      type: Type.STRING,
      description: "A short, encouraging quote related to cleaning, organization, or fresh starts.",
    },
  },
  required: ["roomType", "clutterLevel", "summary", "actionableSteps", "storageSolutions", "motivationalQuote"],
};

export const analyzeRoomImage = async (base64Image: string): Promise<RoomAnalysis> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, or detect from header
              data: base64Data,
            },
          },
          {
            text: "You are a professional interior organizer and decluttering expert. Analyze this photo of a room. Provide a structured guide on how to organize it, identifying specific areas of clutter and suggesting practical solutions. Be encouraging, non-judgmental, and highly practical.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent structured output
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as RoomAnalysis;
  } catch (error) {
    console.error("Error analyzing room:", error);
    throw error;
  }
};
