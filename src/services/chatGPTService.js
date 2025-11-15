import OpenAI from "openai"

class ChatGPTService {
    static openai = null

    /**
     * Inicializa el cliente de OpenAI
     * @param {string} apiKey - API Key de OpenAI
     */
    static initialize(apiKey) {
        if (!apiKey) {
            throw new Error("API Key de OpenAI es requerida")
        }

        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
        })

        console.log("✅ ChatGPT Service inicializado correctamente")
    }

    /**
     * Procesa vehículos enriquecidos con análisis de ChatGPT
     * @param {Array} enrichedResults - Resultados enriquecidos del Stage 2
     * @param {Function} onProgress - Callback para reportar progreso (opcional)
     * @returns {Promise<Object>} Datos procesados con análisis de ChatGPT
     */
    static async processWithChatGPT(enrichedResults, onProgress = null) {
        try {
            if (!this.openai) {
                throw new Error("ChatGPT Service no está inicializado. Ejecuta initialize() primero.")
            }

            console.log("🤖 Iniciando análisis con ChatGPT...")

            const processedResults = []
            let processedCount = 0

            // Solo procesar vehículos que fueron enriquecidos exitosamente
            const vehiclesToProcess = enrichedResults.filter((result) => result.enrichedData && result.enrichedData.enrichmentSuccess)

            console.log(`📊 Vehículos para análisis ChatGPT: ${vehiclesToProcess.length}`)

            for (const result of vehiclesToProcess) {
                try {
                    console.log(`🤖 Analizando: ${result.excelVehicle.json.marca} ${result.excelVehicle.json.modelo}`)

                    // Análisis de precio
                    const priceAnalysis = await this.analyzePricing(result)

                    // Generación de descripción optimizada
                    const optimizedDescription = await this.generateOptimizedDescription(result)

                    // Recomendaciones de mejora
                    const recommendations = await this.generateRecommendations(result)

                    const processedResult = {
                        ...result,
                        chatGPTAnalysis: {
                            priceAnalysis,
                            optimizedDescription,
                            recommendations,
                            analysisSuccess: true,
                            analysisTimestamp: new Date().toISOString()
                        }
                    }

                    processedResults.push(processedResult)

                    // Delay para evitar rate limits de OpenAI
                    await this.delay(1000)
                } catch (error) {
                    console.error(`❌ Error en análisis ChatGPT:`, error)
                    processedResults.push({
                        ...result,
                        chatGPTAnalysis: {
                            analysisSuccess: false,
                            analysisError: error.message,
                            analysisTimestamp: new Date().toISOString()
                        }
                    })
                }

                processedCount++
                if (onProgress) {
                    onProgress({
                        processed: processedCount,
                        total: vehiclesToProcess.length,
                        percentage: Math.round((processedCount / vehiclesToProcess.length) * 100)
                    })
                }
            }

            // Agregar vehículos que no fueron procesados
            const notProcessed = enrichedResults.filter((result) => !result.enrichedData || !result.enrichedData.enrichmentSuccess)

            notProcessed.forEach((result) => {
                processedResults.push({
                    ...result,
                    chatGPTAnalysis: {
                        analysisSuccess: false,
                        analysisReason: "Vehículo no fue enriquecido exitosamente",
                        analysisTimestamp: new Date().toISOString()
                    }
                })
            })

            const stats = this.calculateChatGPTStats(processedResults)

            console.log("✅ Análisis ChatGPT completado:")
            console.log(`📊 Total procesados: ${processedResults.length}`)
            console.log(`✅ Analizados exitosamente: ${stats.analyzedSuccessfully}`)
            console.log(`❌ Fallos de análisis: ${stats.analysisFailures}`)

            return {
                success: true,
                data: processedResults,
                stats: stats
            }
        } catch (error) {
            console.error("❌ Error en proceso ChatGPT:", error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    /**
     * Analiza el precio del vehículo comparado con el mercado
     * @param {Object} result - Resultado enriquecido
     * @returns {Promise<Object>} Análisis de precio
     */
    static async analyzePricing(result) {
        const excelVehicle = result.excelVehicle.json
        const catalogVehicle = result.bestMatch.catalogVehicle
        const enrichedData = result.enrichedData

        const prompt = `
Analiza el precio de este vehículo comparado con el mercado argentino:

VEHÍCULO DEL EXCEL:
- Marca: ${excelVehicle.marca}
- Modelo: ${excelVehicle.modelo} 
- Año: ${excelVehicle.año}
- Kilómetros: ${excelVehicle.kilometros?.toLocaleString() || "No especificado"}
- Precio pedido: $${excelVehicle.valor?.toLocaleString() || "No especificado"} ${excelVehicle.moneda || "ARS"}

VEHÍCULO SIMILAR DEL CATÁLOGO:
- Marca: ${catalogVehicle.brand}
- Modelo: ${catalogVehicle.model}
- Año: ${catalogVehicle.year}
- Kilómetros: ${catalogVehicle.mileage?.toLocaleString() || "No especificado"}
- Precio referencia: $${catalogVehicle.price?.toLocaleString() || "No especificado"} ARS
- Descripción: ${enrichedData.description || "No disponible"}

Por favor proporciona un análisis de precio en formato JSON con:
{
  "conclusion": "COMPETITIVO|ALTO|BAJO",
  "diferenciaPorcentual": number,
  "recomendacion": "string con recomendación específica",
  "factores": ["factor1", "factor2", "factor3"],
  "precioSugerido": number
}
        `.trim()

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un experto en valuación de vehículos en el mercado argentino. Proporciona análisis precisos y recomendaciones útiles."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            })

            const analysis = JSON.parse(response.choices[0].message.content)
            return {
                ...analysis,
                confidence: result.bestMatch.confidence,
                similarityScore: result.bestMatch.score
            }
        } catch (error) {
            console.error("❌ Error en análisis de precio:", error)
            return {
                conclusion: "ERROR",
                recomendacion: "No se pudo analizar el precio",
                error: error.message
            }
        }
    }

    /**
     * Genera una descripción optimizada para la publicación
     * @param {Object} result - Resultado enriquecido
     * @returns {Promise<Object>} Descripción optimizada
     */
    static async generateOptimizedDescription(result) {
        const excelVehicle = result.excelVehicle.json
        const enrichedData = result.enrichedData

        const prompt = `
Genera una descripción optimizada para vender este vehículo:

DATOS DEL VEHÍCULO:
- Marca: ${excelVehicle.marca}
- Modelo: ${excelVehicle.modelo}
- Año: ${excelVehicle.año}
- Kilómetros: ${excelVehicle.kilometros?.toLocaleString() || "No especificado"}
- Precio: $${excelVehicle.valor?.toLocaleString() || "No especificado"} ${excelVehicle.moneda || "ARS"}
- Condición: ${excelVehicle.condicion || "No especificado"}

DATOS TÉCNICOS ADICIONALES:
- Color: ${enrichedData.color || "No especificado"}
- Transmisión: ${enrichedData.transmission || "No especificado"}
- Combustible: ${enrichedData.fuel || "No especificado"}
- Puertas: ${enrichedData.doors || "No especificado"}

Genera una descripción atractiva, profesional y persuasiva en español argentino que:
- Destaque las características más atractivas
- Use un tono profesional pero amigable
- Incluya llamadas a la acción
- Sea entre 150-300 palabras
- Use términos del mercado automotor argentino

Responde solo con el texto de la descripción, sin formato JSON.
        `.trim()

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un experto redactor de publicaciones automotrices en Argentina. Crea descripciones que vendan."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: 400,
                temperature: 0.8
            })

            return {
                originalDescription: enrichedData.description || "Sin descripción original",
                optimizedDescription: response.choices[0].message.content.trim(),
                wordCount: response.choices[0].message.content.trim().split(" ").length,
                generatedAt: new Date().toISOString()
            }
        } catch (error) {
            console.error("❌ Error generando descripción:", error)
            return {
                error: error.message,
                optimizedDescription: enrichedData.description || "Error al generar descripción"
            }
        }
    }

    /**
     * Genera recomendaciones para mejorar la publicación
     * @param {Object} result - Resultado enriquecido
     * @returns {Promise<Object>} Recomendaciones
     */
    static async generateRecommendations(result) {
        const excelVehicle = result.excelVehicle.json
        const enrichedData = result.enrichedData

        const prompt = `
Analiza esta publicación de vehículo y da recomendaciones de mejora:

DATOS ACTUALES:
- ${excelVehicle.marca} ${excelVehicle.modelo} ${excelVehicle.año}
- Kilómetros: ${excelVehicle.kilometros?.toLocaleString() || "No especificado"}
- Precio: $${excelVehicle.valor?.toLocaleString() || "No especificado"} ${excelVehicle.moneda || "ARS"}
- Condición: ${excelVehicle.condicion || "No especificado"}
- Imágenes disponibles: ${enrichedData.images?.length || 0}
- Descripción actual: ${enrichedData.description || "Sin descripción"}

Proporciona recomendaciones en formato JSON:
{
  "fotografias": {"necesita": boolean, "sugerencias": ["sugerencia1", "sugerencia2"]},
  "precio": {"ajusteRecomendado": "SUBIR|BAJAR|MANTENER", "justificacion": "string"},
  "descripcion": {"necesitaMejora": boolean, "puntosClave": ["punto1", "punto2"]},
  "documentacion": {"recomendaciones": ["recom1", "recom2"]},
  "prioridad": "ALTA|MEDIA|BAJA"
}
        `.trim()

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Eres un consultor experto en ventas de vehículos. Proporciona recomendaciones prácticas y accionables."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: 600,
                temperature: 0.6
            })

            return JSON.parse(response.choices[0].message.content)
        } catch (error) {
            console.error("❌ Error generando recomendaciones:", error)
            return {
                error: error.message,
                prioridad: "BAJA",
                recomendaciones: ["Error al generar recomendaciones"]
            }
        }
    }

    /**
     * Calcula estadísticas del proceso de análisis ChatGPT
     * @param {Array} processedResults - Resultados procesados
     * @returns {Object} Estadísticas
     */
    static calculateChatGPTStats(processedResults) {
        const total = processedResults.length
        const analyzedSuccessfully = processedResults.filter((r) => r.chatGPTAnalysis && r.chatGPTAnalysis.analysisSuccess).length
        const analysisFailures = processedResults.filter((r) => r.chatGPTAnalysis && r.chatGPTAnalysis.analysisSuccess === false && r.chatGPTAnalysis.analysisError).length
        const notProcessed = processedResults.filter((r) => r.chatGPTAnalysis && r.chatGPTAnalysis.analysisSuccess === false && r.chatGPTAnalysis.analysisReason).length

        return {
            total,
            analyzedSuccessfully,
            analysisFailures,
            notProcessed,
            analysisRate: Math.round((analyzedSuccessfully / total) * 100),
            successRate: analyzedSuccessfully > 0 ? Math.round((analyzedSuccessfully / (analyzedSuccessfully + analysisFailures)) * 100) : 0
        }
    }

    /**
     * Utility para agregar delay entre llamadas a OpenAI
     * @param {number} ms - Milisegundos de delay
     * @returns {Promise} Promise que se resuelve después del delay
     */
    static delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Formatea los resultados de ChatGPT para mostrar en UI
     * @param {Object} processedVehicle - Vehículo con análisis de ChatGPT
     * @returns {Object} Información formateada para UI
     */
    static formatChatGPTDataForUI(processedVehicle) {
        if (!processedVehicle.chatGPTAnalysis || !processedVehicle.chatGPTAnalysis.analysisSuccess) {
            return {
                hasAnalysis: false,
                reason: processedVehicle.chatGPTAnalysis?.analysisReason || processedVehicle.chatGPTAnalysis?.analysisError || "No disponible"
            }
        }

        const analysis = processedVehicle.chatGPTAnalysis

        return {
            hasAnalysis: true,
            priceAnalysis: {
                conclusion: analysis.priceAnalysis?.conclusion || "No disponible",
                recommendation: analysis.priceAnalysis?.recomendacion || "No disponible",
                suggestedPrice: analysis.priceAnalysis?.precioSugerido || null,
                factors: analysis.priceAnalysis?.factores || []
            },
            description: {
                original: analysis.optimizedDescription?.originalDescription || "No disponible",
                optimized: analysis.optimizedDescription?.optimizedDescription || "No disponible",
                wordCount: analysis.optimizedDescription?.wordCount || 0
            },
            recommendations: {
                photos: analysis.recommendations?.fotografias || {},
                pricing: analysis.recommendations?.precio || {},
                description: analysis.recommendations?.descripcion || {},
                documentation: analysis.recommendations?.documentacion || {},
                priority: analysis.recommendations?.prioridad || "BAJA"
            },
            timestamps: {
                analyzed: analysis.analysisTimestamp
            }
        }
    }
}

export default ChatGPTService
