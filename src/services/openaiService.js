class OpenAIService {
    /**
     * Configuración de la API de OpenAI
     */
    static API_BASE_URL = "https://api.openai.com/v1"
    static MODEL = "gpt-4o-mini" // Modelo más económico y eficiente para datos estructurados

    /**
     * Obtiene la API key desde variables de entorno
     * @returns {string} API Key de OpenAI
     */
    static getApiKey() {
        // En producción, esto debería venir de variables de entorno seguras
        return import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
    }

    /**
     * Genera el prompt optimizado para obtener ficha técnica
     * @param {string} marca - Marca del vehículo
     * @param {string} modelo - Modelo del vehículo
     * @param {string} version - Versión del vehículo
     * @param {string} ano - Año del vehículo
     * @returns {string} Prompt completo
     */
    static generateTechnicalPrompt(marca, modelo, version, ano) {
        return `Completa la ficha técnica para:
• Marca: ${marca}
• Modelo: ${modelo}
• Versión: ${version || "No especificada"}
• Año: ${ano}

PROMPT
Eres un agente técnico automotriz especializado en el mercado argentino. Tu tarea es completar una ficha técnica precisa para una marca, modelo, versión y año específicos.

Reglas duras:
• Cero inventos. Si no hay certeza, usa null.
• Año/versión estrictos. Si hay conflictos entre fuentes o hay cambios por restyling/facelift, prioriza el año exacto pedido; ante ambigüedad, null.
• Normalización y unidades:
  • potencia_hp: número en HP (DIN/SAE) entero. Si está en kW, convertir: hp = kW * 1.34102. Si está en CV/PS, convertir: hp = CV * 0.98632. Redondear al entero más cercano.
  • torque_nm: número en Nm entero.
  • largo, ancho, alto: mm (enteros).
  • velocidad_max: km/h (entero).
  • capacidad_baul: litros (entero).
  • capacidad_combustible: litros (entero).
  • rendimiento_mixto: km/l con 1 decimal; si solo hay L/100km, convertir: km/l = 100 / L_100km.
• Booleans: true | false | null.
• Campos string: español en minúsculas, sin adjetivos de marketing; listas separadas por ", " cuando corresponda.
• Valores esperados:
  • combustible: nafta | diésel | híbrido | eléctrico | gnc | flex | null
  • caja: ejemplos: manual 5, manual 6, automática cvt, automática 6, etc.
  • traccion: delantera | trasera | integral | 4x4 | null
  • segmento: usar categorías comunes del mercado AR (ej. hatch b, sedán c, suv c, pickup mediana, utilitarios, etc.).
  • url_ficha: si hay página oficial exacta de esa versión/año, incluir; sin certeza, null.
• Si el término de la versión es ambiguo y existieron subvariantes ese año, valida contra equipamiento/características; si no hay match inequívoco, usa null en lo dudoso.

IMPORTANTE: Devuelve ÚNICAMENTE el JSON válido, sin texto adicional, sin markdown, sin explicaciones.

{
"motorizacion": "...|null",
"combustible": "...|null",
"caja": "...|null",
"traccion": "...|null",
"puertas": number|null,
"segmento_modelo": "...|null",
"cilindrada": "...|null",
"potencia_hp": number|null,
"torque_nm": number|null,
"airbags": "...|null",
"abs": boolean|null,
"control_estabilidad": boolean|null,
"climatizador": boolean|null,
"multimedia": "...|null",
"frenos": "...|null",
"neumaticos": "...|null",
"llantas": "...|null",
"asistencia_manejo": "...|null",
"rendimiento_mixto": number|null,
"capacidad_baul": number|null,
"capacidad_combustible": number|null,
"velocidad_max": number|null,
"largo": number|null,
"ancho": number|null,
"alto": number|null,
"url_ficha": "...|null",
"informacion_rag": "...|null"
}`
    }

    /**
     * Realiza una consulta a la API de OpenAI
     * @param {string} prompt - Prompt para enviar
     * @returns {Promise<Object>} Respuesta de la API
     */
    static async queryOpenAI(prompt) {
        const apiKey = this.getApiKey()

        if (!apiKey) {
            throw new Error("API Key de OpenAI no configurada. Configura VITE_OPENAI_API_KEY en las variables de entorno.")
        }

        try {
            console.log("🤖 Consultando OpenAI para ficha técnica...")

            const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "Eres un experto en fichas técnicas automotrices del mercado argentino. Respondes únicamente con JSON válido, sin texto adicional."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.1, // Baja temperatura para respuestas más precisas
                    max_tokens: 1000,
                    response_format: { type: "json_object" } // Forzar respuesta JSON
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))

                if (response.status === 401) {
                    throw new Error("API Key de OpenAI inválida o expirada")
                } else if (response.status === 429) {
                    throw new Error("Límite de rate exceeded. Intenta nuevamente en unos minutos.")
                } else if (response.status === 500) {
                    throw new Error("Error interno del servidor de OpenAI")
                } else {
                    throw new Error(`Error de OpenAI: ${response.status} - ${errorData.error?.message || "Error desconocido"}`)
                }
            }

            const data = await response.json()

            if (!data.choices || !data.choices[0]) {
                throw new Error("Respuesta inválida de OpenAI")
            }

            const content = data.choices[0].message.content
            console.log("✅ Respuesta recibida de OpenAI")

            // Parsear la respuesta JSON
            try {
                const technicalData = JSON.parse(content)
                return {
                    success: true,
                    data: technicalData,
                    usage: data.usage,
                    model: data.model
                }
            } catch (parseError) {
                console.warn("⚠️ Error parseando JSON de OpenAI:", parseError.message)
                console.log("📝 Contenido recibido:", content)

                // Intentar extraer JSON de la respuesta
                const jsonMatch = content.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    try {
                        const extractedData = JSON.parse(jsonMatch[0])
                        return {
                            success: true,
                            data: extractedData,
                            usage: data.usage,
                            model: data.model,
                            warning: "JSON extraído de respuesta con formato irregular"
                        }
                    } catch (secondParseError) {
                        throw new Error("No se pudo parsear el JSON de la respuesta de OpenAI")
                    }
                } else {
                    throw new Error("No se encontró JSON válido en la respuesta de OpenAI")
                }
            }
        } catch (error) {
            console.error("❌ Error consultando OpenAI:", error)

            if (error.name === "TypeError" && error.message.includes("fetch")) {
                throw new Error("Error de conexión con OpenAI. Verifica tu conexión a internet.")
            }

            throw error
        }
    }

    /**
     * Obtiene ficha técnica completa para un vehículo
     * @param {Object} vehicleData - Datos del vehículo
     * @param {string} vehicleData.marca - Marca del vehículo
     * @param {string} vehicleData.modelo - Modelo del vehículo
     * @param {string} vehicleData.version - Versión del vehículo
     * @param {string} vehicleData.ano - Año del vehículo
     * @returns {Promise<Object>} Ficha técnica completa
     */
    static async getTechnicalSheet(vehicleData) {
        try {
            // Extraer datos del vehículo
            let marca, modelo, version, ano

            if (vehicleData.excelVehicle?.json) {
                // Formato de datos enriquecidos
                const data = vehicleData.excelVehicle.json
                marca = data.marca
                modelo = data.modelo
                version = data.version
                ano = data.año
            } else {
                // Formato directo
                marca = vehicleData.marca
                modelo = vehicleData.modelo
                version = vehicleData.version
                ano = vehicleData.año || vehicleData.ano
            }

            if (!marca || !modelo || !ano) {
                throw new Error("Faltan datos básicos del vehículo (marca, modelo, año)")
            }

            console.log(`🤖 Consultando OpenAI para: ${marca} ${modelo} ${version || ""} ${ano}`)
            console.log(`   📝 Generando prompt técnico...`)

            const prompt = this.generateTechnicalPrompt(marca, modelo, version, ano)

            console.log(`   🌐 Enviando solicitud a OpenAI API...`)
            const startTime = Date.now()

            const result = await this.queryOpenAI(prompt)

            const duration = (Date.now() - startTime) / 1000

            if (result.success) {
                console.log(`   ✅ Respuesta recibida en ${duration.toFixed(1)}s`)
                console.log(`   📊 Datos técnicos obtenidos: ${Object.keys(result.data || {}).length} campos`)
                console.log(`   💰 Tokens usados: ${result.usage?.total_tokens || "N/A"}`)

                return {
                    success: true,
                    data: result.data,
                    technicalData: result.data,
                    source: "openai",
                    model: result.model,
                    usage: result.usage,
                    duration: duration,
                    vehicleQuery: { marca, modelo, version, ano }
                }
            } else {
                console.error(`   ❌ Error en respuesta de OpenAI: ${result.error}`)
                throw new Error("No se pudo obtener la ficha técnica")
            }
        } catch (error) {
            console.error(`❌ Error obteniendo ficha técnica para ${vehicleData.marca || "N/A"} ${vehicleData.modelo || "N/A"}:`, error.message)
            return {
                success: false,
                error: error.message,
                source: "openai",
                vehicleQuery: vehicleData
            }
        }
    }

    /**
     * Procesa múltiples vehículos en lotes para evitar rate limiting
     * @param {Array} vehicles - Array de vehículos para procesar
     * @param {Object} options - Opciones de procesamiento
     * @param {number} options.batchSize - Tamaño del lote (default: 5)
     * @param {number} options.delayBetweenBatches - Delay entre lotes en ms (default: 1000)
     * @param {Function} options.onProgress - Callback de progreso
     * @returns {Promise<Array>} Resultados del procesamiento
     */
    static async processVehiclesBatch(vehicles, options = {}) {
        const { batchSize = 5, delayBetweenBatches = 1000, onProgress = () => {} } = options

        console.log("🤖 ========== INICIANDO PROCESAMIENTO CHATGPT/OpenAI ==========")
        console.log(`🚀 Total vehículos para procesar: ${vehicles.length}`)
        console.log(`📦 Configuración: lotes de ${batchSize}, delay ${delayBetweenBatches}ms`)
        console.log(`⏱️ Tiempo estimado: ~${Math.ceil((vehicles.length / batchSize) * (delayBetweenBatches / 1000))} segundos`)

        const results = []
        const totalBatches = Math.ceil(vehicles.length / batchSize)
        const startTime = Date.now()

        for (let i = 0; i < vehicles.length; i += batchSize) {
            const batch = vehicles.slice(i, i + batchSize)
            const batchNumber = Math.floor(i / batchSize) + 1
            const batchStartTime = Date.now()

            console.log(`\n📦 ========== LOTE ${batchNumber}/${totalBatches} ==========`)
            console.log(`🔄 Procesando ${batch.length} vehículos...`)

            // Mostrar vehículos del lote
            batch.forEach((vehicle, idx) => {
                const data = vehicle?.excelVehicle?.json || vehicle
                console.log(`   ${i + idx + 1}. ${data.marca || "N/A"} ${data.modelo || "N/A"} ${data.año || "N/A"}`)
            })

            // Procesar lote en paralelo
            const batchPromises = batch.map((vehicle, idx) => {
                const vehicleIndex = i + idx + 1
                console.log(`🤖 Enviando consulta ${vehicleIndex}/${vehicles.length} a OpenAI...`)
                return this.getTechnicalSheet(vehicle)
            })

            const batchResults = await Promise.allSettled(batchPromises)

            // Procesar resultados del lote y extraer detalles
            let batchSuccessCount = 0
            let batchErrorCount = 0
            let totalTokensUsed = 0
            const vehicleDetails = []

            const processedResults = batchResults.map((result, index) => {
                const vehicleIndex = i + index + 1
                const vehicle = batch[index]
                const vehicleData = vehicle?.excelVehicle?.json || vehicle
                const vehicleName = `${vehicleData.marca || "N/A"} ${vehicleData.modelo || "N/A"} ${vehicleData.año || "N/A"}`

                if (result.status === "fulfilled" && result.value.success) {
                    batchSuccessCount++
                    const fieldsCount = Object.keys(result.value.data || {}).length
                    const tokensUsed = result.value.usage?.total_tokens || 0
                    totalTokensUsed += tokensUsed
                    
                    console.log(`✅ Vehículo ${vehicleIndex}: ${vehicleName} - EXITOSO`)
                    console.log(`   📋 Datos obtenidos: ${fieldsCount} campos`)
                    console.log(`   💰 Tokens usados: ${tokensUsed}`)

                    vehicleDetails.push({
                        index: vehicleIndex,
                        name: vehicleName,
                        status: 'success',
                        fieldsObtained: fieldsCount,
                        tokensUsed: tokensUsed,
                        duration: result.value.duration || 0,
                        data: result.value.data
                    })

                    return result.value
                } else {
                    batchErrorCount++
                    const errorMsg = result.status === "fulfilled" ? result.value.error : result.reason.message
                    
                    console.log(`❌ Vehículo ${vehicleIndex}: ${vehicleName} - ERROR: ${errorMsg}`)
                    
                    vehicleDetails.push({
                        index: vehicleIndex,
                        name: vehicleName,
                        status: 'error',
                        fieldsObtained: 0,
                        tokensUsed: 0,
                        duration: 0,
                        error: errorMsg
                    })

                    return {
                        success: false,
                        error: errorMsg,
                        vehicleQuery: vehicle
                    }
                }
            })

            results.push(...processedResults)

            const batchEndTime = Date.now()
            const batchDuration = (batchEndTime - batchStartTime) / 1000

            console.log(`\n📊 RESULTADO LOTE ${batchNumber}:`)
            console.log(`   ✅ Exitosos: ${batchSuccessCount}/${batch.length}`)
            console.log(`   ❌ Errores: ${batchErrorCount}/${batch.length}`)
            console.log(`   ⏱️ Tiempo: ${batchDuration.toFixed(1)}s`)
            console.log(`   📈 Progreso total: ${results.length}/${vehicles.length} (${((results.length / vehicles.length) * 100).toFixed(1)}%)`)

            // Callback de progreso con información detallada
            onProgress({
                completed: results.length,
                total: vehicles.length,
                batchNumber,
                totalBatches,
                currentBatch: processedResults,
                vehicleDetails: vehicleDetails, // Nuevo: detalles de cada vehículo procesado
                batchStats: {
                    successful: batchSuccessCount,
                    failed: batchErrorCount,
                    duration: batchDuration,
                    totalTokensUsed: totalTokensUsed // Nuevo: tokens usados en el lote
                }
            })

            // Delay entre lotes para respetar rate limits
            if (batchNumber < totalBatches) {
                console.log(`⏳ Esperando ${delayBetweenBatches}ms antes del siguiente lote...`)
                await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches))
            }
        }

        const endTime = Date.now()
        const totalDuration = (endTime - startTime) / 1000
        const successCount = results.filter((r) => r.success).length
        const errorCount = results.length - successCount
        const successRate = ((successCount / vehicles.length) * 100).toFixed(1)

        console.log(`\n🎉 ========== PROCESAMIENTO COMPLETADO ==========`)
        console.log(`📊 ESTADÍSTICAS FINALES:`)
        console.log(`   📈 Total procesados: ${vehicles.length}`)
        console.log(`   ✅ Exitosos: ${successCount} (${successRate}%)`)
        console.log(`   ❌ Errores: ${errorCount} (${((errorCount / vehicles.length) * 100).toFixed(1)}%)`)
        console.log(`   ⏱️ Tiempo total: ${totalDuration.toFixed(1)}s`)
        console.log(`   🚀 Velocidad promedio: ${(vehicles.length / totalDuration).toFixed(1)} vehículos/segundo`)
        console.log(`🤖 ========== FIN PROCESAMIENTO CHATGPT/OpenAI ==========\n`)

        return {
            success: true,
            results,
            summary: {
                total: vehicles.length,
                successful: successCount,
                failed: errorCount,
                successRate: successRate + "%",
                totalDuration: totalDuration,
                averageSpeed: (vehicles.length / totalDuration).toFixed(1)
            }
        }
    }

    /**
     * Valida si los datos técnicos son válidos
     * @param {Object} technicalData - Datos técnicos a validar
     * @returns {Object} Resultado de validación
     */
    static validateTechnicalData(technicalData) {
        const requiredFields = ["motorizacion", "combustible", "caja", "traccion", "puertas", "segmento_modelo", "cilindrada", "potencia_hp", "torque_nm"]

        const missingFields = requiredFields.filter((field) => technicalData[field] === undefined)

        const hasValidData = Object.values(technicalData).some((value) => value !== null && value !== undefined && value !== "")

        return {
            isValid: missingFields.length === 0 && hasValidData,
            missingFields,
            hasValidData,
            fieldCount: Object.keys(technicalData).length,
            nonNullCount: Object.values(technicalData).filter((v) => v !== null && v !== undefined && v !== "").length
        }
    }
}

export default OpenAIService
