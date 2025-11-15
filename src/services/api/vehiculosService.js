import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de vehículos que interactúa con la API
 */
class VehiculosService {
    /**
     * Obtener lista de vehículos con filtros y paginación
     * @param {Object} options - Opciones de consulta
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados por página (default: 12)
     * @param {string} options.orderBy - Campo para ordenar (default: 'created_at')
     * @param {string} options.order - Orden ascendente/descendente (default: 'desc')
     * @param {string} options.estado_codigo - Filtro por código de estado
     * @param {number} options.yearFrom - Año mínimo para filtrar
     * @param {number} options.yearTo - Año máximo para filtrar
     * @param {number} options.priceFrom - Precio mínimo para filtrar
     * @param {number} options.priceTo - Precio máximo para filtrar
     * @param {string} options.search - Búsqueda por marca/modelo
     * @returns {Promise<Object>} Lista de vehículos con paginación
     */
    async getVehiculos(options = {}) {
        const params = new URLSearchParams()

        // Agregar parámetros solo si tienen valor
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/vehiculos?${queryString}` : "/api/vehiculos"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de vehículos")
    }

    /**
     * Obtener un vehículo específico por ID
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>} Datos del vehículo
     */
    async getVehiculoById(id) {
        if (!id) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/vehiculos/${id}`), `Error al obtener el vehículo con ID: ${id}`)
    }

    /**
     * Crear un nuevo vehículo
     * @param {Object} vehiculoData - Datos del vehículo a crear
     * @returns {Promise<Object>} Vehículo creado
     */
    async createVehiculo(vehiculoData) {
        if (!vehiculoData) {
            return { success: false, error: "Datos del vehículo son requeridos" }
        }

        // Validar campos requeridos
        if (!vehiculoData.modelo_id) {
            return { success: false, error: "modelo_id es requerido" }
        }

        if (!vehiculoData.vehiculo_ano) {
            return { success: false, error: "vehiculo_ano es requerido" }
        }

        return makeApiRequest(() => apiClient.post("/api/vehiculos", vehiculoData), "Error al crear el vehículo")
    }

    /**
     * Actualizar un vehículo existente
     * @param {string} id - ID del vehículo a actualizar
     * @param {Object} vehiculoData - Datos a actualizar
     * @returns {Promise<Object>} Vehículo actualizado
     */
    async updateVehiculo(id, vehiculoData) {
        if (!id) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        if (!vehiculoData || Object.keys(vehiculoData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/vehiculos/${id}`, vehiculoData), `Error al actualizar el vehículo con ID: ${id}`)
    }

    /**
     * Eliminar un vehículo (soft delete)
     * @param {string} id - ID del vehículo a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteVehiculo(id) {
        if (!id) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/vehiculos/${id}`), `Error al eliminar el vehículo con ID: ${id}`)
    }

    /**
     * Obtener todos los estados disponibles para vehículos
     * @returns {Promise<Object>} Lista de estados
     */
    async getEstados() {
        return makeApiRequest(() => apiClient.get("/api/estados"), "Error al obtener los estados de vehículos")
    }

    /**
     * Aplicar filtros por defecto para el listado de vehículos
     * @param {Object} customFilters - Filtros personalizados
     * @returns {Object} Filtros con valores por defecto aplicados
     */
    getDefaultFilters(customFilters = {}) {
        return {
            page: 1,
            limit: 12,
            orderBy: "created_at",
            order: "desc",
            ...customFilters
        }
    }

    /**
     * Construir parámetros de búsqueda para la URL
     * @param {Object} filters - Filtros aplicados
     * @returns {string} Query string para la URL
     */
    buildSearchParams(filters) {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== 0) {
                params.append(key, value)
            }
        })

        return params.toString()
    }

    /**
     * Validar datos de vehículo antes de enviar
     * @param {Object} vehiculoData - Datos del vehículo a validar
     * @returns {Object} Resultado de la validación
     */
    validateVehiculoData(vehiculoData) {
        const errors = []
        const currentYear = new Date().getFullYear()

        if (!vehiculoData.modelo_id) {
            errors.push("El modelo es requerido")
        }

        if (!vehiculoData.vehiculo_ano || vehiculoData.vehiculo_ano < 1950 || vehiculoData.vehiculo_ano > currentYear + 1) {
            errors.push(`El año del vehículo debe estar entre 1950 y ${currentYear + 1}`)
        }

        if (vehiculoData.kilometros && vehiculoData.kilometros < 0) {
            errors.push("Los kilómetros no pueden ser negativos")
        }

        if (vehiculoData.valor && vehiculoData.valor < 0) {
            errors.push("El valor no puede ser negativo")
        }

        if (vehiculoData.patente && vehiculoData.patente.length > 15) {
            errors.push("La patente no puede tener más de 15 caracteres")
        }

        if (vehiculoData.observaciones && vehiculoData.observaciones.length > 1000) {
            errors.push("Las observaciones no pueden tener más de 1000 caracteres")
        }

        // Validaciones para nuevos campos
        if (vehiculoData.comentarios && vehiculoData.comentarios.length > 2000) {
            errors.push("Los comentarios no pueden tener más de 2000 caracteres")
        }

        if (vehiculoData.pendientes_preparacion && !Array.isArray(vehiculoData.pendientes_preparacion)) {
            errors.push("Los pendientes de preparación deben ser un array")
        }

        if (vehiculoData.moneda && vehiculoData.moneda.length > 10) {
            errors.push("La moneda no puede tener más de 10 caracteres")
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}

// Crear una instancia única del servicio
const vehiculosService = new VehiculosService()

export default vehiculosService
