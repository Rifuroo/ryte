import { getConfig } from "./config.js";
import { getProviderConfig } from "./provider.js";

export async function generateAIResponse(messages, overrideConfig = null) {
    const config = overrideConfig || getConfig();

    if (!config || !config.apiKey) {
        throw new Error("API Key not found. Please run 'ryte config' or follow the setup flow.");
    }

    const providerName = config.provider || "openai";
    const pConfig = getProviderConfig(providerName, config.baseUrl);

    const apiUrl = pConfig.url;
    const apiKey = config.apiKey;
    const model = config.model || pConfig.model;

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.5,
                })
            });

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get("retry-after") || "15", 10);
                const waitSeconds = retryAfter + 1;

                for (let i = waitSeconds; i > 0; i--) {
                    process.stdout.write(`\r\x1b[33m⚠ Rate limit hit. Waiting ${i}s before retry (${attempt}/${MAX_RETRIES})...\x1b[0m`);
                    await new Promise(r => setTimeout(r, 1000));
                }
                process.stdout.write("\r" + " ".repeat(80) + "\r");
                continue;
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "API request failed");
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (e) {
            if (attempt === MAX_RETRIES) {
                throw e; // Let the caller handle the final failure
            }
        }
    }
}
