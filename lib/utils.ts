import { HfInference } from "@huggingface/inference"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GenerateResponseStream = async ({
  prompt,
  SystemPrompt,
  history,
  apiToken,
}: {
  prompt: string;
  SystemPrompt: string;
  history: ChatMessage[];
  apiToken: string;
}) => {
  try {
    const hf = new HfInference(apiToken);

    // Build the messages array: system prompt + history + current user message
    const messages = [
      { role: "system" as const, content: SystemPrompt },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: prompt },
    ];

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const encoder = new TextEncoder();

          const response = hf.chatCompletionStream({
            model: "meta-llama/Llama-3.2-3B-Instruct",
            messages,
            max_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
          });

          for await (const chunk of response) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return stream;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI response.");
  }
}