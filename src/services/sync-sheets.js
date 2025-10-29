/**
 * Servicio para sincronizar vehículos con Google Sheets
 */

import { supabase } from "../config/supabase"

export const syncSheetsService = {
    /**
     * Sincroniza todos los vehículos con Google Sheets
     */
    async syncVehiculos() {
        try {
            // 1. Obtener todos los vehículos activos desde Supabase
            const { data: vehiculos, error: fetchError } = await supabase.from("vehiculos").select("*").eq("activo", true).order("created_at", { ascending: false })

            if (fetchError) {
                throw new Error(`Error obteniendo vehículos: ${fetchError.message}`)
            }

            // 2. Preparar datos para Google Sheets
            const sheetsData = vehiculos.map((vehiculo) => ({
                id: vehiculo.id,
                marca: vehiculo.marca || "",
                modelo: vehiculo.modelo || "",
                año: vehiculo.vehiculo_ano || "",
                color: vehiculo.color || "",
                combustible: vehiculo.combustible || "",
                transmision: vehiculo.transmision || "",
                kilometraje: vehiculo.kilometraje || 0,
                precio_usd: vehiculo.valor || 0,
                estado: vehiculo.estado || "Disponible",
                tipo_vehiculo: vehiculo.tipo_vehiculo || "",
                puertas: vehiculo.puertas || "",
                motor: vehiculo.motor || "",
                descripcion: vehiculo.descripcion || "",
                fecha_creacion: vehiculo.created_at,
                fecha_actualizacion: vehiculo.updated_at
            }))

            // 3. Enviar a tu webhook/API externa (ajusta la URL según tu configuración)
            const webhookUrl = import.meta.env.VITE_SYNC_WEBHOOK_URL || "https://tu-webhook-url.com/sync-sheets"

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "sync_vehiculos",
                    data: sheetsData,
                    timestamp: new Date().toISOString()
                })
            })

            if (!response.ok) {
                throw new Error(`Error en webhook: ${response.status} ${response.statusText}`)
            }

            const result = await response.json()

            // 4. Marcar vehículos como sincronizados
            if (result.success) {
                const vehiculoIds = vehiculos.map((v) => v.id)
                const { error: updateError } = await supabase
                    .from("vehiculos")
                    .update({
                        sincronizado_sheets: true,
                        ultima_sincronizacion: new Date().toISOString()
                    })
                    .in("id", vehiculoIds)

                if (updateError) {
                    console.warn("Error actualizando estado de sincronización:", updateError)
                }
            }

            return {
                success: true,
                message: `${sheetsData.length} vehículos sincronizados correctamente`,
                count: sheetsData.length,
                data: result
            }
        } catch (error) {
            console.error("Error en sincronización:", error)
            return {
                success: false,
                message: error.message,
                error: error
            }
        }
    },

    /**
     * Obtiene el estado de la última sincronización
     */
    async getSyncStatus() {
        try {
            const { data, error } = await supabase.from("vehiculos").select("sincronizado_sheets, ultima_sincronizacion").eq("activo", true)

            if (error) throw error

            const total = data.length
            const sincronizados = data.filter((v) => v.sincronizado_sheets).length
            const ultimaSync = data
                .map((v) => v.ultima_sincronizacion)
                .filter(Boolean)
                .sort()
                .pop()

            return {
                total,
                sincronizados,
                pendientes: total - sincronizados,
                ultimaSincronizacion: ultimaSync,
                porcentajeSincronizado: total > 0 ? Math.round((sincronizados / total) * 100) : 0
            }
        } catch (error) {
            console.error("Error obteniendo estado de sincronización:", error)
            throw error
        }
    }
}

export default syncSheetsService
