import { GoogleGenAI, Type } from "@google/genai";
import { Category, ImageMetadata } from "../types";

// Helper to convert file to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<ImageMetadata> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this photograph for a portfolio website. 
    1. Provide a creative and artistic title.
    2. Provide a brief, engaging description (1-2 sentences).
    3. Categorize it into exactly one of these categories: Portraits, Landscapes, Events, Abstract.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedCategory: { 
              type: Type.STRING, 
              enum: [Category.PORTRAITS, Category.LANDSCAPES, Category.EVENTS, Category.ABSTRACT] 
            }
          },
          required: ["title", "description", "suggestedCategory"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    const result = JSON.parse(jsonText) as ImageMetadata;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      title: "Untitled Upload",
      description: "A beautiful photograph.",
      suggestedCategory: Category.ABSTRACT
    };
  }
};