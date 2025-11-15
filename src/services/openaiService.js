class OpenAIService {
    /**
     * Configuración de la API de OpenAI
     */
    static API_BASE_URL = 'https://api.openai.com/v1'
    static MODEL = 'gpt-4o-mini' // Modelo más económico y eficiente para datos estructurados
    
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
• Versión: ${version || 'No especificada'}
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
            throw new Error('API Key de OpenAI no configurada. Configura VITE_OPENAI_API_KEY en las variables de entorno.')
        }

        try {
            console.log('🤖 Consultando OpenAI para ficha técnica...')

            const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'Eres un experto en fichas técnicas automotrices del mercado argentino. Respondes únicamente con JSON válido, sin texto adicional.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.1, // Baja temperatura para respuestas más precisas
                    max_tokens: 1000,
                    response_format: { type: 'json_object' } // Forzar respuesta JSON
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                
                if (response.status === 401) {
                    throw new Error('API Key de OpenAI inválida o expirada')
                } else if (response.status === 429) {
                    throw new Error('Límite de rate exceeded. Intenta nuevamente en unos minutos.')
                } else if (response.status === 500) {
                    throw new Error('Error interno del servidor de OpenAI')
                } else {
                    throw new Error(`Error de OpenAI: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`)
                }
            }

            const data = await response.json()
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Respuesta inválida de OpenAI')
            }

            const content = data.choices[0].message.content
            console.log('✅ Respuesta recibida de OpenAI')
            
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
                console.warn('⚠️ Error parseando JSON de OpenAI:', parseError.message)
                console.log('📝 Contenido recibido:', content)
                
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
                            warning: 'JSON extraído de respuesta con formato irregular'
                        }
                    } catch (secondParseError) {
                        throw new Error('No se pudo parsear el JSON de la respuesta de OpenAI')
                    }
                } else {
                    throw new Error('No se encontró JSON válido en la respuesta de OpenAI')
                }
            }

        } catch (error) {
            console.error('❌ Error consultando OpenAI:', error)
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión con OpenAI. Verifica tu conexión a internet.')
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
            const { marca, modelo, version, ano } = vehicleData
            
            if (!marca || !modelo || !ano) {
                throw new Error('Faltan datos básicos del vehículo (marca, modelo, año)')
            }

            console.log(`🚗 Obteniendo ficha técnica para: ${marca} ${modelo} ${version || ''} ${ano}`)

            const prompt = this.generateTechnicalPrompt(marca, modelo, version, ano)
            const result = await this.queryOpenAI(prompt)

            if (result.success) {
                return {
                    success: true,
                    technicalData: result.data,
                    source: 'openai',
                    model: result.model,
                    usage: result.usage,
                    vehicleQuery: { marca, modelo, version, ano }
                }
            } else {
                throw new Error('No se pudo obtener la ficha técnica')
            }

        } catch (error) {
            console.error('❌ Error obteniendo ficha técnica:', error)
            return {
                success: false,
                error: error.message,
                source: 'openai',
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
        const {
            batchSize = 5,
            delayBetweenBatches = 1000,
            onProgress = () => {}
        } = options

        console.log(`🚀 Procesando ${vehicles.length} vehículos en lotes de ${batchSize}`)

        const results = []
        const totalBatches = Math.ceil(vehicles.length / batchSize)

        for (let i = 0; i < vehicles.length; i += batchSize) {
            const batch = vehicles.slice(i, i + batchSize)
            const batchNumber = Math.floor(i / batchSize) + 1

            console.log(`📦 Procesando lote ${batchNumber}/${totalBatches} (${batch.length} vehículos)`)

            // Procesar lote en paralelo
            const batchPromises = batch.map(vehicle => this.getTechnicalSheet(vehicle))
            const batchResults = await Promise.allSettled(batchPromises)

            // Procesar resultados del lote
            const processedResults = batchResults.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value
                } else {
                    console.error(`❌ Error en vehículo ${i + index + 1}:`, result.reason)
                    return {
                        success: false,
                        error: result.reason.message,
                        vehicleQuery: batch[index]
                    }
                }
            })

            results.push(...processedResults)

            // Callback de progreso
            onProgress({
                completed: results.length,
                total: vehicles.length,
                batchNumber,
                totalBatches,
                currentBatch: processedResults
            })

            // Delay entre lotes para respetar rate limits
            if (batchNumber < totalBatches) {
                console.log(`⏳ Esperando ${delayBetweenBatches}ms antes del siguiente lote...`)
                await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
            }
        }

        const successCount = results.filter(r => r.success).length
        const errorCount = results.length - successCount

        console.log(`✅ Procesamiento completado: ${successCount} exitosos, ${errorCount} errores`)

        return {
            results,
            summary: {
                total: vehicles.length,
                successful: successCount,
                failed: errorCount,
                successRate: (successCount / vehicles.length * 100).toFixed(1) + '%'
            }
        }
    }

    /**
     * Valida si los datos técnicos son válidos
     * @param {Object} technicalData - Datos técnicos a validar
     * @returns {Object} Resultado de validación
     */
    static validateTechnicalData(technicalData) {
        const requiredFields = [
            'motorizacion', 'combustible', 'caja', 'traccion', 'puertas',
            'segmento_modelo', 'cilindrada', 'potencia_hp', 'torque_nm'
        ]

        const missingFields = requiredFields.filter(field => 
            technicalData[field] === undefined
        )

        const hasValidData = Object.values(technicalData).some(value => 
            value !== null && value !== undefined && value !== ''
        )

        return {
            isValid: missingFields.length === 0 && hasValidData,
            missingFields,
            hasValidData,
            fieldCount: Object.keys(technicalData).length,
            nonNullCount: Object.values(technicalData).filter(v => v !== null && v !== undefined && v !== '').length
        }
    }
}

export default OpenAIService