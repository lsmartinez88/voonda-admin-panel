import axios from "axios"

class VehicleMatchingService {
    static API_BASE_URL = "https://api.fratelliautomotores.com.ar/api"

    /**
     * Obtiene el catálogo completo de vehículos de la API
     * @returns {Promise<Array>} Array de vehículos del catálogo
     */
    static async getCatalog() {
        try {
            console.log("🔍 Obteniendo catálogo de vehículos...")
            console.log(`📡 URL: ${this.API_BASE_URL}/cars`)

            const response = await axios.get(`${this.API_BASE_URL}/cars`, {
                params: {
                    page: 1,
                    limit: 1000,
                    sort: "position:desc"
                },
                timeout: 10000 // 10 segundos timeout
            })

            console.log("📦 Respuesta recibida:", {
                status: response.status,
                headers: response.headers,
                dataKeys: Object.keys(response.data || {}),
                dataType: typeof response.data
            })

            // Intentar diferentes estructuras de respuesta
            if (response.data && response.data.cars) {
                console.log(`✅ Catálogo obtenido: ${response.data.cars.length} vehículos`)
                console.log("📋 Muestra del primer vehículo:", response.data.cars[0])
                console.log("🔑 Campos disponibles:", Object.keys(response.data.cars[0]))
                return response.data.cars
            } else if (response.data && response.data.vehiculos) {
                console.log(`✅ Catálogo obtenido: ${response.data.vehiculos.length} vehículos`)
                return response.data.vehiculos
            } else if (response.data && Array.isArray(response.data)) {
                console.log(`✅ Catálogo obtenido (array directo): ${response.data.length} vehículos`)
                return response.data
            } else if (response.data && response.data.data) {
                console.log(`✅ Catálogo obtenido (data): ${response.data.data.length} vehículos`)
                return response.data.data
            } else {
                console.log("⚠️ Estructura de respuesta inesperada:", response.data)
                console.log("🔄 Usando catálogo de prueba...")
                return this.getMockCatalog()
            }
        } catch (error) {
            console.error("❌ Error al obtener catálogo:", error.message)
            console.log("🔄 Usando catálogo de prueba para continuar...")
            return this.getMockCatalog()
        }
    }

    /**
     * Catálogo de prueba para testing cuando la API no está disponible
     * @returns {Array} Array de vehículos de prueba
     */
    static getMockCatalog() {
        console.log("🧪 Generando catálogo de prueba...")
        return [
            { brand: "Toyota", model: "Corolla", year: 2020, mileage: 45000, price: 15000000 },
            { brand: "Toyota", model: "Camry", year: 2019, mileage: 60000, price: 18000000 },
            { brand: "Toyota", model: "RAV4", year: 2021, mileage: 30000, price: 25000000 },
            { brand: "Honda", model: "Civic", year: 2020, mileage: 40000, price: 16000000 },
            { brand: "Honda", model: "Accord", year: 2019, mileage: 55000, price: 19000000 },
            { brand: "Honda", model: "CR-V", year: 2021, mileage: 25000, price: 24000000 },
            { brand: "Ford", model: "Focus", year: 2018, mileage: 70000, price: 12000000 },
            { brand: "Ford", model: "Fiesta", year: 2019, mileage: 50000, price: 10000000 },
            { brand: "Ford", model: "EcoSport", year: 2020, mileage: 35000, price: 14000000 },
            { brand: "Chevrolet", model: "Cruze", year: 2019, mileage: 55000, price: 13000000 },
            { brand: "Chevrolet", model: "Onix", year: 2020, mileage: 40000, price: 11000000 },
            { brand: "Chevrolet", model: "Tracker", year: 2021, mileage: 20000, price: 22000000 },
            { brand: "Volkswagen", model: "Golf", year: 2018, mileage: 65000, price: 14000000 },
            { brand: "Volkswagen", model: "Polo", year: 2019, mileage: 45000, price: 12000000 },
            { brand: "Volkswagen", model: "Tiguan", year: 2020, mileage: 30000, price: 26000000 },
            { brand: "Nissan", model: "Sentra", year: 2019, mileage: 50000, price: 13500000 },
            { brand: "Nissan", model: "Kicks", year: 2020, mileage: 35000, price: 17000000 },
            { brand: "Hyundai", model: "Elantra", year: 2020, mileage: 40000, price: 15500000 },
            { brand: "Hyundai", model: "Tucson", year: 2021, mileage: 25000, price: 23000000 },
            { brand: "Fiat", model: "Cronos", year: 2019, mileage: 45000, price: 9500000 }
        ]
    }

    /**
     * Obtiene información detallada de un vehículo específico por ID
     * @param {string} vehicleId - ID del vehículo
     * @returns {Promise<Object>} Información detallada del vehículo
     */
    static async getVehicleDetails(vehicleId) {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/cars/${vehicleId}`)
            return response.data
        } catch (error) {
            console.error(`❌ Error al obtener detalles del vehículo ${vehicleId}:`, error)
            return null
        }
    }

    /**
     * Normaliza texto para comparación
     * @param {string} text - Texto a normalizar
     * @returns {string} Texto normalizado
     */
    static normalizeText(text) {
        if (!text) return ""
        return text
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, " ")
    }

    /**
     * Calcula similitud entre dos strings usando distancia de Levenshtein simplificada
     * @param {string} a - Primer string
     * @param {string} b - Segundo string
     * @returns {number} Porcentaje de similitud (0-1)
     */
    static calculateSimilarity(a, b) {
        const normA = this.normalizeText(a)
        const normB = this.normalizeText(b)

        if (normA === normB) return 1
        if (!normA || !normB) return 0

        // Similaridad básica por inclusión
        if (normA.includes(normB) || normB.includes(normA)) {
            return 0.8
        }

        // Comparar palabras individuales
        const wordsA = normA.split(" ")
        const wordsB = normB.split(" ")
        let matches = 0

        wordsA.forEach((wordA) => {
            if (wordsB.some((wordB) => wordA === wordB || wordA.includes(wordB) || wordB.includes(wordA))) {
                matches++
            }
        })

        return matches / Math.max(wordsA.length, wordsB.length)
    }

    /**
     * Calcula similitud exacta para patentes/dominios
     * @param {string} a - Dominio/patente del Excel
     * @param {string} b - Patente del catálogo
     * @returns {number} Score de similitud (0-1)
     */
    static calculateExactMatch(a, b) {
        const normA = this.normalizeText(a)
            .replace(/[\s\-\.]/g, "")
            .toUpperCase()
        const normB = this.normalizeText(b)
            .replace(/[\s\-\.]/g, "")
            .toUpperCase()

        if (!normA || !normB) return 0
        if (normA === normB) return 1

        // Para patentes, también considerar coincidencias parciales
        if (normA.length >= 3 && normB.length >= 3) {
            if (normA.includes(normB) || normB.includes(normA)) {
                return 0.8
            }

            // Verificar similitud de caracteres (para casos como ABC123 vs ABC-123)
            const similarity = this.calculateCharacterSimilarity(normA, normB)
            return similarity > 0.8 ? similarity : 0
        }

        return 0
    }

    /**
     * Calcula similitud de caracteres para patentes
     * @param {string} a - Primera cadena
     * @param {string} b - Segunda cadena
     * @returns {number} Score de similitud (0-1)
     */
    static calculateCharacterSimilarity(a, b) {
        const maxLength = Math.max(a.length, b.length)
        if (maxLength === 0) return 1

        let matches = 0
        const minLength = Math.min(a.length, b.length)

        for (let i = 0; i < minLength; i++) {
            if (a[i] === b[i]) {
                matches++
            }
        }

        return matches / maxLength
    }

    /**
     * Calcula similitud específica para años
     * @param {number} year1 - Año del Excel
     * @param {number} year2 - Año del catálogo
     * @returns {number} Score de similitud (0-1)
     */
    static calculateYearSimilarity(year1, year2) {
        const yearDiff = Math.abs(year1 - year2)

        if (yearDiff === 0) return 1.0 // Año exacto - OBLIGATORIO
        if (yearDiff === 1) return 0.3 // 1 año de diferencia - muy penalizado

        return 0 // Más de 1 año de diferencia - no match
    }

    /**
     * Calcula similitud específica para kilómetros
     * @param {number} km1 - Kilómetros del Excel
     * @param {number} km2 - Kilómetros del catálogo
     * @returns {number} Score de similitud (0-1)
     */
    static calculateMileageSimilarity(km1, km2) {
        if (!km1 || !km2) return 0

        const kmDiff = Math.abs(km1 - km2)
        const maxKm = Math.max(km1, km2)
        const kmDiffPercent = kmDiff / maxKm

        if (kmDiff === 0) return 1.0 // Kilómetros exactos - 100%
        if (kmDiffPercent <= 0.02) return 0.9 // 2% diferencia - muy bueno pero no perfecto
        if (kmDiffPercent <= 0.05) return 0.8 // 5% diferencia
        if (kmDiffPercent <= 0.1) return 0.5 // 10% diferencia
        if (kmDiffPercent <= 0.15) return 0.3 // 15% diferencia

        return 0 // Más del 15% de diferencia - no match
    }

    /**
     * Calcula similitud específica para precios
     * @param {number} price1 - Precio del Excel
     * @param {number} price2 - Precio del catálogo (en pesos)
     * @param {string} currency1 - Moneda del Excel ('pesos' | 'dolares')
     * @returns {number} Score de similitud (0-1)
     */
    static calculatePriceSimilarity(price1, price2, currency1 = "pesos") {
        if (!price1 || !price2) return 0

        // Convertir precio del Excel a pesos si está en dólares
        // Usar cotización aproximada (esto se podría mejorar con API de cotización)
        const USD_TO_ARS_RATE = 1000 // Cotización aproximada
        const excelPriceInPesos = currency1 === "dolares" ? price1 * USD_TO_ARS_RATE : price1

        const priceDiff = Math.abs(excelPriceInPesos - price2)
        const maxPrice = Math.max(excelPriceInPesos, price2)
        const priceDiffPercent = priceDiff / maxPrice

        // MENOS RESTRICTIVO - permitir más diferencia de precios
        if (priceDiff === 0) return 1.0 // Precio exacto - 100%
        if (priceDiffPercent <= 0.1) return 1.0 // Hasta 10% diferencia - considerado exacto para precios
        if (priceDiffPercent <= 0.2) return 0.9 // 20% diferencia - excelente
        if (priceDiffPercent <= 0.3) return 0.8 // 30% diferencia - muy bueno
        if (priceDiffPercent <= 0.4) return 0.7 // 40% diferencia - bueno
        if (priceDiffPercent <= 0.5) return 0.6 // 50% diferencia - aceptable
        if (priceDiffPercent <= 0.5) return 0.4 // 50% diferencia - regular
        if (priceDiffPercent <= 0.7) return 0.3 // 70% diferencia - bajo pero válido
        if (priceDiffPercent <= 0.8) return 0.2 // 80% diferencia - muy bajo

        return 0 // Más del 80% de diferencia en precio - no match
    }

    /**
     * Busca matches de un vehículo del Excel en el catálogo de la API
     * @param {Object} excelVehicle - Vehículo del Excel normalizado
     * @param {Array} catalog - Catálogo de vehículos de la API
     * @returns {Array} Array de posibles matches ordenados por score
     */
    static findMatches(excelVehicle, catalog) {
        const matches = []

        catalog.forEach((catalogVehicle) => {
            let score = 0
            let matchDetails = {
                dominio: 0,
                marca: 0,
                modelo: 0,
                año: 0,
                kilometros: 0,
                precio: 0,
                color: 0,
                version: 0
            }

            // FILTROS AHORA SON PONDERABLES, NO EXCLUYENTES
            // Cambio: permitir que vehículos con marcas/modelos similares pero no exactos puedan matchear

            // 1. Verificar marca (PONDERABLE - contribuye al score pero no excluye)
            let marcaScore = 0
            if (excelVehicle.marca && catalogVehicle.brand) {
                marcaScore = this.calculateSimilarity(excelVehicle.marca, catalogVehicle.brand)
                matchDetails.marca = marcaScore
                // ELIMINADO: No descartar por marca, solo ponderar
                // if (marcaScore < 0.7) { return }
            } else if (!excelVehicle.marca || !catalogVehicle.brand) {
                // Si falta la marca, penalizar pero no descartar
                marcaScore = 0
            }

            // 2. Verificar modelo (PONDERABLE - contribuye al score pero no excluye)
            let modeloScore = 0
            if (excelVehicle.modelo && catalogVehicle.model) {
                modeloScore = this.calculateSimilarity(excelVehicle.modelo, catalogVehicle.model)
                matchDetails.modelo = modeloScore
                // ELIMINADO: No descartar por modelo, solo ponderar
                // if (modeloScore < 0.6) { return }
            } else if (!excelVehicle.modelo || !catalogVehicle.model) {
                // Si falta el modelo, penalizar pero no descartar
                modeloScore = 0
            }

            // Si llegamos aquí, marca y modelo pasaron los filtros obligatorios
            // Ahora calculamos el score total

            // 0. Comparar dominio/patente (máxima prioridad - 40% si coincide exacto)
            if (excelVehicle.dominio && catalogVehicle.license_plate) {
                const dominioScore = this.calculateExactMatch(excelVehicle.dominio, catalogVehicle.license_plate)
                matchDetails.dominio = dominioScore
                if (dominioScore > 0.9) {
                    // Si el dominio coincide casi exactamente, es un match muy fuerte
                    score += dominioScore * 0.4
                } else if (dominioScore > 0.7) {
                    // Match parcial de dominio
                    score += dominioScore * 0.2
                }
            }

            // 1. Agregar score de marca (15% del peso total) - YA CALCULADO
            score += marcaScore * 0.15

            // 2. Agregar score de modelo (20% del peso total) - YA CALCULADO
            score += modeloScore * 0.2

            // 3. Comparar año (25% del peso total) - MENOS ESTRICTO
            if (excelVehicle.año && catalogVehicle.year) {
                const yearScore = this.calculateYearSimilarity(excelVehicle.año, catalogVehicle.year)
                matchDetails.año = yearScore
                // CAMBIO: Permitir diferencias de año pero con penalización
                // Solo descartar si la diferencia es muy grande (más de 2 años)
                const yearDiff = Math.abs(excelVehicle.año - catalogVehicle.year)
                if (yearDiff > 2) {
                    // Si la diferencia es mayor a 2 años, descartar
                    return
                }
                score += yearScore * 0.25
            } else {
                // Si falta el año, no descartar pero penalizar fuertemente
                matchDetails.año = 0
            }

            // 4. Comparar kilómetros (20% del peso total) - MENOS RESTRICTIVO
            if (excelVehicle.kilometros && catalogVehicle.mileage) {
                const kmScore = this.calculateMileageSimilarity(excelVehicle.kilometros, catalogVehicle.mileage)
                matchDetails.kilometros = kmScore
                // CAMBIO: Permitir diferencias mayores en kilómetros
                // Solo descartar si la diferencia es extrema (más del 50%)
                const kmDiff = Math.abs(excelVehicle.kilometros - catalogVehicle.mileage)
                const maxKm = Math.max(excelVehicle.kilometros, catalogVehicle.mileage)
                const kmDiffPercent = kmDiff / maxKm
                if (kmDiffPercent > 0.5) {
                    // Si los kilómetros difieren más del 50%, descartar
                    return
                }
                score += kmScore * 0.2
            } else {
                // Si faltan los kilómetros, no descartar pero penalizar
                matchDetails.kilometros = 0
            }

            // 5. Comparar precio (15% del peso total) - MUY PERMISIVO
            if (excelVehicle.valor && catalogVehicle.price) {
                const priceScore = this.calculatePriceSimilarity(excelVehicle.valor, catalogVehicle.price, excelVehicle.moneda)
                matchDetails.precio = priceScore
                // REACTIVADO: Filtro de precio muy permisivo - solo descartar diferencias extremas
                const USD_TO_ARS_RATE = 1000
                const excelPriceInPesos = excelVehicle.moneda === "dolares" ? excelVehicle.valor * USD_TO_ARS_RATE : excelVehicle.valor
                const priceDiff = Math.abs(excelPriceInPesos - catalogVehicle.price)
                const maxPrice = Math.max(excelPriceInPesos, catalogVehicle.price)
                const priceDiffPercent = priceDiff / maxPrice

                // Solo descartar si la diferencia es mayor al 200% (3x el precio)
                if (priceDiffPercent > 2.0) {
                    return
                }
                score += priceScore * 0.15
            }
            // Si falta el precio, no descartar - puede continuar

            // 6. Comparar color (3% del peso total) - OPCIONAL
            if (excelVehicle.color && catalogVehicle.color) {
                const colorScore = this.calculateSimilarity(excelVehicle.color, catalogVehicle.color)
                matchDetails.color = colorScore
                score += colorScore * 0.03
            }

            // 7. Comparar versión (2% del peso total) - OPCIONAL
            if (excelVehicle.versión && catalogVehicle.version) {
                const versionScore = this.calculateSimilarity(excelVehicle.versión, catalogVehicle.version)
                matchDetails.version = versionScore
                score += versionScore * 0.02
            }

            // FILTRO DE CALIDAD: Requerir al menos 2 valores con 100% de coincidencia
            // Esto previene matches espurios como CHEVROLET CRUZE → Nissan Kicks
            const perfectMatches = []

            // Verificar qué campos tienen coincidencia exacta (100%)
            if (matchDetails.dominio >= 1.0) perfectMatches.push("dominio")
            if (matchDetails.marca >= 1.0) perfectMatches.push("marca")
            if (matchDetails.modelo >= 1.0) perfectMatches.push("modelo")
            if (matchDetails.año >= 1.0) perfectMatches.push("año")
            if (matchDetails.kilometros >= 1.0) perfectMatches.push("kilometros")
            if (matchDetails.precio >= 1.0) perfectMatches.push("precio")
            if (matchDetails.color >= 1.0) perfectMatches.push("color")
            if (matchDetails.version >= 1.0) perfectMatches.push("version")

            // Si no hay al menos 2 valores con 100% de coincidencia, penalizar severamente
            if (perfectMatches.length < 2) {
                console.log(`⚠️ Match rechazado - Solo ${perfectMatches.length} coincidencia(s) exacta(s): [${perfectMatches.join(", ")}]`)
                console.log(`   Excel: ${excelVehicle.marca} ${excelVehicle.modelo} (${excelVehicle.año})`)
                console.log(`   Catálogo: ${catalogVehicle.brand} ${catalogVehicle.model} (${catalogVehicle.year})`)

                // Reducir score a casi cero para que aparezca como muy bajo
                score = 0.05
            }

            // Solo incluir matches con score mínimo del 30% (reducido para ser más inclusivo)
            if (score >= 0.3) {
                matches.push({
                    catalogVehicle,
                    score,
                    matchDetails,
                    confidence: this.getConfidenceLevel(score)
                })
            }
        })

        // Ordenar por score descendente
        return matches.sort((a, b) => b.score - a.score)
    }

    /**
     * Determina el nivel de confianza del match
     * @param {number} score - Score del match
     * @returns {string} Nivel de confianza
     */
    static getConfidenceLevel(score) {
        if (score >= 0.65) return "alto" // Reducido: buen match con algunos campos coincidentes
        if (score >= 0.45) return "medio" // Match aceptable con marca/modelo similares
        if (score >= 0.3) return "bajo" // Match posible con algunos elementos coincidentes
        return "muy_bajo"
    }

    /**
     * Procesa todos los vehículos del Excel y busca matches en el catálogo
     * @param {Array} excelVehicles - Vehículos filtrados del Excel
     * @param {Function} onProgress - Callback para reportar progreso (opcional)
     * @returns {Promise<Object>} Resultado del matching
     */
    static async processMatching(excelVehicles, onProgress = null) {
        try {
            console.log("🔄 Iniciando proceso de matching...")

            // 1. Obtener catálogo
            const catalog = await this.getCatalog()
            if (!catalog || catalog.length === 0) {
                console.warn("⚠️ Catálogo vacío, usando datos de prueba")
                // En lugar de fallar, continuamos con catálogo de prueba
            }

            console.log(`📚 Catálogo disponible: ${catalog.length} vehículos`)
            console.log(`🚗 Vehículos a procesar: ${excelVehicles.length}`)

            // 2. Procesar cada vehículo del Excel
            const results = []
            let processedCount = 0

            for (const excelVehicle of excelVehicles) {
                const matches = this.findMatches(excelVehicle.json, catalog)

                results.push({
                    excelVehicle,
                    matches,
                    bestMatch: matches.length > 0 ? matches[0] : null,
                    hasHighConfidenceMatch: matches.some((m) => m.confidence === "alto"),
                    hasApiUrl: !!excelVehicle.json.publicacion_api_call
                })

                processedCount++
                if (onProgress) {
                    onProgress({
                        processed: processedCount,
                        total: excelVehicles.length,
                        percentage: Math.round((processedCount / excelVehicles.length) * 100)
                    })
                }
            }

            // 3. Generar estadísticas
            const stats = this.generateMatchingStats(results)

            console.log("✅ Matching completado:", stats)

            return {
                success: true,
                results,
                stats,
                catalog
            }
        } catch (error) {
            console.error("❌ Error en proceso de matching:", error)
            return {
                success: false,
                error: error.message,
                results: [],
                stats: null
            }
        }
    }

    /**
     * Genera estadísticas del proceso de matching
     * @param {Array} results - Resultados del matching
     * @returns {Object} Estadísticas
     */
    static generateMatchingStats(results) {
        const total = results.length
        const withMatches = results.filter((r) => r.matches.length > 0).length
        const highConfidence = results.filter((r) => r.hasHighConfidenceMatch).length
        const withApiUrl = results.filter((r) => r.hasApiUrl).length

        const confidenceLevels = {
            alto: results.filter((r) => r.bestMatch?.confidence === "alto").length,
            medio: results.filter((r) => r.bestMatch?.confidence === "medio").length,
            bajo: results.filter((r) => r.bestMatch?.confidence === "bajo").length,
            sin_match: results.filter((r) => !r.bestMatch).length
        }

        return {
            total,
            withMatches,
            highConfidence,
            withApiUrl,
            matchRate: total > 0 ? Math.round((withMatches / total) * 100) : 0,
            highConfidenceRate: total > 0 ? Math.round((highConfidence / total) * 100) : 0,
            confidenceLevels
        }
    }

    /**
     * Obtiene URLs de API para vehículos con matches de alta confianza
     * @param {Array} results - Resultados del matching
     * @returns {Array} URLs de API a consultar
     */
    static getApiUrlsForMatching(results) {
        const urls = []

        results.forEach((result) => {
            // Si ya tiene URL de publicacion_api_call, usarla
            if (result.excelVehicle.json.publicacion_api_call) {
                urls.push({
                    url: result.excelVehicle.json.publicacion_api_call,
                    source: "excel",
                    excelVehicle: result.excelVehicle
                })
            }
            // Si no tiene pero hay match de alta confianza, usar ID del catálogo
            else if (result.bestMatch && result.bestMatch.confidence === "alto") {
                urls.push({
                    url: `${this.API_BASE_URL}/cars/${result.bestMatch.catalogVehicle.id}`,
                    source: "matching",
                    excelVehicle: result.excelVehicle,
                    catalogVehicle: result.bestMatch.catalogVehicle
                })
            }
        })

        return urls
    }
}

export default VehicleMatchingService
