export const PROVIDERS = {
    openai: {
        baseUrl: "https://api.openai.com/v1/chat/completions",
        defaultModel: "gpt-4o-mini",
        authHeader: (key) => `Bearer ${key}`
    },
    groq: {
        baseUrl: "https://api.groq.com/openai/v1/chat/completions",
        defaultModel: "llama-3.1-8b-instant",
        authHeader: (key) => `Bearer ${key}`
    },
    openrouter: {
        baseUrl: "https://openrouter.ai/api/v1/chat/completions",
        defaultModel: "google/gemini-pro-1.5-exp",
        authHeader: (key) => `Bearer ${key}`
    },
    local: {
        baseUrl: "http://localhost:11434/v1/chat/completions", // Default Ollama/OpenClaw local port
        defaultModel: "llama3",
        authHeader: (key) => `Bearer ${key}`
    }
};

export function getProviderConfig(name, customBaseUrl = "") {
    const p = PROVIDERS[name] || PROVIDERS.openai;
    return {
        url: customBaseUrl || p.baseUrl,
        model: p.defaultModel,
        auth: p.authHeader
    };
}
