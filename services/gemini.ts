
import { GoogleGenAI, Type } from "@google/genai";
import { TripPlan, TripCategory, TravelType, Language, Currency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const tripSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    totalBudget: { type: Type.NUMBER },
    budgetUsed: { type: Type.NUMBER },
    durationDays: { type: Type.NUMBER },
    peopleCount: { type: Type.NUMBER },
    category: { type: Type.STRING },
    safetyScore: { type: Type.NUMBER },
    savingsVsMarket: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    currency: { type: Type.STRING },
    legs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          stay: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              cost: { type: Type.NUMBER },
              rating: { type: Type.NUMBER }
            },
            required: ["name", "type", "cost", "rating"]
          },
          transportOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                duration: { type: Type.STRING },
                comfort: { type: Type.NUMBER },
                carbonFootprint: { type: Type.STRING },
                recommended: { type: Type.BOOLEAN }
              },
              required: ["mode", "cost", "duration", "comfort", "carbonFootprint", "recommended"]
            }
          },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                type: { type: Type.STRING },
                isPopular: { type: Type.BOOLEAN },
                isHiddenGem: { type: Type.BOOLEAN },
              },
              required: ["name", "cost", "type"]
            }
          },
        },
        required: ["day", "from", "to", "stay", "transportOptions", "activities"]
      }
    }
  },
  required: ["name", "totalBudget", "budgetUsed", "durationDays", "peopleCount", "category", "safetyScore", "savingsVsMarket", "summary", "legs", "currency"]
};

export async function generateTripPlan(params: {
  origin: string,
  destinations: string[],
  budget: number,
  days: number,
  people: number,
  type: TravelType,
  category: TripCategory,
  toggles: string[],
  language: Language,
  currency: Currency
}): Promise<TripPlan> {
  const isBiker = params.type === TravelType.BIKER;
  
  const prompt = `
    Act as Yaatriq AI, a global travel planner.
    Plan a ${params.days}-day trip for ${params.people} travelers.
    Start: ${params.origin}.
    Route Stops (Optimize Order): ${params.destinations.join(', ')}.
    Dynamic: ${params.type}. 
    Budget Cap: ${params.budget} ${params.currency}.
    Language Output: ${params.language} (Translate names/summary if applicable, keep JSON keys English).
    Behavior: ${params.toggles.join(', ')}.

    REQUIREMENTS:
    1. Organize the route logically (TSP algorithm simulation).
    2. For each leg, provide 2-3 transport options (e.g., Bus vs Train vs Cab) in 'transportOptions'.
    3. ${isBiker ? "For Biker mode, transport options should be 'Own Bike' (fuel cost) vs 'Rental Bike'. Highlight scenic routes." : ""}
    4. Provide realistic costs in ${params.currency}.
    5. Return JSON only matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: tripSchema,
      systemInstruction: "You are YAATRIQ AI. You optimize travel logistics. Always return valid JSON."
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI calculation failed.");
  
  const plan = JSON.parse(text) as TripPlan;
  plan.id = Math.random().toString(36).substr(2, 9);
  return plan;
}

export async function handleVoiceCommand(transcript: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `User voice input: "${transcript}". Provide travel advice or confirm navigation updates in a concise, authoritative tone.`,
    config: {
      systemInstruction: "You are the voice interface for Yaatriq AI. Keep responses under 20 words."
    }
  });
  return response.text || "Command received.";
}
