import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".ryte");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG = {
    provider: "openai",
    apiKey: "",
    model: "gpt-4o-mini",
    baseUrl: "" // Optional for local providers like OpenClaw/Ollama
};

export function getConfig() {
    if (!fs.existsSync(CONFIG_FILE)) {
        return null;
    }
    try {
        const data = fs.readFileSync(CONFIG_FILE, "utf-8");
        return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch (e) {
        return null;
    }
}

export function setConfig(updates) {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const current = getConfig() || DEFAULT_CONFIG;
    const updated = { ...current, ...updates };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), { mode: 0o600 });
    return updated;
}

export function hasValidConfig() {
    const config = getConfig();
    return !!(config && config.apiKey);
}
