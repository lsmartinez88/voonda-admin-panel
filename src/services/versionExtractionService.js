/**
 * VersionExtractionService
 * Servicio para extraer versiones de vehículos usando OpenAI
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

class VersionExtractionService {
    /**
     * Extrae la versión y modelo limpio de un vehículo usando OpenAI
     * @param {Object} vehicle - Objeto del vehículo con brand, model, description
     * @param {string} apiKey - API Key de OpenAI
     * @returns {Promise<Object>} - Versión y modelo extraídos
     */
    static async extractVersionWithAI(vehicle, apiKey) {
        try {
            const prompt = `Eres un experto en identificación de vehículos. Analiza la siguiente información de un vehículo y extrae:
1. El MODELO exacto del vehículo (sin incluir la marca)
2. La VERSIÓN/TRIM del vehículo (ej: Titanium, SEL, Sport, etc.)

Información del vehículo:
- Marca: ${vehicle.brand || ""}
- Modelo: ${vehicle.model || ""}
- Descripción: ${vehicle.description || ""}

IMPORTANTE:
- Si no encuentras una versión clara, devuelve una cadena vacía
- El modelo no debe incluir la marca
- La versión debe ser solo el trim level o variante (ej: "TITANIUM", "SEL", "SPORT")
- Si la descripción solo tiene marca, modelo y año, la versión es vacía

Responde SOLO con un objeto JSON en este formato exacto:
{
  "modelo": "modelo sin marca",
  "version": "version o trim"
}`

            const response = await fetch(OPENAI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Eres un asistente experto en identificación de vehículos. Respondes SOLO con JSON válido, sin texto adicional."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 150
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
            }

            const data = await response.json()
            const content = data.choices[0].message.content.trim()

            // Parsear la respuesta JSON
            const parsed = JSON.parse(content)

            return {
                success: true,
                modelo: parsed.modelo || vehicle.model || "",
                version: parsed.version || "",
                tokensUsed: data.usage?.total_tokens || 0
            }
        } catch (error) {
            console.error(`❌ Error extrayendo versión con IA para ${vehicle.brand} ${vehicle.model}:`, error)
            return {
                success: false,
                error: error.message,
                modelo: vehicle.model || "",
                version: "",
                tokensUsed: 0
            }
        }
    }

    /**
     * Procesa múltiples vehículos en lotes para extraer versiones
     * @param {Array} vehicles - Array de vehículos
     * @param {string} apiKey - API Key de OpenAI
     * @param {Function} progressCallback - Callback para reportar progreso
     * @param {Object} options - Opciones de procesamiento
     * @returns {Promise<Object>} - Resultado del procesamiento
     */
    static async processVersionExtraction(vehicles, apiKey, progressCallback = null, options = {}) {
        console.log("🔧 processVersionExtraction llamado con:", {
            vehiclesCount: vehicles?.length,
            hasApiKey: !!apiKey,
            hasCallback: !!progressCallback,
            options
        })

        const {
            batchSize = 3, // Procesar de a 3 para no saturar la API
            delayBetweenBatches = 2000 // 2 segundos entre lotes
        } = options

        try {
            console.log(`🤖 Iniciando extracción de versiones con IA para ${vehicles.length} vehículos`)

            const results = []
            let totalTokens = 0
            let successCount = 0
            let errorCount = 0

            // Procesar en lotes
            const totalBatches = Math.ceil(vehicles.length / batchSize)

            for (let i = 0; i < vehicles.length; i += batchSize) {
                const batch = vehicles.slice(i, i + batchSize)
                const batchNumber = Math.floor(i / batchSize) + 1

                console.log(`📦 Procesando lote ${batchNumber}/${totalBatches} (${batch.length} vehículos)`)

                // Reportar progreso
                if (progressCallback) {
                    progressCallback({
                        stage: "version_extraction",
                        total: vehicles.length,
                        processed: i,
                        completed: i,
                        batchNumber: batchNumber,
                        totalBatches: totalBatches,
                        currentBatch: batch.length
                    })
                }

                // Procesar lote en paralelo
                const batchPromises = batch.map((vehicle) => this.extractVersionWithAI(vehicle, apiKey))
                const batchResults = await Promise.all(batchPromises)

                // Combinar vehículo original con resultado
                batchResults.forEach((result, idx) => {
                    const vehicle = batch[idx]
                    results.push({
                        ...vehicle,
                        extractedModel: result.modelo,
                        extractedVersion: result.version,
                        versionExtractionSuccess: result.success,
                        versionExtractionError: result.error || null
                    })

                    if (result.success) {
                        successCount++
                        totalTokens += result.tokensUsed
                    } else {
                        errorCount++
                    }
                })

                // Delay entre lotes (excepto el último)
                if (i + batchSize < vehicles.length) {
                    await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches))
                }
            }

            // Reporte final
            if (progressCallback) {
                progressCallback({
                    stage: "version_extraction",
                    total: vehicles.length,
                    processed: vehicles.length,
                    completed: vehicles.length,
                    batchNumber: totalBatches,
                    totalBatches: totalBatches
                })
            }

            console.log(`✅ Extracción de versiones completada:`)
            console.log(`   - Exitosos: ${successCount}/${vehicles.length}`)
            console.log(`   - Errores: ${errorCount}`)
            console.log(`   - Tokens usados: ${totalTokens.toLocaleString()}`)

            return {
                success: true,
                data: results,
                stats: {
                    total: vehicles.length,
                    successful: successCount,
                    errors: errorCount,
                    tokensUsed: totalTokens,
                    withVersion: results.filter((v) => v.extractedVersion).length,
                    withoutVersion: results.filter((v) => !v.extractedVersion).length
                }
            }
        } catch (error) {
            console.error("❌ Error en procesamiento de versiones:", error)
            return {
                success: false,
                error: error.message,
                data: vehicles // Devolver vehículos sin modificar
            }
        }
    }
}

export default VersionExtractionService
