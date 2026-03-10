import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateMemeIdea = async (topic?: string) => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const prompt = topic 
    ? `Crie uma ideia de meme viral sobre: ${topic}. Retorne um JSON com: { "topText": "texto de cima", "bottomText": "texto de baixo", "description": "descrição da imagem ideal" }`
    : `Sugira uma ideia de meme viral que está em alta agora nas redes sociais. Retorne um JSON com: { "topText": "texto de cima", "bottomText": "texto de baixo", "description": "descrição da imagem ideal" }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  if (!response.text) {
    throw new Error("AI returned an empty response");
  }

  return JSON.parse(response.text);
};
