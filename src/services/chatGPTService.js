// Archivo deprecado - toda la funcionalidad se movió a openaiService.js
// Este archivo se mantiene por compatibilidad pero no se usa

class ChatGPTService {
    /**
     * @deprecated Usar OpenAIService en su lugar
     */
    static initialize() {
        console.warn("⚠️ ChatGPTService está deprecado. Usar OpenAIService en su lugar.")
    }

    /**
     * @deprecated Usar OpenAIService.enrichWithOpenAI() en su lugar
     */
    static async processWithChatGPT() {
        console.warn("⚠️ ChatGPTService.processWithChatGPT() está deprecado. Usar OpenAIService.enrichWithOpenAI() en su lugar.")
        return {
            success: false,
            error: "Método deprecado. Usar OpenAIService en su lugar."
        }
    }
}

export default ChatGPTService
