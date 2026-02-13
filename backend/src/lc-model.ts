import { loadEnv } from "./env";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type Provider = 'groq' | 'openai' | 'gemini';

export function createChatModel(): { provider: Provider; model: any } {
    loadEnv();
    const provider = (process.env.PROVIDER || '').toLowerCase() as Provider;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    const base = { temperature: 0 as const };

    if (provider === 'openai' || !provider && hasOpenAIKey) {
        return { provider: 'openai', model: new ChatOpenAI({ ...base, model: 'gpt-4o-mini' }) }
    }
    if (provider === 'groq' || !provider && hasGroqKey) {
        return { provider: 'groq', model: new ChatGroq({ ...base, model: 'llama-3.3-70b-versatile' }) }
    }
    if (provider === 'gemini' || !provider && hasGeminiKey) {
        return { provider: 'gemini', model: new ChatGoogleGenerativeAI({ ...base, model: 'gemini-2.5-flash' }) }
    }
    return { provider: 'gemini', model: new ChatGoogleGenerativeAI({ ...base, model: 'gemini-2.5-flash' }) }
}
