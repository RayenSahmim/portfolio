"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Content } from "@google/generative-ai";
import { PORTFOLIO_ASSISTANT_PROMPT } from "@/lib/prompts";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
export const sendAIResponse = async (prompt: string, history: Content[]) => {
  const apikey = process.env.GEMINI_API_KEY;
  if (!apikey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      systemInstruction: PORTFOLIO_ASSISTANT_PROMPT
    });

    const chat = model.startChat({
      generationConfig,
      history,
    });

    const result = await chat.sendMessageStream([prompt]);

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // Encode text as Uint8Array for proper streaming
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close(); // Close the stream when finished
        } catch (error) {
          controller.error(error); // Handle errors in the stream
        }
      },
    });

    return stream; // Return the stream to the caller
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI response.");
  }
};