import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de operaciones (sistema unificado)
 */
class OperacionesService {
    /**
     * Obtener lista de operaciones con filtros y paginación
     * @param {Object} options - Opciones de consulta
     * @param {string} options.tipo - Tipo de operación
     * @param {string} options.estado - Estado de la operación
     * @param {string} options.fecha_desde - Fecha desde (YYYY-MM-DD)
     * @param {string} options.fecha_hasta - Fecha hasta (YYYY-MM-DD)
     * @param {string} options.vehiculo_id - ID del vehículo
     * @param {string} options.vendedor_id - ID del vendedor
     * @param {string} options.comprador_id - ID del comprador
     * @param {string} options.search - Búsqueda en observaciones
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados (default: 12)
     * @param {string} options.orderBy - Campo para ordenar (default: 'fecha')
     * @param {string} options.order - Orden asc/desc (default: 'desc')
     * @returns {Promise<Object>} Lista de operaciones con paginación
     */
    async getOperaciones(options = {}) {
        const params = new URLSearchParams()

        // Agregar parámetros solo si tienen valor
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/operaciones?${queryString}` : "/api/operaciones"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de operaciones")
    }

    /**
     * Obtener una operación específica por ID
     * @param {string} id - ID de la operación
     * @returns {Promise<Object>} Datos de la operación
     */
    async getOperacionById(id) {
        if (!id) {
            return { success: false, error: "ID de la operación es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/operaciones/${id}`), `Error al obtener la operación con ID: ${id}`)
    }

    /**
     * Crear nueva operación
     * @param {Object} operacionData - Datos de la operación
     * @returns {Promise<Object>} Operación creada
     */
    async createOperacion(operacionData) {
        if (!operacionData) {
            return { success: false, error: "Datos de la operación son requeridos" }
        }

        // Validar campos requeridos
        if (!operacionData.tipo) {
            return { success: false, error: "tipo es requerido" }
        }

        if (!operacionData.fecha) {
            return { success: false, error: "fecha es requerida" }
        }

        if (!operacionData.monto) {
            return { success: false, error: "monto es requerido" }
        }

        if (!operacionData.vehiculo_id) {
            return { success: false, error: "vehiculo_id es requerido" }
        }

        return makeApiRequest(() => apiClient.post("/api/operaciones", operacionData), "Error al crear la operación")
    }

    /**
     * Actualizar una operación existente
     * @param {string} id - ID de la operación a actualizar
     * @param {Object} operacionData - Datos a actualizar
     * @returns {Promise<Object>} Operación actualizada
     */
    async updateOperacion(id, operacionData) {
        if (!id) {
            return { success: false, error: "ID de la operación es requerido" }
        }

        if (!operacionData || Object.keys(operacionData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/operaciones/${id}`, operacionData), `Error al actualizar la operación con ID: ${id}`)
    }

    /**
     * Eliminar una operación
     * @param {string} id - ID de la operación a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteOperacion(id) {
        if (!id) {
            return { success: false, error: "ID de la operación es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/operaciones/${id}`), `Error al eliminar la operación con ID: ${id}`)
    }

    /**
     * Obtener resumen de operaciones por tipo
     * @param {Object} options - Opciones de consulta
     * @param {string} options.fecha_desde - Fecha desde (YYYY-MM-DD)
     * @param {string} options.fecha_hasta - Fecha hasta (YYYY-MM-DD)
     * @returns {Promise<Object>} Resumen de operaciones
     */
    async getResumenOperaciones(options = {}) {
        const params = new URLSearchParams()

        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/operaciones/resumen?${queryString}` : "/api/operaciones/resumen"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener el resumen de operaciones")
    }

    /**
     * Validar datos de operación antes de enviar
     * @param {Object} operacionData - Datos de la operación a validar
     * @returns {Object} Resultado de la validación
     */
    validateOperacionData(operacionData) {
        const errors = []
        const tiposValidos = ["compra", "venta", "seña", "transferencia", "ingreso", "entrega", "devolucion"]
        const estadosValidos = ["pendiente", "en_proceso", "completada", "cancelada", "suspendida"]
        const monedasValidas = ["ARS", "USD", "EUR", "BRL"]

        if (!operacionData.tipo) {
            errors.push("El tipo de operación es requerido")
        } else if (!tiposValidos.includes(operacionData.tipo)) {
            errors.push("Tipo de operación no válido")
        }

        if (!operacionData.fecha) {
            errors.push("La fecha es requerida")
        } else if (!this.isValidDate(operacionData.fecha)) {
            errors.push("La fecha debe tener formato ISO válido")
        }

        if (operacionData.monto === undefined || operacionData.monto === null) {
            errors.push("El monto es requerido")
        } else if (operacionData.monto <= 0) {
            errors.push("El monto debe ser positivo")
        }

        if (!operacionData.vehiculo_id) {
            errors.push("El ID del vehículo es requerido")
        }

        if (operacionData.moneda && !monedasValidas.includes(operacionData.moneda)) {
            errors.push("Moneda no válida")
        }

        if (operacionData.estado && !estadosValidos.includes(operacionData.estado)) {
            errors.push("Estado no válido")
        }

        if (operacionData.observaciones && operacionData.observaciones.length > 1000) {
            errors.push("Las observaciones no pueden tener más de 1000 caracteres")
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Validar si una fecha es válida en formato ISO
     * @param {string} fecha - Fecha a validar
     * @returns {boolean} Verdadero si la fecha es válida
     */
    isValidDate(fecha) {
        return !isNaN(Date.parse(fecha))
    }

    /**
     * Obtener tipos de operaciones disponibles
     * @returns {Array} Lista de tipos con información
     */
    getTiposOperacion() {
        return [
            { value: "compra", label: "Compra", descripcion: "Adquisición de vehículos", color: "success" },
            { value: "venta", label: "Venta", descripcion: "Venta de vehículos a clientes", color: "primary" },
            { value: "seña", label: "Seña", descripcion: "Reserva con anticipo", color: "warning" },
            { value: "transferencia", label: "Transferencia", descripcion: "Transferencia de propiedad", color: "info" },
            { value: "ingreso", label: "Ingreso", descripcion: "Entrada de vehículo al inventario", color: "secondary" },
            { value: "entrega", label: "Entrega", descripcion: "Entrega física del vehículo", color: "success" },
            { value: "devolucion", label: "Devolución", descripcion: "Devolución de vehículo", color: "error" }
        ]
    }

    /**
     * Obtener estados de operaciones disponibles
     * @returns {Array} Lista de estados con información
     */
    getEstadosOperacion() {
        return [
            { value: "pendiente", label: "Pendiente", descripcion: "Operación registrada pero sin iniciar", color: "default" },
            { value: "en_proceso", label: "En Proceso", descripcion: "Operación en curso", color: "info" },
            { value: "completada", label: "Completada", descripcion: "Operación finalizada exitosamente", color: "success" },
            { value: "cancelada", label: "Cancelada", descripcion: "Operación cancelada", color: "error" },
            { value: "suspendida", label: "Suspendida", descripcion: "Operación suspendida temporalmente", color: "warning" }
        ]
    }

    /**
     * Obtener monedas soportadas
     * @returns {Array} Lista de monedas
     */
    getMonedasSoportadas() {
        return [
            { value: "ARS", label: "Peso Argentino", simbolo: "$" },
            { value: "USD", label: "Dólar Estadounidense", simbolo: "US$" },
            { value: "EUR", label: "Euro", simbolo: "€" },
            { value: "BRL", label: "Real Brasileño", simbolo: "R$" }
        ]
    }

    /**
     * Aplicar filtros por defecto para el listado de operaciones
     * @param {Object} customFilters - Filtros personalizados
     * @returns {Object} Filtros con valores por defecto aplicados
     */
    getDefaultFilters(customFilters = {}) {
        return {
            page: 1,
            limit: 12,
            orderBy: "fecha",
            order: "desc",
            ...customFilters
        }
    }

    /**
     * Formatear monto con moneda
     * @param {number} monto - Monto a formatear
     * @param {string} moneda - Código de moneda
     * @returns {string} Monto formateado
     */
    formatearMonto(monto, moneda = "ARS") {
        const monedas = this.getMonedasSoportadas()
        const infoMoneda = monedas.find((m) => m.value === moneda)
        const simbolo = infoMoneda ? infoMoneda.simbolo : moneda

        return `${simbolo} ${monto.toLocaleString()}`
    }

    /**
     * Generar esquema de datos específicos según tipo de operación
     * @param {string} tipo - Tipo de operación
     * @returns {Object} Esquema de validación para datos específicos
     */
    getEsquemaDatosEspecificos(tipo) {
        const esquemas = {
            compra: {
                forma_pago: { type: "string", enum: ["efectivo", "transferencia", "cheque", "financiado"] },
                descuento_aplicado: { type: "number", min: 0, max: 100 },
                garantia_meses: { type: "number", min: 0 },
                documentacion_completa: { type: "boolean" },
                precio_final: { type: "number", min: 0 }
            },
            venta: {
                comision_vendedor: { type: "number", min: 0 },
                precio_lista: { type: "number", min: 0 },
                descuento_otorgado: { type: "number", min: 0 },
                forma_entrega: { type: "string", enum: ["inmediata", "programada", "envio"] },
                fecha_entrega: { type: "string", format: "date" },
                documentos_transferidos: { type: "boolean" }
            },
            seña: {
                monto_total_acordado: { type: "number", min: 0 },
                saldo_pendiente: { type: "number", min: 0 },
                fecha_vencimiento: { type: "string", format: "date" },
                condiciones_especiales: { type: "string" }
            }
        }

        return esquemas[tipo] || {}
    }
}

// Crear una instancia única del servicio
const operacionesService = new OperacionesService()

export default operacionesService
