/**
 * Google Sheets Reader Service
 *
 * Servicio para leer datos de Google Sheets públicas usando Google Sheets API v4
 * Documentación: https://developers.google.com/sheets/api/reference/rest
 */

const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY
const SHEETS_API_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets"

/**
 * Extrae el ID de la hoja de cálculo desde una URL de Google Sheets
 * @param {string} url - URL completa de Google Sheets
 * @returns {string|null} - ID de la hoja o null si no es válida
 */
export function extractSpreadsheetId(url) {
    try {
        // Formato: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
        return match ? match[1] : null
    } catch (error) {
        console.error("Error al extraer ID de la URL:", error)
        return null
    }
}

/**
 * Obtiene el nombre de la primera hoja de un spreadsheet
 * @param {string} spreadsheetId - ID de la hoja de cálculo
 * @returns {Promise<string|null>} - Nombre de la primera hoja o null
 */
async function getFirstSheetName(spreadsheetId) {
    try {
        if (!GOOGLE_SHEETS_API_KEY) {
            throw new Error("API Key de Google Sheets no configurada")
        }

        const url = `${SHEETS_API_BASE_URL}/${spreadsheetId}?key=${GOOGLE_SHEETS_API_KEY}&fields=sheets.properties.title`

        const response = await fetch(url)

        if (!response.ok) {
            console.warn("No se pudo obtener metadatos de la hoja, usando rango por defecto")
            return null
        }

        const data = await response.json()
        const firstSheet = data.sheets?.[0]?.properties?.title

        console.log("📋 Primera hoja encontrada:", firstSheet)
        return firstSheet || null
    } catch (error) {
        console.warn("Error obteniendo nombre de hoja:", error)
        return null
    }
}

/**
 * Lee los datos de una hoja de Google Sheets
 * @param {string} spreadsheetId - ID de la hoja de cálculo
 * @param {string} range - Rango a leer (ej: 'Sheet1!A1:Z1000' o 'Sheet1')
 * @returns {Promise<Object>} - Objeto con success, data (array de filas), y headers
 */
export async function readGoogleSheet(spreadsheetId, range = null) {
    try {
        if (!GOOGLE_SHEETS_API_KEY) {
            throw new Error("API Key de Google Sheets no configurada. Agrega VITE_GOOGLE_SHEETS_API_KEY al archivo .env.local")
        }

        // Si no se especifica rango, intentar obtener el nombre de la primera hoja
        if (!range) {
            const sheetName = await getFirstSheetName(spreadsheetId)
            range = sheetName || "A:ZZ" // Usar A:ZZ como fallback para leer todas las columnas
        }

        const url = `${SHEETS_API_BASE_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${GOOGLE_SHEETS_API_KEY}`

        console.log("📖 Leyendo Google Sheet...", { spreadsheetId, range })

        const response = await fetch(url)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Error al leer Google Sheet: ${errorData.error?.message || response.statusText}`)
        }

        const data = await response.json()
        const rows = data.values || []

        if (rows.length === 0) {
            return {
                success: false,
                message: "La hoja de cálculo está vacía",
                data: [],
                headers: []
            }
        }

        // Primera fila son los headers
        const headers = rows[0]
        const dataRows = rows.slice(1)

        console.log("✅ Google Sheet leída exitosamente:", {
            totalRows: dataRows.length,
            headers: headers.length
        })

        return {
            success: true,
            data: dataRows,
            headers,
            totalRows: dataRows.length,
            message: `Planilla leída: ${dataRows.length} filas`
        }
    } catch (error) {
        console.error("❌ Error al leer Google Sheet:", error)
        return {
            success: false,
            message: error.message,
            data: [],
            headers: [],
            error
        }
    }
}

/**
 * Lee una Google Sheet desde URL y parsea los datos al formato de vehículos
 * @param {string} sheetUrl - URL completa de Google Sheets
 * @param {string} range - Rango opcional (default: null = detecta automáticamente la primera hoja)
 * @returns {Promise<Object>} - Objeto con success, vehicles (array de objetos), y headers
 */
export async function readVehiclesFromSheet(sheetUrl, range = null) {
    try {
        const spreadsheetId = extractSpreadsheetId(sheetUrl)

        if (!spreadsheetId) {
            return {
                success: false,
                message: "URL de Google Sheets inválida. Debe ser del formato: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit",
                vehicles: []
            }
        }

        const result = await readGoogleSheet(spreadsheetId, range)

        if (!result.success) {
            return {
                success: false,
                message: result.message,
                vehicles: []
            }
        }

        // Parsear filas a objetos de vehículos
        const vehicles = parseRowsToVehicles(result.headers, result.data)

        console.log("📊 Vehículos parseados:", {
            total: vehicles.length,
            conId: vehicles.filter((v) => v.id).length
        })

        return {
            success: true,
            vehicles,
            headers: result.headers,
            totalVehicles: vehicles.length,
            message: `${vehicles.length} vehículos leídos desde la planilla`
        }
    } catch (error) {
        console.error("❌ Error al leer vehículos desde Google Sheet:", error)
        return {
            success: false,
            message: error.message,
            vehicles: [],
            error
        }
    }
}

/**
 * Parsea filas de datos a objetos de vehículos
 * @param {Array<string>} headers - Array de nombres de columnas
 * @param {Array<Array>} rows - Array de filas de datos
 * @returns {Array<Object>} - Array de objetos de vehículos
 */
function parseRowsToVehicles(headers, rows) {
    console.log("🔧 Parseando vehículos de Google Sheets...")
    console.log("   Headers encontrados:", headers)
    console.log("   Total de filas:", rows.length)
    console.log("   Primera fila de datos:", rows[0])

    return rows
        .map((row, index) => {
            const vehicle = {}

            headers.forEach((header, colIndex) => {
                const value = row[colIndex] || ""

                // ID siempre como STRING para evitar problemas de comparación
                if (header === "id") {
                    vehicle[header] = value ? String(value).trim() : null
                }
                // Convertir valores numéricos (excepto ID)
                else if (["kilometros", "vehiculo_ano", "valor", "puertas", "cilindrada", "potencia_hp", "torque_nm", "airbags", "capacidad_baul", "capacidad_combustible", "velocidad_max", "largo", "ancho", "alto", "asientos"].includes(header)) {
                    vehicle[header] = value ? parseFloat(value) : null
                }
                // Booleanos
                else if (["publicacion_web", "publicacion_api_call", "abs", "control_estabilidad", "featured", "favorite"].includes(header)) {
                    vehicle[header] = value === "true" || value === "1" || value === "TRUE" || value === "Sí"
                }
                // Strings
                else {
                    vehicle[header] = value
                }
            })

            return vehicle
        })
        .filter((vehicle) => {
            if (!vehicle.id) {
                console.warn("⚠️ Vehículo sin ID encontrado en fila, será ignorado")
                return false
            }
            return true
        })
}

/**
 * Extrae solo los IDs de los vehículos de una planilla
 * @param {string} sheetUrl - URL completa de Google Sheets
 * @returns {Promise<Object>} - Objeto con success y array de IDs
 */
export async function extractVehicleIds(sheetUrl) {
    try {
        const result = await readVehiclesFromSheet(sheetUrl)

        if (!result.success) {
            return {
                success: false,
                message: result.message,
                ids: []
            }
        }

        const ids = result.vehicles.map((v) => v.id).filter((id) => id) // Filtrar IDs válidos

        return {
            success: true,
            ids,
            total: ids.length,
            message: `${ids.length} IDs extraídos`
        }
    } catch (error) {
        console.error("❌ Error al extraer IDs:", error)
        return {
            success: false,
            message: error.message,
            ids: [],
            error
        }
    }
}

const GoogleSheetsReaderService = {
    extractSpreadsheetId,
    readGoogleSheet,
    readVehiclesFromSheet,
    extractVehicleIds
}

export default GoogleSheetsReaderService
