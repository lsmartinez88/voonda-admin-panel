import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de compradores
 */
class CompradoresService {
    /**
     * Obtener lista de compradores con filtros y paginación
     * @param {Object} options - Opciones de consulta
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados por página (default: 12)
     * @param {string} options.orderBy - Campo para ordenar (default: 'created_at')
     * @param {string} options.order - Orden ascendente/descendente (default: 'desc')
     * @param {string} options.search - Búsqueda en nombre, apellido, teléfono, email, DNI
     * @returns {Promise<Object>} Lista de compradores con paginación
     */
    async getCompradores(options = {}) {
        const params = new URLSearchParams()

        // Agregar parámetros solo si tienen valor
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/compradores?${queryString}` : "/api/compradores"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de compradores")
    }

    /**
     * Obtener un comprador específico por ID
     * @param {string} id - ID del comprador
     * @returns {Promise<Object>} Datos del comprador
     */
    async getCompradorById(id) {
        if (!id) {
            return { success: false, error: "ID del comprador es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/compradores/${id}`), `Error al obtener el comprador con ID: ${id}`)
    }

    /**
     * Crear un nuevo comprador
     * @param {Object} compradorData - Datos del comprador a crear
     * @returns {Promise<Object>} Comprador creado
     */
    async createComprador(compradorData) {
        if (!compradorData) {
            return { success: false, error: "Datos del comprador son requeridos" }
        }

        // Validar campos requeridos
        if (!compradorData.empresa_id) {
            return { success: false, error: "empresa_id es requerido" }
        }

        if (!compradorData.nombre) {
            return { success: false, error: "nombre es requerido" }
        }

        return makeApiRequest(() => apiClient.post("/api/compradores", compradorData), "Error al crear el comprador")
    }

    /**
     * Actualizar un comprador existente
     * @param {string} id - ID del comprador a actualizar
     * @param {Object} compradorData - Datos a actualizar
     * @returns {Promise<Object>} Comprador actualizado
     */
    async updateComprador(id, compradorData) {
        if (!id) {
            return { success: false, error: "ID del comprador es requerido" }
        }

        if (!compradorData || Object.keys(compradorData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/compradores/${id}`, compradorData), `Error al actualizar el comprador con ID: ${id}`)
    }

    /**
     * Eliminar un comprador (soft delete)
     * @param {string} id - ID del comprador a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteComprador(id) {
        if (!id) {
            return { success: false, error: "ID del comprador es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/compradores/${id}`), `Error al eliminar el comprador con ID: ${id}`)
    }

    /**
     * Validar datos de comprador antes de enviar
     * @param {Object} compradorData - Datos del comprador a validar
     * @returns {Object} Resultado de la validación
     */
    validateCompradorData(compradorData) {
        const errors = []

        if (!compradorData.nombre || compradorData.nombre.trim().length < 2) {
            errors.push("El nombre es requerido y debe tener al menos 2 caracteres")
        }

        if (compradorData.nombre && compradorData.nombre.length > 200) {
            errors.push("El nombre no puede tener más de 200 caracteres")
        }

        if (compradorData.apellido && (compradorData.apellido.length < 2 || compradorData.apellido.length > 200)) {
            errors.push("El apellido debe tener entre 2 y 200 caracteres")
        }

        if (compradorData.telefono && compradorData.telefono.length > 20) {
            errors.push("El teléfono no puede tener más de 20 caracteres")
        }

        if (compradorData.email && (!this.isValidEmail(compradorData.email) || compradorData.email.length > 255)) {
            errors.push("El email debe ser válido y no puede tener más de 255 caracteres")
        }

        if (compradorData.dni && compradorData.dni.length > 20) {
            errors.push("El DNI no puede tener más de 20 caracteres")
        }

        if (compradorData.direccion && compradorData.direccion.length > 500) {
            errors.push("La dirección no puede tener más de 500 caracteres")
        }

        if (compradorData.ciudad && compradorData.ciudad.length > 100) {
            errors.push("La ciudad no puede tener más de 100 caracteres")
        }

        if (compradorData.provincia && compradorData.provincia.length > 100) {
            errors.push("La provincia no puede tener más de 100 caracteres")
        }

        if (compradorData.codigo_postal && compradorData.codigo_postal.length > 10) {
            errors.push("El código postal no puede tener más de 10 caracteres")
        }

        if (compradorData.origen && compradorData.origen.length > 100) {
            errors.push("El origen no puede tener más de 100 caracteres")
        }

        if (compradorData.comentarios && compradorData.comentarios.length > 1000) {
            errors.push("Los comentarios no pueden tener más de 1000 caracteres")
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Validar si un email es válido
     * @param {string} email - Email a validar
     * @returns {boolean} Verdadero si el email es válido
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Aplicar filtros por defecto para el listado de compradores
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
     * Obtener compradores formateados para select/dropdown
     * @returns {Promise<Array>} Compradores formateados
     */
    async getCompradoresForSelect() {
        const response = await this.getCompradores({ limit: 100 })

        if (response.success && response.compradores) {
            return response.compradores.map((comprador) => ({
                value: comprador.id,
                label: `${comprador.nombre}${comprador.apellido ? ` ${comprador.apellido}` : ""}`,
                telefono: comprador.telefono,
                email: comprador.email,
                dni: comprador.dni
            }))
        }

        return []
    }
}

// Crear una instancia única del servicio
const compradoresService = new CompradoresService()

export default compradoresService
