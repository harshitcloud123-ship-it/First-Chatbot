import { createChatModel } from "./lc-model";
import { AskResult, AskResultschema } from "./schema";

export async function askStructured(query: string): Promise<AskResult> {
    const { model } = createChatModel();

    // Instructing the model in defined schema format 
    const system = "You are a Concised assistant. Return only the requested JSON object."
    const user = `Summarize this text in a concise manner for a beginner: \n + ${query} \n + Return JSON object with keys: summary (short paragraph) and confidence (number 0-1).`
    const structured = model.withStructuredOutput(AskResultschema);
    const result = await structured.invoke([
        { role: "system", content: system },
        { role: "user", content: user },
    ]);
    return result;
}