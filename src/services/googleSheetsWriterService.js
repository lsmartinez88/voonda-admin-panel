/**
 * Servicio para leer y escribir en Google Sheets usando Google Apps Script
 * Este servicio se comunica con un script deployado que tiene acceso directo a la planilla
 */

const SCRIPT_URL = import.meta.env.VITE_HORARIOS_SCRIPT_URL

class GoogleSheetsWriterService {
    /**
     * Leer todos los horarios de la planilla
     */
    static async readHorarios() {
        try {
            if (!SCRIPT_URL || !SCRIPT_URL.includes("/exec")) {
                return {
                    success: false,
                    error: "URL del script inválida. Debe ser una URL de deployment que termine en '/exec'. Por favor, deploy el script como Web App con acceso 'Anyone'."
                }
            }

            // Usar POST con text/plain para evitar CORS preflight
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    action: "read"
                })
            })

            if (!response.ok) {
                return {
                    success: false,
                    error: `Error HTTP ${response.status}: Verifica que el script esté deployado como Web App con acceso 'Anyone'`
                }
            }

            const result = await response.json()

            if (result.success) {
                return {
                    success: true,
                    data: result.data,
                    headers: result.headers
                }
            } else {
                return {
                    success: false,
                    error: result.error || "Error desconocido al leer horarios"
                }
            }
        } catch (error) {
            console.error("Error leyendo horarios:", error)

            // Mensaje más específico para errores de CORS
            if (error.message.includes("fetch")) {
                return {
                    success: false,
                    error: "Error de CORS: El script debe estar deployado como Web App con acceso 'Anyone'. Verifica la configuración del deployment en Google Apps Script."
                }
            }

            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Agregar un nuevo horario a la planilla
     * @param {string} fecha - Formato: DD/MM/YYYY
     * @param {string} horario - Ej: "09:00 a 13:00" o "cerrado"
     * @param {string} motivo - Descripción del motivo
     */
    static async addHorario(fecha, horario, motivo) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    action: "add",
                    fecha,
                    horario,
                    motivo
                })
            })

            const result = await response.json()

            return result
        } catch (error) {
            console.error("Error agregando horario:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Actualizar un horario existente
     * @param {string} fecha - Fecha a buscar (identificador único)
     * @param {string} horario - Nuevo horario
     * @param {string} motivo - Nuevo motivo
     */
    static async updateHorario(fecha, horario, motivo) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    action: "update",
                    fecha,
                    horario,
                    motivo
                })
            })

            const result = await response.json()

            return result
        } catch (error) {
            console.error("Error actualizando horario:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Eliminar un horario
     * @param {string} fecha - Fecha del horario a eliminar
     */
    static async deleteHorario(fecha) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify({
                    action: "delete",
                    fecha
                })
            })

            const result = await response.json()

            return result
        } catch (error) {
            console.error("Error eliminando horario:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }
}

export default GoogleSheetsWriterService
