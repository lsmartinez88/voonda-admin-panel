import OpenAIService from "./openaiService"

class ApiEnrichmentService {
    static async enrichComplete(matchingResults, onProgress = null) {
        console.log(`� Iniciando enriquecimiento completo de ${matchingResults.length} vehículos...`)

        try {
            const enrichedResults = []
            let processedCount = 0

            for (const result of matchingResults) {
                try {
                    const excelData = result.excelVehicle?.json || {}
                    const apiData = result.bestMatch?.catalogVehicle || {}

                    // Mapeo simple como especificaste:
                    // Excel dominio -> patente
                    // API mileage -> kilometros
                    // API year -> vehiculo_ano/modelo_ano
                    // Excel valor -> valor
                    // Excel moneda -> moneda
                    // Excel Version -> version
                    // Resto en blanco

                    const enrichedData = {
                        // Campos principales del Excel preservados
                        patente: excelData.dominio || excelData.patente || "",
                        kilometros: apiData.mileage || excelData.kilometros || "",
                        vehiculo_ano: apiData.year || excelData.año || "",
                        modelo_ano: apiData.year || excelData.año || "",
                        valor: excelData.valor || "",
                        moneda: excelData.moneda || "",
                        version: excelData.versión || excelData.version || "",

                        // Resto de campos como estaban en el Excel
                        marca: excelData.marca || "",
                        modelo: excelData.modelo || "",
                        color: excelData.color || "",
                        // URLs construidas desde el ID del catálogo si está disponible
                        publicacion_web: apiData.id ? `https://www.fratelliautomotores.com.ar/catalogo/${apiData.id}` : excelData.publicacion_web || "",
                        publicacion_api_call: apiData.id ? `https://api.fratelliautomotores.com.ar/api/cars/${apiData.id}` : excelData.publicacion_api_call || "",

                        // Solo marcar como exitoso si realmente hay match con catálogo
                        enrichmentSuccess: !!apiData.id,
                        enrichmentTimestamp: new Date().toISOString()
                    }

                    enrichedResults.push({
                        ...result,
                        enrichedData
                    })
                } catch (error) {
                    console.error(`❌ Error enriqueciendo vehículo:`, error)
                    const excelData = result.excelVehicle?.json || {}

                    enrichedResults.push({
                        ...result,
                        enrichedData: {
                            patente: excelData.dominio || excelData.patente || "",
                            kilometros: excelData.kilometros || "",
                            vehiculo_ano: excelData.año || "",
                            modelo_ano: excelData.año || "",
                            valor: excelData.valor || "",
                            moneda: excelData.moneda || "",
                            version: excelData.versión || excelData.version || "",
                            marca: excelData.marca || "",
                            modelo: excelData.modelo || "",
                            color: excelData.color || "",
                            publicacion_web: excelData.publicacion_web || "",
                            publicacion_api_call: excelData.publicacion_api_call || "",
                            enrichmentSuccess: false,
                            enrichmentError: error.message,
                            enrichmentTimestamp: new Date().toISOString()
                        }
                    })
                }

                processedCount++
                if (onProgress && typeof onProgress === "function") {
                    onProgress({
                        processed: processedCount,
                        total: matchingResults.length,
                        current: result
                    })
                }
            }

            const stats = this.calculateEnrichmentStats(enrichedResults)

            console.log(`✅ Enriquecimiento completo finalizado:`)
            console.log(`   - Total procesados: ${enrichedResults.length}`)
            console.log(`   - Enriquecidos exitosamente: ${stats.successful}`)

            return {
                success: true,
                data: enrichedResults,
                stats: stats
            }
        } catch (error) {
            console.error("❌ Error crítico en enriquecimiento completo:", error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    static async enrichWithOpenAI(enrichedResults, config, onProgress = null) {
        try {
            if (!config?.apiKey) {
                console.warn("⚠️ No se proporcionó API key de OpenAI")
                return {
                    success: false,
                    error: "API Key de OpenAI requerida",
                    data: enrichedResults
                }
            }

            console.log("🤖 Iniciando enriquecimiento con OpenAI...")

            OpenAIService.initialize(config.apiKey)

            const vehiclesToProcess = enrichedResults.filter((result) => result.enrichedData && result.enrichedData.enrichmentSuccess)

            console.log(`🤖 Vehículos para OpenAI: ${vehiclesToProcess.length}`)

            if (vehiclesToProcess.length === 0) {
                return {
                    success: true,
                    data: enrichedResults,
                    stats: {
                        processed: 0,
                        openaiEnriched: 0,
                        errors: 0
                    }
                }
            }

            const batchSize = config.batchSize || 5
            const processedResults = []
            let totalProcessed = 0

            for (let i = 0; i < vehiclesToProcess.length; i += batchSize) {
                const batch = vehiclesToProcess.slice(i, i + batchSize)

                console.log(`🔄 Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(vehiclesToProcess.length / batchSize)}`)

                try {
                    const batchResult = await OpenAIService.processVehiclesBatch(batch)

                    if (batchResult.success) {
                        processedResults.push(...batchResult.results)
                        totalProcessed += batch.length
                        console.log(`✅ Lote procesado: ${batch.length} vehículos`)
                    } else {
                        console.error("❌ Error en lote:", batchResult.error)
                        batch.forEach((vehicle) => {
                            processedResults.push({
                                ...vehicle,
                                openaiData: {
                                    success: false,
                                    error: batchResult.error,
                                    timestamp: new Date().toISOString()
                                }
                            })
                        })
                        totalProcessed += batch.length
                    }
                } catch (error) {
                    console.error("❌ Error procesando lote:", error)
                    batch.forEach((vehicle) => {
                        processedResults.push({
                            ...vehicle,
                            openaiData: {
                                success: false,
                                error: error.message,
                                timestamp: new Date().toISOString()
                            }
                        })
                    })
                    totalProcessed += batch.length
                }

                if (onProgress && typeof onProgress === "function") {
                    onProgress({
                        processed: totalProcessed,
                        total: vehiclesToProcess.length,
                        percentage: Math.round((totalProcessed / vehiclesToProcess.length) * 100)
                    })
                }

                if (i + batchSize < vehiclesToProcess.length) {
                    await this.delay(1000)
                }
            }

            const notProcessed = enrichedResults.filter((result) => !result.enrichedData || !result.enrichedData.enrichmentSuccess)

            notProcessed.forEach((vehicle) => {
                processedResults.push({
                    ...vehicle,
                    openaiData: {
                        success: false,
                        reason: "Vehículo no fue enriquecido previamente",
                        timestamp: new Date().toISOString()
                    }
                })
            })

            const stats = this.calculateOpenAIStats(processedResults)

            console.log("✅ Enriquecimiento OpenAI completado:")
            console.log(`📊 Total procesados: ${processedResults.length}`)
            console.log(`🤖 Enriquecidos con OpenAI: ${stats.openaiEnriched}`)

            return {
                success: true,
                data: processedResults,
                stats: stats
            }
        } catch (error) {
            console.error("❌ Error en proceso OpenAI:", error)
            return {
                success: false,
                error: error.message,
                data: enrichedResults
            }
        }
    }

    static calculateEnrichmentStats(enrichedResults) {
        const total = enrichedResults.length
        const successful = enrichedResults.filter((r) => r.enrichedData?.enrichmentSuccess === true).length
        const failed = enrichedResults.filter((r) => r.enrichedData?.enrichmentSuccess === false).length

        console.log("📊 Estadísticas de enriquecimiento:", {
            total,
            successful,
            failed,
            rate: total > 0 ? Math.round((successful / total) * 100) : 0
        })

        return {
            total,
            successful,
            failed,
            enrichmentRate: total > 0 ? Math.round((successful / total) * 100) : 0,
            // Aliases para compatibilidad
            enrichedSuccessfully: successful,
            enrichmentFailures: failed,
            enrichmentErrors: failed
        }
    }

    static calculateOpenAIStats(results) {
        const total = results.length
        const openaiEnriched = results.filter((r) => r.openaiData && r.openaiData.success).length
        const openaiErrors = results.filter((r) => r.openaiData && r.openaiData.success === false && r.openaiData.error).length

        return {
            total,
            openaiEnriched,
            openaiErrors,
            openaiRate: Math.round((openaiEnriched / total) * 100)
        }
    }

    static delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

export default ApiEnrichmentService
