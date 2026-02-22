"use server";
import { generateProjectPrompt, PORTFOLIO_ASSISTANT_PROMPT, Project } from "@/lib/prompts";
import { GenerateResponseStream, type ChatMessage } from "@/lib/utils";

export const sendAIResponse = async (prompt: string, history: ChatMessage[]) => {
  const apiToken = process.env.API_TOKEN;
  if (!apiToken) {
    throw new Error("API_TOKEN is required");
  }

  try {
    const stream = await GenerateResponseStream({
      prompt,
      SystemPrompt: PORTFOLIO_ASSISTANT_PROMPT,
      history,
      apiToken,
    });

    return stream;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch AI response.");
  }
};

export const explainProject = async (project: Project, history: ChatMessage[], userMessage: string) => {
  try {
    const apiToken = process.env.API_TOKEN;
    if (!apiToken) {
      throw new Error("API_TOKEN is required");
    }

    const SystemPrompt = generateProjectPrompt(project);
    const stream = await GenerateResponseStream({
      prompt: userMessage,
      SystemPrompt,
      history,
      apiToken,
    });

    return stream;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to explain project.");
  }
};