import ExcelExportService from "./excelExportService.js"

class GoogleSheetsService {
    /**
     * Inicializa Google Sheets API
     * @returns {Promise<boolean>} True si se inicializó correctamente
     */
    static async initializeGoogleSheetsAPI() {
        try {
            // Verificar si ya está cargada
            if (window.gapi && window.gapi.client && window.gapi.client.sheets) {
                console.log("✅ Google Sheets API ya está disponible")
                return true
            }

            // Cargar Google API si no está disponible
            if (!window.gapi) {
                console.log("📡 Cargando Google API...")

                return new Promise((resolve) => {
                    const script = document.createElement("script")
                    script.src = "https://apis.google.com/js/api.js"
                    script.onload = () => {
                        console.log("✅ Google API script cargado")
                        resolve(false) // Requiere autenticación adicional
                    }
                    script.onerror = () => {
                        console.warn("⚠️ No se pudo cargar Google API")
                        resolve(false)
                    }
                    document.head.appendChild(script)
                })
            }

            return false
        } catch (error) {
            console.warn("⚠️ Error inicializando Google Sheets API:", error.message)
            return false
        }
    }

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
            console.log("📊 Preparando datos para Google Sheets...")

            const timestamp = new Date().toISOString().split("T")[0]
            const sheetName = `Voonda_Vehiculos_${timestamp}_${Date.now().toString().slice(-4)}`

            // Generar datos para copiar directamente
            const sheetsData = this.formatForGoogleSheetsAPI(vehicleData.vehicleData || vehicleData, vehicleData.headers)

            // Crear contenido para copiar al portapapeles
            const clipboardContent = this.generateClipboardContent(vehicleData.vehicleData || vehicleData)

            // URL de Google Sheets
            const baseSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

            // Intentar copiar al portapapeles
            try {
                await navigator.clipboard.writeText(clipboardContent)
                console.log("✅ Datos copiados al portapapeles")

                // Abrir Google Sheets
                const sheetsWindow = window.open(baseSheetUrl, "_blank")

                // Mostrar instrucciones para pegar
                setTimeout(() => {
                    this.showPasteInstructions(sheetName, spreadsheetId, vehicleData.length)
                }, 2000)

                return {
                    success: true,
                    mode: "clipboard_paste",
                    sheetName: sheetName,
                    spreadsheetId: spreadsheetId,
                    sheetUrl: baseSheetUrl,
                    newSheetUrl: baseSheetUrl,
                    recordsAdded: vehicleData.length,
                    message: `Datos copiados al portapapeles. Google Sheets abierto para pegar directamente.`
                }
            } catch (clipboardError) {
                console.warn("⚠️ No se pudo copiar al portapapeles, usando método alternativo")

                // Fallback: Crear textarea temporal para copiar manualmente
                const textArea = this.createCopyTextArea(clipboardContent)

                // Abrir Google Sheets
                window.open(baseSheetUrl, "_blank")

                // Mostrar instrucciones para copiar manualmente
                setTimeout(() => {
                    this.showManualCopyInstructions(sheetName, spreadsheetId, vehicleData.length, textArea)
                }, 1500)

                return {
                    success: true,
                    mode: "manual_copy",
                    sheetName: sheetName,
                    spreadsheetId: spreadsheetId,
                    sheetUrl: baseSheetUrl,
                    newSheetUrl: baseSheetUrl,
                    recordsAdded: vehicleData.length,
                    message: `Datos listos para copiar manualmente. Google Sheets abierto.`
                }
            }
        } catch (error) {
            console.error("❌ Error preparando datos:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Genera contenido formateado para copiar al portapapeles (separado por tabs)
     * @param {Array} vehicleData - Datos de vehículos
     * @returns {string} Contenido formateado con tabs
     */
    static generateClipboardContent(vehicleData) {
        if (!vehicleData.length) return ""

        // Si vehicleData ya viene del ExcelExportService, usar ese formato
        if (vehicleData[0] && typeof vehicleData[0] === "object" && !Array.isArray(vehicleData[0])) {
            // Es un array de objetos del ExcelExportService
            const headers = Object.keys(vehicleData[0])

            // Convertir objetos a formato tab-separated
            const rows = vehicleData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] || ""
                        // Limpiar valores para evitar problemas en Google Sheets
                        return String(value)
                            .replace(/[\t\n\r]/g, " ")
                            .trim()
                    })
                    .join("\t")
            )

            // Unir headers y rows
            const content = [headers.join("\t"), ...rows].join("\n")

            return content
        } else {
            // Fallback para formato anterior
            const headers = Object.keys(vehicleData[0] || {})

            const rows = vehicleData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] || ""
                        return String(value)
                            .replace(/[\t\n\r]/g, " ")
                            .trim()
                    })
                    .join("\t")
            )

            const content = [headers.join("\t"), ...rows].join("\n")

            return content
        }
    }

    /**
     * Crea un textarea temporal para copiar manualmente
     * @param {string} content - Contenido a copiar
     * @returns {HTMLElement} Textarea element
     */
    static createCopyTextArea(content) {
        const textArea = document.createElement("textarea")
        textArea.value = content
        textArea.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 200px;
            z-index: 10001;
            background: white;
            border: 2px solid #1976d2;
            border-radius: 8px;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
        `

        document.body.appendChild(textArea)
        textArea.select()

        return textArea
    }

    /**
     * Muestra instrucciones para pegar directamente desde el portapapeles
     */
    static showPasteInstructions(sheetName, spreadsheetId, recordCount) {
        const modal = document.createElement("div")
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="margin: 0 0 20px 0; color: #1976d2;">
                    📋 Pegar datos en Google Sheets
                </h2>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
                    <strong>✅ Datos copiados al portapapeles!</strong><br>
                    ${recordCount} registros listos para pegar
                </div>
                
                <h3 style="color: #333; margin: 20px 0 10px 0;">Pasos para pegar:</h3>
                
                <ol style="line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Ve a Google Sheets</strong> (se abrió en otra pestaña)</li>
                    <li><strong>Haz clic en la celda A1</strong> donde quieres empezar los datos</li>
                    <li><strong>Pega los datos:</strong>
                        <ul style="margin: 8px 0;">
                            <li><strong>Windows/Linux:</strong> Ctrl + V</li>
                            <li><strong>Mac:</strong> Cmd + V</li>
                        </ul>
                    </li>
                    <li><strong>¡Listo!</strong> Los datos se pegarán automáticamente en formato de tabla</li>
                </ol>
                
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💡 Tips:</strong><br>
                    • Los datos están formateados con columnas automáticamente<br>
                    • Puedes crear una nueva hoja para mejor organización<br>
                    • Los datos incluyen: Excel original + matching + enriquecimiento
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: #4caf50;
                                color: white;
                                border: none;
                                padding: 12px 24px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                font-weight: 500;
                            ">
                        ✅ Perfecto, voy a pegar
                    </button>
                </div>
            </div>
        `

        // Cerrar al hacer clic en el fondo
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove()
            }
        })

        document.body.appendChild(modal)
    }

    /**
     * Muestra instrucciones para copiar manualmente
     */
    static showManualCopyInstructions(sheetName, spreadsheetId, recordCount, textArea) {
        const modal = document.createElement("div")
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="margin: 0 0 20px 0; color: #1976d2;">
                    📋 Copiar y pegar datos manualmente
                </h2>
                
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <strong>📝 ${recordCount} registros listos para copiar</strong>
                </div>
                
                <h3 style="color: #333; margin: 20px 0 10px 0;">Pasos:</h3>
                
                <ol style="line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>El texto ya está seleccionado abajo</strong> ⬇️</li>
                    <li><strong>Copia:</strong> Ctrl+C (Windows/Linux) o Cmd+C (Mac)</li>
                    <li><strong>Ve a Google Sheets</strong> (se abrió en otra pestaña)</li>
                    <li><strong>Haz clic en la celda A1</strong></li>
                    <li><strong>Pega:</strong> Ctrl+V (Windows/Linux) o Cmd+V (Mac)</li>
                </ol>
                
                <div style="text-align: center; margin: 25px 0;">
                    <button onclick="
                        document.querySelector('textarea').select();
                        document.execCommand('copy');
                        this.textContent = '✅ ¡Copiado!';
                        this.style.background = '#4caf50';
                    " style="
                        background: #1976d2;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                        margin-right: 10px;
                    ">
                        📋 Copiar datos
                    </button>
                    
                    <button onclick="
                        this.parentElement.parentElement.parentElement.remove();
                        document.querySelector('textarea').remove();
                    " style="
                        background: #4caf50;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                    ">
                        ✅ Listo
                    </button>
                </div>
            </div>
        `

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove()
                textArea.remove()
            }
        })

        document.body.appendChild(modal)
    }

    /**
     * Muestra instrucciones detalladas para importar el CSV
     * @param {string} filename - Nombre del archivo CSV
     * @param {string} sheetName - Nombre de la hoja propuesta
     * @param {string} spreadsheetId - ID del spreadsheet
     */
    static showImportInstructions(filename, sheetName, spreadsheetId) {
        // Crear modal con instrucciones
        const modal = document.createElement("div")
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="margin: 0 0 20px 0; color: #1976d2;">
                    📊 Cómo importar tus datos a Google Sheets
                </h2>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <strong>📁 Archivo descargado:</strong> ${filename}
                </div>
                
                <h3 style="color: #333; margin: 20px 0 10px 0;">Pasos para importar:</h3>
                
                <ol style="line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>En Google Sheets</strong>, ve al menú <strong>Archivo</strong> → <strong>Importar</strong></li>
                    <li>Haz clic en la pestaña <strong>"Subir"</strong></li>
                    <li>Arrastra el archivo <code>${filename}</code> o haz clic en <strong>"Seleccionar archivo"</strong></li>
                    <li>Configura las opciones:
                        <ul style="margin: 5px 0;">
                            <li><strong>Tipo de separador:</strong> Coma</li>
                            <li><strong>Convertir texto a números:</strong> Sí</li>
                            <li><strong>Lugar de importación:</strong> Insertar nueva hoja</li>
                        </ul>
                    </li>
                    <li>Haz clic en <strong>"Importar datos"</strong></li>
                    <li>(Opcional) Renombra la hoja a: <code>${sheetName}</code></li>
                </ol>
                
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💡 Tip:</strong> Los datos incluyen toda la información procesada: 
                    Excel original + matching + enriquecimiento API.
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: #1976d2;
                                color: white;
                                border: none;
                                padding: 12px 24px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                font-weight: 500;
                            ">
                        ✅ Entendido
                    </button>
                </div>
            </div>
        `

        // Cerrar al hacer clic en el fondo
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove()
            }
        })

        // Agregar al DOM
        document.body.appendChild(modal)
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

            // Intentar inicializar Google Sheets API
            const apiAvailable = await this.initializeGoogleSheetsAPI()
            console.log("🔗 Google Sheets API disponible:", apiAvailable)

            // Preparar datos
            const preparedData = this.prepareDataForGoogleSheets(enrichedData, originalStats)
            if (!preparedData.success) {
                return {
                    success: false,
                    error: preparedData.error
                }
            }

            // Crear nueva hoja en el documento especificado
            const result = await this.createNewSheet(validation.sheetId, preparedData.data, preparedData.data.summary)

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

            // Usar el mismo servicio que el Excel Export para mantener consistencia
            const excelData = ExcelExportService.prepareExcelData(enrichedData)

            const sheetsData = {
                metadata: this.generateMetadata(originalStats),
                vehicleData: excelData.rows, // Usar las mismas filas que Excel
                headers: excelData.headers, // Usar los mismos headers que Excel
                summary: this.generateSummary(enrichedData),
                enrichmentStats: this.generateEnrichmentSummary(enrichedData)
            }

            console.log(`✅ Datos preparados: ${sheetsData.vehicleData.length} vehículos listos para export`)
            console.log(`📋 Headers: ${sheetsData.headers.join(", ")}`)

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
     * @param {Array} headers - Headers opcionales (si no están en vehicleData)
     * @returns {string} Contenido CSV
     */
    static generateCSV(vehicleData, headers = null) {
        if (!vehicleData.length) return ""

        // Si viene con headers separados (del ExcelExportService)
        const csvHeaders = headers || Object.keys(vehicleData[0])

        // Convertir datos a CSV
        const csvContent = [
            csvHeaders.join(","), // Headers
            ...vehicleData.map((row) =>
                csvHeaders
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
     * @param {Array} headers - Headers opcionales (del ExcelExportService)
     * @returns {Object} Estructura para Google Sheets API
     */
    static formatForGoogleSheetsAPI(vehicleData, headers = null) {
        if (!vehicleData.length) return { headers: [], rows: [] }

        const sheetHeaders = headers || Object.keys(vehicleData[0])
        const rows = vehicleData.map((row) => sheetHeaders.map((header) => row[header] || ""))

        return {
            headers: sheetHeaders,
            rows,
            totalColumns: sheetHeaders.length,
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

            // Generar CSV con headers del ExcelExportService
            const csvContent = this.generateCSV(preparedData.data.vehicleData, preparedData.data.headers)

            // Descargar CSV automáticamente
            const filename = options.filename || `vehiculos_procesados_${new Date().toISOString().split("T")[0]}.csv`
            this.downloadCSV(csvContent, filename)

            // Preparar estructura para Google Sheets API (para futuro uso)
            const sheetsStructure = this.formatForGoogleSheetsAPI(preparedData.data.vehicleData, preparedData.data.headers)

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
