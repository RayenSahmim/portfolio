import { Content, GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GenerateResponseStream = async ({prompt ,SystemPrompt , history, apikey, generationConfig } : {prompt: string, SystemPrompt: string, history: Content[], apikey: string, generationConfig: GenerationConfig}) => {
    try {
      const genAI = new GoogleGenerativeAI(apikey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        systemInstruction: SystemPrompt
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
}