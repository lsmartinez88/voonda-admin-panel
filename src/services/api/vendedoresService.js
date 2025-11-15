import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de vendedores
 */
class VendedoresService {
    /**
     * Obtener lista de vendedores con filtros y paginación
     * @param {Object} options - Opciones de consulta
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados por página (default: 12)
     * @param {string} options.orderBy - Campo para ordenar (default: 'created_at')
     * @param {string} options.order - Orden ascendente/descendente (default: 'desc')
     * @param {string} options.search - Búsqueda en nombre, apellido, teléfono, email, DNI
     * @returns {Promise<Object>} Lista de vendedores con paginación
     */
    async getVendedores(options = {}) {
        const params = new URLSearchParams()

        // Agregar parámetros solo si tienen valor
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/vendedores?${queryString}` : "/api/vendedores"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de vendedores")
    }

    /**
     * Obtener un vendedor específico por ID
     * @param {string} id - ID del vendedor
     * @returns {Promise<Object>} Datos del vendedor
     */
    async getVendedorById(id) {
        if (!id) {
            return { success: false, error: "ID del vendedor es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/vendedores/${id}`), `Error al obtener el vendedor con ID: ${id}`)
    }

    /**
     * Crear un nuevo vendedor
     * @param {Object} vendedorData - Datos del vendedor a crear
     * @returns {Promise<Object>} Vendedor creado
     */
    async createVendedor(vendedorData) {
        if (!vendedorData) {
            return { success: false, error: "Datos del vendedor son requeridos" }
        }

        // Validar campos requeridos
        if (!vendedorData.empresa_id) {
            return { success: false, error: "empresa_id es requerido" }
        }

        if (!vendedorData.nombre) {
            return { success: false, error: "nombre es requerido" }
        }

        return makeApiRequest(() => apiClient.post("/api/vendedores", vendedorData), "Error al crear el vendedor")
    }

    /**
     * Actualizar un vendedor existente
     * @param {string} id - ID del vendedor a actualizar
     * @param {Object} vendedorData - Datos a actualizar
     * @returns {Promise<Object>} Vendedor actualizado
     */
    async updateVendedor(id, vendedorData) {
        if (!id) {
            return { success: false, error: "ID del vendedor es requerido" }
        }

        if (!vendedorData || Object.keys(vendedorData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/vendedores/${id}`, vendedorData), `Error al actualizar el vendedor con ID: ${id}`)
    }

    /**
     * Eliminar un vendedor (soft delete)
     * @param {string} id - ID del vendedor a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteVendedor(id) {
        if (!id) {
            return { success: false, error: "ID del vendedor es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/vendedores/${id}`), `Error al eliminar el vendedor con ID: ${id}`)
    }

    /**
     * Validar datos de vendedor antes de enviar
     * @param {Object} vendedorData - Datos del vendedor a validar
     * @returns {Object} Resultado de la validación
     */
    validateVendedorData(vendedorData) {
        const errors = []

        if (!vendedorData.nombre || vendedorData.nombre.trim().length < 2) {
            errors.push("El nombre es requerido y debe tener al menos 2 caracteres")
        }

        if (vendedorData.nombre && vendedorData.nombre.length > 200) {
            errors.push("El nombre no puede tener más de 200 caracteres")
        }

        if (vendedorData.apellido && (vendedorData.apellido.length < 2 || vendedorData.apellido.length > 200)) {
            errors.push("El apellido debe tener entre 2 y 200 caracteres")
        }

        if (vendedorData.telefono && vendedorData.telefono.length > 20) {
            errors.push("El teléfono no puede tener más de 20 caracteres")
        }

        if (vendedorData.email && (!this.isValidEmail(vendedorData.email) || vendedorData.email.length > 255)) {
            errors.push("El email debe ser válido y no puede tener más de 255 caracteres")
        }

        if (vendedorData.dni && vendedorData.dni.length > 20) {
            errors.push("El DNI no puede tener más de 20 caracteres")
        }

        if (vendedorData.direccion && vendedorData.direccion.length > 500) {
            errors.push("La dirección no puede tener más de 500 caracteres")
        }

        if (vendedorData.ciudad && vendedorData.ciudad.length > 100) {
            errors.push("La ciudad no puede tener más de 100 caracteres")
        }

        if (vendedorData.provincia && vendedorData.provincia.length > 100) {
            errors.push("La provincia no puede tener más de 100 caracteres")
        }

        if (vendedorData.codigo_postal && vendedorData.codigo_postal.length > 10) {
            errors.push("El código postal no puede tener más de 10 caracteres")
        }

        if (vendedorData.origen && vendedorData.origen.length > 100) {
            errors.push("El origen no puede tener más de 100 caracteres")
        }

        if (vendedorData.comentarios && vendedorData.comentarios.length > 1000) {
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
     * Aplicar filtros por defecto para el listado de vendedores
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
     * Obtener vendedores formateados para select/dropdown
     * @returns {Promise<Array>} Vendedores formateados
     */
    async getVendedoresForSelect() {
        const response = await this.getVendedores({ limit: 100 })

        if (response.success && response.vendedores) {
            return response.vendedores.map((vendedor) => ({
                value: vendedor.id,
                label: `${vendedor.nombre}${vendedor.apellido ? ` ${vendedor.apellido}` : ""}`,
                telefono: vendedor.telefono,
                email: vendedor.email,
                dni: vendedor.dni
            }))
        }

        return []
    }
}

// Crear una instancia única del servicio
const vendedoresService = new VendedoresService()

export default vendedoresService
