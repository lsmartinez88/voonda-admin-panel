class GoogleSheetsService {
    /**
     * Extrae el ID de un link de Google Sheets
     * @param {string} sheetUrl - URL de Google Sheets
     * @returns {string|null} ID del documento o null si es inválido
     */
    static extractSheetId(sheetUrl) {
        // Patrones comunes de URLs de Google Sheets
        const patterns = [
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /^([a-zA-Z0-9-_]+)$/ // Solo ID
        ]

        for (const pattern of patterns) {
            const match = sheetUrl.match(pattern)
            if (match) {
                return match[1]
            }
        }

        return null
    }

    /**
     * Valida si un link/ID de Google Sheets es válido
     * @param {string} sheetUrl - URL o ID de Google Sheets
     * @returns {Object} Resultado de validación
     */
    static validateGoogleSheetUrl(sheetUrl) {
        if (!sheetUrl || typeof sheetUrl !== "string" || sheetUrl.trim() === "") {
            return {
                valid: false,
                error: "Por favor proporciona un link o ID de Google Sheets"
            }
        }

        const cleanUrl = sheetUrl.trim()
        const sheetId = this.extractSheetId(cleanUrl)

        if (!sheetId) {
            return {
                valid: false,
                error: "El link de Google Sheets no tiene un formato válido"
            }
        }

        return {
            valid: true,
            sheetId: sheetId,
            message: "Link válido de Google Sheets"
        }
    }

    /**
     * Crea una nueva hoja en un Google Sheets existente
     * @param {string} spreadsheetId - ID del documento de Google Sheets
     * @param {Array} vehicleData - Datos de vehículos formateados
     * @param {Object} summary - Resumen de datos
     * @returns {Object} Resultado de la operación
     */
    static async createNewSheet(spreadsheetId, vehicleData, summary) {
        try {
            // Simulación de la creación de hoja (requiere autenticación real con Google API)
            console.log("📊 Simulando creación de nueva hoja en Google Sheets...")

            const timestamp = new Date().toISOString().split("T")[0]
            const sheetName = `Voonda_Vehiculos_${timestamp}`

            // En una implementación real, aquí usarías:
            // - Google Sheets API v4
            // - OAuth2 para autenticación
            // - gapi.client.sheets.spreadsheets.batchUpdate() para crear la hoja
            // - gapi.client.sheets.spreadsheets.values.batchUpdate() para los datos

            // Por ahora, simularemos el éxito y generaremos CSV como fallback
            const csvContent = this.generateCSV(vehicleData)
            const filename = `${sheetName}.csv`

            // Descargar CSV como fallback
            this.downloadCSV(csvContent, filename)

            // Simular respuesta exitosa
            await new Promise((resolve) => setTimeout(resolve, 2000)) // Simular delay de API

            return {
                success: true,
                mode: "simulation", // En implementación real sería 'api'
                sheetName: sheetName,
                spreadsheetId: spreadsheetId,
                sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`,
                newSheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=new_sheet_id`,
                recordsAdded: vehicleData.length,
                fallbackFile: filename,
                message: "Datos preparados para Google Sheets. Se descargó CSV como respaldo."
            }
        } catch (error) {
            console.error("❌ Error creando nueva hoja:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Proceso completo de exportación a Google Sheets específico
     * @param {Array} enrichedData - Datos enriquecidos del Stage 2
     * @param {Object} originalStats - Estadísticas originales
     * @param {string} googleSheetsUrl - URL del Google Sheets de destino
     * @returns {Object} Resultado de la exportación
     */
    static async exportToSpecificGoogleSheet(enrichedData, originalStats, googleSheetsUrl) {
        try {
            console.log("🚀 Iniciando exportación a Google Sheets específico...")

            // Validar URL
            const validation = this.validateGoogleSheetUrl(googleSheetsUrl)
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error
                }
            }

            // Preparar datos
            const preparedData = this.prepareDataForGoogleSheets(enrichedData, originalStats)
            if (!preparedData.success) {
                return {
                    success: false,
                    error: preparedData.error
                }
            }

            // Crear nueva hoja en el documento especificado
            const result = await this.createNewSheet(validation.sheetId, preparedData.data.vehicleData, preparedData.data.summary)

            if (result.success) {
                return {
                    success: true,
                    mode: result.mode,
                    spreadsheetId: result.spreadsheetId,
                    sheetName: result.sheetName,
                    sheetUrl: result.newSheetUrl,
                    originalSheetUrl: result.sheetUrl,
                    recordCount: result.recordsAdded,
                    summary: preparedData.data.summary,
                    stats: preparedData.data.enrichmentStats,
                    fallbackFile: result.fallbackFile,
                    message: result.message
                }
            } else {
                return {
                    success: false,
                    error: result.error
                }
            }
        } catch (error) {
            console.error("❌ Error en exportación a Google Sheets específico:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Exporta los datos enriquecidos a Google Sheets
     * @param {Array} enrichedData - Datos enriquecidos del Stage 2
     * @param {Object} originalStats - Estadísticas del procesamiento original
     * @returns {Object} Datos formateados para Google Sheets
     */
    static prepareDataForGoogleSheets(enrichedData, originalStats) {
        try {
            console.log("📊 Preparando datos para exportar a Google Sheets...")

            const sheetsData = {
                metadata: this.generateMetadata(originalStats),
                vehicleData: this.formatVehicleData(enrichedData),
                summary: this.generateSummary(enrichedData),
                enrichmentStats: this.generateEnrichmentSummary(enrichedData)
            }

            console.log(`✅ Datos preparados: ${sheetsData.vehicleData.length} vehículos listos para export`)

            return {
                success: true,
                data: sheetsData,
                exportTimestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error("❌ Error preparando datos para Google Sheets:", error)
            return {
                success: false,
                error: error.message,
                data: null
            }
        }
    }

    /**
     * Genera metadatos del procesamiento
     * @param {Object} originalStats - Estadísticas originales
     * @returns {Object} Metadatos
     */
    static generateMetadata(originalStats) {
        return {
            processingDate: new Date().toLocaleString("es-AR"),
            originalRows: originalStats.totalRows,
            validRows: originalStats.withValidCondition,
            processedRows: originalStats.finalFiltered,
            processingVersion: "1.0",
            stages: ["Excel Processing", "Vehicle Matching", "API Enrichment"]
        }
    }

    /**
     * Formatea los datos de vehículos para Google Sheets
     * @param {Array} enrichedData - Datos enriquecidos
     * @returns {Array} Array de objetos formateados
     */
    static formatVehicleData(enrichedData) {
        return enrichedData.map((result, index) => {
            const excelVehicle = result.excelVehicle.json
            const bestMatch = result.bestMatch
            const enrichedInfo = result.enrichedData

            // Datos básicos del Excel
            const baseData = {
                // Información de identificación
                ID_Registro: index + 1,
                Fila_Original: result.excelVehicle.rowIndex,
                Fecha_Procesamiento: new Date().toLocaleDateString("es-AR"),

                // Datos del vehículo del Excel
                Excel_Dominio: excelVehicle.dominio || "",
                Excel_Marca: excelVehicle.marca || "",
                Excel_Modelo: excelVehicle.modelo || "",
                Excel_Año: excelVehicle.año || "",
                Excel_Kilometros: excelVehicle.kilometros || "",
                Excel_Precio: excelVehicle.valor || "",
                Excel_Moneda: excelVehicle.moneda || "",
                Excel_Condicion: excelVehicle.condicion || "",
                Excel_Estado: excelVehicle.estado || "",
                Excel_Publi_Web: excelVehicle.publicacion_web || "",
                Excel_API_Call: excelVehicle.publicacion_api_call || "",

                // Estado del matching
                Matching_Encontrado: bestMatch ? "SÍ" : "NO",
                Matching_Confianza: bestMatch?.confidence || "N/A",
                Matching_Score: bestMatch ? `${(bestMatch.score * 100).toFixed(1)}%` : "N/A"
            }

            // Si hay match, agregar datos del catálogo
            if (bestMatch) {
                const catalogVehicle = bestMatch.catalogVehicle
                Object.assign(baseData, {
                    Catalogo_ID: catalogVehicle.id || "",
                    Catalogo_Marca: catalogVehicle.brand || "",
                    Catalogo_Modelo: catalogVehicle.model || "",
                    Catalogo_Año: catalogVehicle.year || "",
                    Catalogo_Precio: catalogVehicle.price || "",
                    Catalogo_Kilometros: catalogVehicle.mileage || "",
                    Catalogo_Color: catalogVehicle.color || "",
                    Catalogo_Transmision: catalogVehicle.transmission || "",
                    Catalogo_Combustible: catalogVehicle.fuel || "",
                    Catalogo_Puertas: catalogVehicle.doors || "",
                    Catalogo_Descripcion: (catalogVehicle.description || "").substring(0, 500), // Límite para sheets
                    Catalogo_Posicion: catalogVehicle.position || "",
                    Catalogo_Activo: catalogVehicle.active ? "SÍ" : "NO",
                    Catalogo_Destacado: catalogVehicle.featured ? "SÍ" : "NO"
                })
            } else {
                // Rellenar con valores vacíos si no hay match
                const catalogFields = [
                    "Catalogo_ID",
                    "Catalogo_Marca",
                    "Catalogo_Modelo",
                    "Catalogo_Año",
                    "Catalogo_Precio",
                    "Catalogo_Kilometros",
                    "Catalogo_Color",
                    "Catalogo_Transmision",
                    "Catalogo_Combustible",
                    "Catalogo_Puertas",
                    "Catalogo_Descripcion",
                    "Catalogo_Posicion",
                    "Catalogo_Activo",
                    "Catalogo_Destacado"
                ]
                catalogFields.forEach((field) => {
                    baseData[field] = ""
                })
            }

            // Estado del enriquecimiento
            Object.assign(baseData, {
                Enriquecimiento_Exitoso: enrichedInfo?.enrichmentSuccess ? "SÍ" : "NO",
                Enriquecimiento_Metodo: enrichedInfo?.enrichmentMethod || "N/A",
                Enriquecimiento_Razon: enrichedInfo?.enrichmentReason || enrichedInfo?.enrichmentError || ""
            })

            // Si fue enriquecido, agregar datos adicionales
            if (enrichedInfo?.enrichmentSuccess) {
                Object.assign(baseData, {
                    Enriquecido_Imagenes_Count: (enrichedInfo.images || []).length,
                    Enriquecido_Categoria: enrichedInfo.category?.name || "",
                    Enriquecido_Fecha_Creacion: enrichedInfo.createdAt ? new Date(enrichedInfo.createdAt).toLocaleDateString("es-AR") : "",
                    Enriquecido_Fecha_Actualizacion: enrichedInfo.updatedAt ? new Date(enrichedInfo.updatedAt).toLocaleDateString("es-AR") : ""
                })
            } else {
                Object.assign(baseData, {
                    Enriquecido_Imagenes_Count: "",
                    Enriquecido_Categoria: "",
                    Enriquecido_Fecha_Creacion: "",
                    Enriquecido_Fecha_Actualizacion: ""
                })
            }

            // Análisis de diferencias de precio
            if (bestMatch && excelVehicle.valor && bestMatch.catalogVehicle.price) {
                const excelPrice = parseFloat(excelVehicle.valor) || 0
                const catalogPrice = parseFloat(bestMatch.catalogVehicle.price) || 0

                // Convertir a la misma moneda si es necesario
                let excelPriceARS = excelPrice
                if (excelVehicle.moneda === "dolares") {
                    excelPriceARS = excelPrice * 1000 // Cotización aproximada
                }

                const priceDiff = excelPriceARS - catalogPrice
                const priceDiffPercent = catalogPrice > 0 ? (priceDiff / catalogPrice) * 100 : 0

                Object.assign(baseData, {
                    Analisis_Precio_Excel_ARS: excelPriceARS.toFixed(0),
                    Analisis_Precio_Catalogo_ARS: catalogPrice.toFixed(0),
                    Analisis_Diferencia_ARS: priceDiff.toFixed(0),
                    Analisis_Diferencia_Porcentual: `${priceDiffPercent.toFixed(1)}%`,
                    Analisis_Conclusion: this.getPriceAnalysisConclusion(priceDiffPercent)
                })
            } else {
                Object.assign(baseData, {
                    Analisis_Precio_Excel_ARS: "",
                    Analisis_Precio_Catalogo_ARS: "",
                    Analisis_Diferencia_ARS: "",
                    Analisis_Diferencia_Porcentual: "",
                    Analisis_Conclusion: "No disponible"
                })
            }

            return baseData
        })
    }

    /**
     * Determina la conclusión del análisis de precio
     * @param {number} percentDiff - Diferencia porcentual
     * @returns {string} Conclusión
     */
    static getPriceAnalysisConclusion(percentDiff) {
        if (Math.abs(percentDiff) <= 5) return "PRECIO COMPETITIVO"
        if (percentDiff > 20) return "PRECIO ALTO"
        if (percentDiff > 5) return "PRECIO LIGERAMENTE ALTO"
        if (percentDiff < -20) return "PRECIO BAJO"
        if (percentDiff < -5) return "PRECIO LIGERAMENTE BAJO"
        return "PRECIO COMPETITIVO"
    }

    /**
     * Genera resumen estadístico
     * @param {Array} enrichedData - Datos enriquecidos
     * @returns {Object} Resumen
     */
    static generateSummary(enrichedData) {
        const total = enrichedData.length
        const withMatches = enrichedData.filter((r) => r.bestMatch).length
        const highConfidenceMatches = enrichedData.filter((r) => r.bestMatch?.confidence === "alto").length
        const enrichedSuccessfully = enrichedData.filter((r) => r.enrichedData?.enrichmentSuccess).length

        const priceAnalysis = enrichedData
            .filter((r) => r.bestMatch && r.excelVehicle.json.valor)
            .map((r) => {
                const excelPrice = parseFloat(r.excelVehicle.json.valor) || 0
                const catalogPrice = parseFloat(r.bestMatch.catalogVehicle.price) || 0
                let excelPriceARS = excelPrice
                if (r.excelVehicle.json.moneda === "dolares") {
                    excelPriceARS = excelPrice * 1000
                }
                return catalogPrice > 0 ? ((excelPriceARS - catalogPrice) / catalogPrice) * 100 : 0
            })

        const avgPriceDiff = priceAnalysis.length > 0 ? priceAnalysis.reduce((sum, diff) => sum + diff, 0) / priceAnalysis.length : 0

        return {
            Total_Vehiculos: total,
            Con_Matches: withMatches,
            Tasa_Matching: `${Math.round((withMatches / total) * 100)}%`,
            Matches_Alta_Confianza: highConfidenceMatches,
            Vehiculos_Enriquecidos: enrichedSuccessfully,
            Tasa_Enriquecimiento: `${Math.round((enrichedSuccessfully / total) * 100)}%`,
            Diferencia_Precio_Promedio: `${avgPriceDiff.toFixed(1)}%`,
            Fecha_Procesamiento: new Date().toLocaleString("es-AR")
        }
    }

    /**
     * Genera estadísticas de enriquecimiento
     * @param {Array} enrichedData - Datos enriquecidos
     * @returns {Object} Estadísticas de enriquecimiento
     */
    static generateEnrichmentSummary(enrichedData) {
        const byConfidence = {
            alto: enrichedData.filter((r) => r.bestMatch?.confidence === "alto").length,
            medio: enrichedData.filter((r) => r.bestMatch?.confidence === "medio").length,
            bajo: enrichedData.filter((r) => r.bestMatch?.confidence === "bajo").length,
            sin_match: enrichedData.filter((r) => !r.bestMatch).length
        }

        const byEnrichment = {
            enriquecidos: enrichedData.filter((r) => r.enrichedData?.enrichmentSuccess).length,
            no_enriquecidos: enrichedData.filter((r) => !r.enrichedData?.enrichmentSuccess).length,
            solo_catalogo: enrichedData.filter((r) => r.enrichedData?.enrichmentMethod === "catalog_only").length,
            catalogo_mas_api: enrichedData.filter((r) => r.enrichedData?.enrichmentMethod === "catalog + api_call").length
        }

        return {
            distribucion_confianza: byConfidence,
            distribucion_enriquecimiento: byEnrichment,
            timestamp: new Date().toISOString()
        }
    }

    /**
     * Genera CSV para descarga directa
     * @param {Array} vehicleData - Datos de vehículos formateados
     * @returns {string} Contenido CSV
     */
    static generateCSV(vehicleData) {
        if (!vehicleData.length) return ""

        // Headers del CSV
        const headers = Object.keys(vehicleData[0])

        // Convertir datos a CSV
        const csvContent = [
            headers.join(","), // Headers
            ...vehicleData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] || ""
                        // Escapar comillas y comas
                        return typeof value === "string" && (value.includes(",") || value.includes('"')) ? `"${value.replace(/"/g, '""')}"` : value
                    })
                    .join(",")
            )
        ].join("\n")

        return csvContent
    }

    /**
     * Descarga un archivo CSV
     * @param {string} csvContent - Contenido CSV
     * @param {string} filename - Nombre del archivo
     */
    static downloadCSV(csvContent, filename = "vehiculos_procesados.csv") {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute("href", url)
            link.setAttribute("download", filename)
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            console.log(`✅ Archivo CSV descargado: ${filename}`)
        } else {
            console.error("❌ Descarga de archivos no soportada en este navegador")
        }
    }

    /**
     * Genera estructura para Google Sheets API
     * @param {Array} vehicleData - Datos formateados
     * @returns {Object} Estructura para Google Sheets API
     */
    static formatForGoogleSheetsAPI(vehicleData) {
        if (!vehicleData.length) return { headers: [], rows: [] }

        const headers = Object.keys(vehicleData[0])
        const rows = vehicleData.map((row) => headers.map((header) => row[header] || ""))

        return {
            headers,
            rows,
            totalColumns: headers.length,
            totalRows: rows.length
        }
    }

    /**
     * Proceso completo de exportación
     * @param {Array} enrichedData - Datos enriquecidos del Stage 2
     * @param {Object} originalStats - Estadísticas originales
     * @param {Object} options - Opciones de exportación
     * @returns {Object} Resultado de la exportación
     */
    static async exportToGoogleSheets(enrichedData, originalStats, options = {}) {
        try {
            console.log("🚀 Iniciando exportación a Google Sheets...")

            // Preparar datos
            const preparedData = this.prepareDataForGoogleSheets(enrichedData, originalStats)

            if (!preparedData.success) {
                throw new Error(preparedData.error)
            }

            // Generar CSV
            const csvContent = this.generateCSV(preparedData.data.vehicleData)

            // Descargar CSV automáticamente
            const filename = options.filename || `vehiculos_procesados_${new Date().toISOString().split("T")[0]}.csv`
            this.downloadCSV(csvContent, filename)

            // Preparar estructura para Google Sheets API (para futuro uso)
            const sheetsStructure = this.formatForGoogleSheetsAPI(preparedData.data.vehicleData)

            console.log("✅ Exportación completada exitosamente")

            return {
                success: true,
                summary: preparedData.data.summary,
                stats: preparedData.data.enrichmentStats,
                csvGenerated: true,
                filename: filename,
                recordCount: preparedData.data.vehicleData.length,
                sheetsStructure: sheetsStructure
            }
        } catch (error) {
            console.error("❌ Error en exportación:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }
}

export default GoogleSheetsService
