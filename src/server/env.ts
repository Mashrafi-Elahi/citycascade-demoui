// Vite/TanStack Start exposes env via import.meta.env at build time.
// Backend server routes can also read process.env when running under Node.
export const env = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "citycascade",
  // AI configuration — can be set per-request from the UI, or pre-filled via env.
  AI_PROVIDER: process.env.AI_PROVIDER || "template", // gemini | openai-compat | template
  AI_API_KEY: process.env.AI_API_KEY || "",
  AI_BASE_URL: process.env.AI_BASE_URL || "",
  AI_MODEL: process.env.AI_MODEL || "",
};
