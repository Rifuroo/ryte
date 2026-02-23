import dotenv from "dotenv";
dotenv.config();

export async function generateAIResponse(messages) {
    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openAiKey) {
        console.error("Error: Please set either GROQ_API_KEY (for free AI) or OPENAI_API_KEY in your environment variables.");
        process.exit(1);
    }

    const isGroq = !!groqKey;
    const apiKey = isGroq ? groqKey : openAiKey;

    // Groq API is 100% compatible with OpenAI's format! Just changing URL & Model.
    const apiUrl = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
    const model = isGroq
        ? "llama-3.3-70b-versatile"
        : "gpt-4o-mini";

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
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "API request failed");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (e) {
        console.error("AI Generation failed:", e.message);
        process.exit(1);
    }
}
