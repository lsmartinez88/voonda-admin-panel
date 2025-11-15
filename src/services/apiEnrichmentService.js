import OpenAIService from "./openaiService"

class ApiEnrichmentService {
    static async enrichComplete(matchingResults, onProgress = null) {
        try {
            console.log("🚀 Iniciando enriquecimiento completo desde el catálogo...")
            console.log("📋 Datos de matching recibidos:", {
                total: matchingResults?.length || 0,
                type: typeof matchingResults,
                isArray: Array.isArray(matchingResults)
            })

            // Log detallado de los resultados de matching
            if (matchingResults && matchingResults.length > 0) {
                console.log("🔍 Muestra de resultados de matching:")
                matchingResults.slice(0, 3).forEach((result, i) => {
                    console.log(`   Resultado ${i + 1}:`, {
                        bestMatch: result.bestMatch
                            ? {
                                  confidence: result.bestMatch.confidence,
                                  score: result.bestMatch.score,
                                  vehicleBrand: result.bestMatch.catalogVehicle?.brand,
                                  vehicleModel: result.bestMatch.catalogVehicle?.model
                              }
                            : null,
                        excelVehicle: result.excelVehicle?.json
                            ? {
                                  marca: result.excelVehicle.json.marca,
                                  modelo: result.excelVehicle.json.modelo
                              }
                            : null
                    })
                })

                // Log de niveles de confianza
                const confidenceLevels = {
                    alto: 0,
                    medio: 0,
                    bajo: 0,
                    sin_match: 0
                }

                matchingResults.forEach((result) => {
                    if (result.bestMatch) {
                        confidenceLevels[result.bestMatch.confidence] = (confidenceLevels[result.bestMatch.confidence] || 0) + 1
                    } else {
                        confidenceLevels.sin_match++
                    }
                })

                console.log("📊 Distribución de niveles de confianza:", confidenceLevels)
            }

            const vehiclesToEnrich = matchingResults.filter((result) => 
                result.bestMatch && (result.bestMatch.confidence === "alto" || result.bestMatch.confidence === "medio")
            )

            console.log(`📊 Vehículos a enriquecer: ${vehiclesToEnrich.length} de ${matchingResults.length} totales`)
            console.log(`   - Con confianza alta: ${matchingResults.filter(r => r.bestMatch?.confidence === "alto").length}`)
            console.log(`   - Con confianza media: ${matchingResults.filter(r => r.bestMatch?.confidence === "medio").length}`)

            if (vehiclesToEnrich.length === 0) {
                console.warn("⚠️ No hay vehículos con confianza 'alto' o 'medio' para enriquecer")
                console.log("💡 Procesando todos los vehículos aunque no tengan confianza alta/media...")

                // Procesar todos los vehículos aunque no tengan alta confianza
                const allResults = matchingResults.map((result) => {
                    const excelVehicleData = result.excelVehicle?.json || {}

                    return {
                        ...result,
                        enrichedData: {
                            // PRESERVAR TODOS los datos del Excel original
                            excelData: {
                                ...excelVehicleData,
                                dominio: excelVehicleData.dominio || excelVehicleData.patente,
                                marca: excelVehicleData.marca,
                                modelo: excelVehicleData.modelo,
                                año: excelVehicleData.año,
                                kilometros: excelVehicleData.kilometros,
                                valor: excelVehicleData.valor,
                                moneda: excelVehicleData.moneda,
                                versión: excelVehicleData.versión || excelVehicleData.version,
                                color: excelVehicleData.color,
                                publicacion_web: excelVehicleData.publicacion_web,
                                publicacion_api_call: excelVehicleData.publicacion_api_call
                            },
                            matchData: result.bestMatch || {},
                            enrichmentSuccess: false,
                            enrichmentReason: result.bestMatch ? `Confianza ${result.bestMatch.confidence}, se requiere 'alto' o 'medio'` : "Sin matches encontrados",
                            enrichmentTimestamp: new Date().toISOString()
                        }
                    }
                })

                const stats = this.calculateEnrichmentStats(allResults)

                return {
                    success: true,
                    data: allResults,
                    stats: stats,
                    warning: "No se encontraron vehículos con confianza alta para enriquecer"
                }
            }

            const enrichedResults = []
            let processedCount = 0

            for (const result of vehiclesToEnrich) {
                try {
                    const catalogVehicle = result.bestMatch.catalogVehicle
                    const excelVehicleData = result.excelVehicle?.json || {}

                    console.log(`🔍 Enriqueciendo vehículo: ${catalogVehicle.brand} ${catalogVehicle.model}`)
                    console.log(`📋 Datos Excel originales:`, {
                        dominio: excelVehicleData.dominio,
                        marca: excelVehicleData.marca,
                        modelo: excelVehicleData.modelo,
                        año: excelVehicleData.año,
                        kilometros: excelVehicleData.kilometros,
                        valor: excelVehicleData.valor,
                        moneda: excelVehicleData.moneda,
                        versión: excelVehicleData.versión
                    })

                    const enrichedData = {
                        // Datos del catálogo
                        id: catalogVehicle.id,
                        brand: catalogVehicle.brand,
                        model: catalogVehicle.model,
                        year: catalogVehicle.year,
                        // PRESERVAR TODOS los datos del Excel original
                        excelData: {
                            ...excelVehicleData,
                            // Asegurar que los campos clave estén presentes
                            dominio: excelVehicleData.dominio || excelVehicleData.patente,
                            marca: excelVehicleData.marca,
                            modelo: excelVehicleData.modelo,
                            año: excelVehicleData.año,
                            kilometros: excelVehicleData.kilometros,
                            valor: excelVehicleData.valor,
                            moneda: excelVehicleData.moneda,
                            versión: excelVehicleData.versión || excelVehicleData.version,
                            color: excelVehicleData.color,
                            publicacion_web: excelVehicleData.publicacion_web,
                            publicacion_api_call: excelVehicleData.publicacion_api_call
                        },
                        // Datos del matching
                        matchData: {
                            ...result.bestMatch,
                            catalogVehicle: catalogVehicle
                        },
                        enrichmentSuccess: true,
                        enrichmentTimestamp: new Date().toISOString()
                    }

                    console.log(`✅ Datos enriquecidos:`, {
                        excelDataKeys: Object.keys(enrichedData.excelData),
                        hasPatente: !!enrichedData.excelData.dominio,
                        hasKilometros: !!enrichedData.excelData.kilometros,
                        hasValor: !!enrichedData.excelData.valor,
                        hasMoneda: !!enrichedData.excelData.moneda
                    })

                    enrichedResults.push({
                        ...result,
                        enrichedData
                    })
                } catch (error) {
                    console.error(`❌ Error enriqueciendo vehículo:`, error)
                    enrichedResults.push({
                        ...result,
                        enrichedData: {
                            excelData: result.excelVehicle?.json || {},
                            matchData: result.bestMatch || {},
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
                        total: vehiclesToEnrich.length,
                        percentage: Math.round((processedCount / vehiclesToEnrich.length) * 100)
                    })
                }
            }

            const notEnriched = matchingResults.filter((result) => 
                !result.bestMatch || (result.bestMatch.confidence !== "alto" && result.bestMatch.confidence !== "medio")
            )

            notEnriched.forEach((result) => {
                const excelVehicleData = result.excelVehicle?.json || {}

                console.log(`⚠️ Vehículo sin alta confianza - preservando datos Excel:`, {
                    dominio: excelVehicleData.dominio,
                    marca: excelVehicleData.marca,
                    modelo: excelVehicleData.modelo
                })

                enrichedResults.push({
                    ...result,
                    enrichedData: {
                        // PRESERVAR TODOS los datos del Excel original
                        excelData: {
                            ...excelVehicleData,
                            dominio: excelVehicleData.dominio || excelVehicleData.patente,
                            marca: excelVehicleData.marca,
                            modelo: excelVehicleData.modelo,
                            año: excelVehicleData.año,
                            kilometros: excelVehicleData.kilometros,
                            valor: excelVehicleData.valor,
                            moneda: excelVehicleData.moneda,
                            versión: excelVehicleData.versión || excelVehicleData.version,
                            color: excelVehicleData.color,
                            publicacion_web: excelVehicleData.publicacion_web,
                            publicacion_api_call: excelVehicleData.publicacion_api_call
                        },
                        matchData: result.bestMatch || {},
                        enrichmentSuccess: false,
                        enrichmentReason: result.bestMatch ? 
                            `Confianza ${result.bestMatch.confidence}, se requiere 'alto' o 'medio'` : 
                            "Sin matches encontrados",
                        enrichmentTimestamp: new Date().toISOString()
                    }
                })
            })

            const stats = this.calculateEnrichmentStats(enrichedResults)

            console.log("✅ Enriquecimiento completo terminado:")
            console.log(`📊 Total procesados: ${enrichedResults.length}`)
            console.log(`✅ Enriquecidos exitosamente: ${stats.enrichedSuccessfully}`)

            return {
                success: true,
                data: enrichedResults,
                stats: stats
            }
        } catch (error) {
            console.error("❌ Error en proceso de enriquecimiento:", error)
            console.error("   - Mensaje:", error.message)
            console.error("   - Stack:", error.stack)
            console.error("   - Datos recibidos:", {
                matchingResultsType: typeof matchingResults,
                matchingResultsLength: matchingResults?.length,
                matchingResultsArray: Array.isArray(matchingResults)
            })

            return {
                success: false,
                error: error.message,
                data: [],
                details: {
                    errorType: error.constructor.name,
                    received: {
                        matchingResultsType: typeof matchingResults,
                        matchingResultsLength: matchingResults?.length
                    }
                }
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
        const enrichedSuccessfully = enrichedResults.filter((r) => r.enrichedData && r.enrichedData.enrichmentSuccess).length
        const enrichmentFailures = enrichedResults.filter((r) => r.enrichedData && r.enrichedData.enrichmentSuccess === false && r.enrichedData.enrichmentError).length

        return {
            total,
            enrichedSuccessfully,
            enrichmentFailures,
            enrichmentRate: Math.round((enrichedSuccessfully / total) * 100)
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
