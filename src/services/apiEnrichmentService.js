import axios from "axios"

class ApiEnrichmentService {
    static API_BASE_URL = "https://api.fratelliautomotores.com.ar/api"

    /**
     * Enriquece los resultados del matching con datos detallados de la API
     * @param {Array} matchingResults - Resultados del proceso de matching
     * @param {Function} onProgress - Callback para reportar progreso (opcional)
     * @returns {Promise<Object>} Datos enriquecidos
     */
    static async enrichMatchingResults(matchingResults, onProgress = null) {
        try {
            console.log("🔄 Iniciando enriquecimiento con datos del catálogo...")

            const enrichedResults = []
            let processedCount = 0

            // Solo procesar vehículos con matches de alta o media confianza
            const vehiclesToEnrich = matchingResults.filter((result) => result.bestMatch && (result.bestMatch.confidence === "alto" || result.bestMatch.confidence === "medio"))

            console.log(`📊 Vehículos a enriquecer: ${vehiclesToEnrich.length}`)
            console.log(`📊 Vehículos con alta confianza: ${matchingResults.filter((r) => r.bestMatch && r.bestMatch.confidence === "alto").length}`)

            for (const result of vehiclesToEnrich) {
                try {
                    const catalogVehicle = result.bestMatch.catalogVehicle
                    console.log(`🔍 Enriqueciendo vehículo: ${catalogVehicle.brand} ${catalogVehicle.model}`)

                    // Usar solo los datos del catálogo (evitar llamadas adicionales que pueden fallar)
                    const enrichedData = this.extractDataFromCatalog(catalogVehicle)

                    const enrichedResult = {
                        ...result,
                        excelData: result.excelVehicle?.json || {},
                        matchData: result.bestMatch || {},
                        enrichedData: enrichedData,
                        enrichmentSuccess: true,
                        enrichmentMethod: "catalog_only",
                        enrichmentTimestamp: new Date().toISOString()
                    }

                    enrichedResults.push(enrichedResult)
                } catch (error) {
                    console.error(`❌ Error enriqueciendo vehículo:`, error)
                    // Agregar el resultado sin enriquecimiento en caso de error
                    enrichedResults.push({
                        ...result,
                        excelData: result.excelVehicle?.json || {},
                        matchData: result.bestMatch || {},
                        enrichedData: null,
                        enrichmentSuccess: false,
                        enrichmentError: error.message,
                        enrichmentTimestamp: new Date().toISOString()
                    })
                }

                processedCount++
                if (onProgress) {
                    onProgress({
                        processed: processedCount,
                        total: vehiclesToEnrich.length,
                        percentage: Math.round((processedCount / vehiclesToEnrich.length) * 100)
                    })
                }
            }

            // Agregar vehículos sin matches al resultado final (sin enriquecimiento)
            const vehiclesWithoutGoodMatches = matchingResults.filter((result) => !result.bestMatch || (result.bestMatch.confidence !== "alto" && result.bestMatch.confidence !== "medio"))

            vehiclesWithoutGoodMatches.forEach((result) => {
                enrichedResults.push({
                    ...result,
                    excelData: result.excelVehicle?.json || {},
                    matchData: {},
                    enrichedData: null,
                    enrichmentSuccess: false,
                    enrichmentReason: "No hay match de suficiente confianza",
                    enrichmentTimestamp: new Date().toISOString()
                })
            })

            const stats = this.calculateEnrichmentStats(enrichedResults)

            console.log("✅ Enriquecimiento completado:")
            console.log(`📊 Total procesados: ${enrichedResults.length}`)
            console.log(`✅ Enriquecidos exitosamente: ${stats.enrichedSuccessfully}`)
            console.log(`❌ Fallos de enriquecimiento: ${stats.enrichmentErrors}`)
            console.log(`⚠️ Sin enriquecer (baja confianza): ${stats.notEnriched}`)

            return {
                success: true,
                data: enrichedResults,
                stats: stats
            }
        } catch (error) {
            console.error("❌ Error en proceso de enriquecimiento:", error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    /**
     * Extrae y formatea datos del catálogo (más eficiente que llamadas API adicionales)
     * @param {Object} catalogVehicle - Vehículo del catálogo
     * @returns {Object} Datos formateados del catálogo
     */
    static extractDataFromCatalog(catalogVehicle) {
        return {
            // Información básica ya disponible en el catálogo
            id: catalogVehicle.id,
            brand: catalogVehicle.brand,
            model: catalogVehicle.model,
            year: catalogVehicle.year,
            price: catalogVehicle.price,
            color: catalogVehicle.color,
            description: catalogVehicle.description,
            mileage: catalogVehicle.mileage,
            transmission: catalogVehicle.transmission,
            fuel: catalogVehicle.fuel,
            doors: catalogVehicle.doors,
            position: catalogVehicle.position,

            // Estados y fechas
            active: catalogVehicle.active,
            featured: catalogVehicle.featured,
            favorite: catalogVehicle.favorite,
            lastFeaturedAt: catalogVehicle.lastFeaturedAt,
            lastFavoriteAt: catalogVehicle.lastFavoriteAt,
            createdAt: catalogVehicle.createdAt,
            updatedAt: catalogVehicle.updatedAt,

            // Datos anidados si están disponibles
            category: catalogVehicle.Category || null,
            images: catalogVehicle.Images || [],
            categoryId: catalogVehicle.categoryId,

            // Metadatos del enriquecimiento
            dataSource: "catalog",
            hasCompleteData: this.hasCompleteBasicData(catalogVehicle)
        }
    }

    /**
     * Determina si necesitamos hacer una llamada adicional a la API
     * @param {Object} catalogVehicle - Vehículo del catálogo
     * @returns {boolean} True si necesita más detalles
     */
    static needsAdditionalDetails(catalogVehicle) {
        // Solo hacer llamada adicional si faltan datos importantes
        const hasImages = catalogVehicle.Images && catalogVehicle.Images.length > 0
        const hasDescription = catalogVehicle.description && catalogVehicle.description.length > 50
        const hasCompleteSpecs = catalogVehicle.transmission && catalogVehicle.fuel && catalogVehicle.doors

        // No necesitamos llamada adicional si ya tenemos los datos básicos completos
        return !(hasImages && hasDescription && hasCompleteSpecs)
    }

    /**
     * Verifica si el vehículo tiene datos básicos completos
     * @param {Object} catalogVehicle - Vehículo del catálogo
     * @returns {boolean} True si tiene datos completos
     */
    static hasCompleteBasicData(catalogVehicle) {
        const requiredFields = ["brand", "model", "year", "price", "mileage"]
        return requiredFields.every((field) => catalogVehicle[field] !== null && catalogVehicle[field] !== undefined)
    }

    /**
     * Obtiene el catálogo completo de vehículos de la API
     * @returns {Promise<Array>} Array de vehículos del catálogo
     */
    static async getVehicleDetails(vehicleId) {
        try {
            console.log(`🔍 Obteniendo detalles del vehículo ${vehicleId}...`)

            const response = await axios.get(`${this.API_BASE_URL}/cars/${vehicleId}`, {
                timeout: 10000
            })

            if (response.data) {
                console.log(`✅ Detalles obtenidos para vehículo ${vehicleId}`)
                return {
                    ...response.data,
                    apiCallSuccess: true,
                    apiCallTimestamp: new Date().toISOString()
                }
            } else {
                throw new Error("Respuesta vacía de la API")
            }
        } catch (error) {
            console.error(`❌ Error obteniendo detalles del vehículo ${vehicleId}:`, error)
            return {
                apiCallSuccess: false,
                apiCallError: error.message,
                apiCallTimestamp: new Date().toISOString()
            }
        }
    }

    /**
     * Calcula estadísticas del proceso de enriquecimiento
     * @param {Array} enrichedResults - Resultados enriquecidos
     * @returns {Object} Estadísticas del enriquecimiento
     */
    static calculateEnrichmentStats(enrichedResults) {
        const total = enrichedResults.length
        const enrichedSuccessfully = enrichedResults.filter((r) => r.enrichmentSuccess === true).length
        const enrichmentErrors = enrichedResults.filter((r) => r.enrichmentSuccess === false && r.enrichmentError).length
        const notEnriched = enrichedResults.filter((r) => r.enrichmentSuccess === false && r.enrichmentReason).length

        return {
            totalProcessed: total,
            enrichedSuccessfully,
            enrichmentErrors,
            notEnriched,
            enrichmentRate: Math.round((enrichedSuccessfully / total) * 100),
            successRate: enrichedSuccessfully > 0 ? Math.round((enrichedSuccessfully / (enrichedSuccessfully + enrichmentErrors)) * 100) : 0
        }
    }

    /**
     * Utility para agregar delay entre llamadas a la API
     * @param {number} ms - Milisegundos de delay
     * @returns {Promise} Promise que se resuelve después del delay
     */
    static delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Extrae información clave de los datos enriquecidos para mostrar en UI
     * @param {Object} enrichedVehicle - Vehículo con datos enriquecidos
     * @returns {Object} Información formateada para UI
     */
    static formatEnrichedDataForUI(enrichedVehicle) {
        if (!enrichedVehicle.enrichmentSuccess || !enrichedVehicle.enrichedData) {
            return {
                hasEnrichedData: false,
                reason: enrichedVehicle.enrichmentReason || enrichedVehicle.enrichmentError || "No disponible"
            }
        }

        const data = enrichedVehicle.enrichedData

        return {
            hasEnrichedData: true,
            basicInfo: {
                description: data.description || "Descripción no disponible",
                features: data.features || [],
                specifications: data.specifications || {},
                condition: data.condition || "No especificado"
            },
            technicalSpecs: {
                engine: data.engine || "No especificado",
                transmission: data.transmission || "No especificado",
                fuelType: data.fuel || "No especificado",
                doors: data.doors || "No especificado",
                color: data.color || "No especificado"
            },
            images: {
                gallery: data.images || [],
                thumbnail: data.thumbnail || null,
                count: (data.images || []).length
            },
            pricing: {
                price: data.price || 0,
                currency: data.currency || "ARS",
                priceHistory: data.priceHistory || [],
                financing: data.financing || null
            },
            location: {
                dealer: data.dealer || "No especificado",
                location: data.location || "No especificado",
                contact: data.contact || {}
            },
            timestamps: {
                published: data.publishedDate || data.createdAt || null,
                updated: data.updatedDate || data.updatedAt || null,
                enriched: enrichedVehicle.enrichmentTimestamp
            }
        }
    }
}

export default ApiEnrichmentService
