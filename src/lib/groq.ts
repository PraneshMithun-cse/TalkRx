import Groq from "groq-sdk";

const globalForGroq = globalThis as unknown as { groq?: Groq };

export const groq = globalForGroq.groq ?? new Groq({ apiKey: process.env.GROQ_API_KEY });

if (process.env.NODE_ENV !== "production") {
  globalForGroq.groq = groq;
}

/** Text extraction / reasoning model — supports structured JSON outputs. No Llama chat model is
 * currently active on this Groq account (verified against the live /models endpoint), so this
 * is the strongest available general-purpose text model. */
export const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";

/** The only vision-capable (image input) model currently active on this Groq account. */
export const GROQ_VISION_MODEL = "qwen/qwen3.6-27b";
