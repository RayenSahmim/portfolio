"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Content } from "@google/generative-ai";
import { generateProjectPrompt, PORTFOLIO_ASSISTANT_PROMPT,  Project } from "@/lib/prompts";
import { GenerateResponseStream } from "@/lib/utils";

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
    const stream = await GenerateResponseStream({
      prompt,
      SystemPrompt: PORTFOLIO_ASSISTANT_PROMPT,
      history,
      apikey,
      generationConfig,
    })

    return stream
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI response.");
  }
};

export const explainProject = async (project: Project , history: Content[] , userMessage: string) => {
  try {
    const SystemPrompt = generateProjectPrompt(project);
    const stream = GenerateResponseStream({
    prompt : userMessage,
    SystemPrompt,
    history,
    apikey: process.env.GEMINI_API_KEY || '',
    generationConfig
  })
  return stream
  } catch (error) {
    console.error(error);
    throw new Error("Failed to explain project.");
  }
};