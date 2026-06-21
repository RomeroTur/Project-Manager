import OpenAI from "openai";

export const aiClient = new OpenAI({
	apiKey: process.env.ANTHROPIC_API_KEY,
	baseURL: "https://api.anthropic.com/v1/",
});
