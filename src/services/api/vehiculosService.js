import apiClient from "./apiClient"

/**
 * Clase que maneja todas las operaciones CRUD de vehículos
 * Utiliza la API real de Voonda con endpoints documentados
 */

class VehiculosService {
    /**
     * Obtener lista de vehículos con filtros y paginación
     * @param {Object} options - Opciones de consulta
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados por página (default: 12)
     * @param {string} options.orderBy - Campo para ordenar
     * @param {string} options.order - Orden ascendente/descendente
     * @param {string} options.estado_codigo - Filtro por código de estado
     * @param {string} options.estado - Filtro por estado (se convierte a estado_codigo)
     * @param {string} options.marca - Filtro por marca específica
     * @param {string} options.modelo - Filtro por modelo específico
     * @param {number} options.año - Filtro por año específico
     * @param {number} options.yearFrom - Año mínimo para filtrar
     * @param {number} options.yearTo - Año máximo para filtrar
     * @param {number} options.priceFrom - Precio mínimo para filtrar
     * @param {number} options.priceTo - Precio máximo para filtrar
     * @param {string} options.search - Búsqueda por marca/modelo
     * @returns {Promise<Object>} Lista de vehículos con paginación
     */
    async getVehiculos(options = {}) {
        try {
            const params = new URLSearchParams()
            let hasSearch = false

            // Crear término de búsqueda combinado si hay marca/modelo
            let searchTerm = options.search || ''
            if (options.marca || options.modelo) {
                const searchParts = []
                if (options.marca) searchParts.push(options.marca)
                if (options.modelo) searchParts.push(options.modelo)
                if (options.search && !searchParts.some(part => options.search.includes(part))) {
                    searchParts.push(options.search)
                }
                searchTerm = searchParts.join(' ').trim()
            }

            // Procesar y agregar parámetros solo si tienen valor
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    // Transformar parámetros específicos según la API
                    switch (key) {
                        case 'marca':
                        case 'modelo':
                            // No enviar estos parámetros directamente - se procesan en searchTerm
                            break
                        case 'año':
                            // El año se envía como vehiculo_ano
                            params.append('vehiculo_ano', value)
                            break
                        case 'estado':
                            // Si se envía 'estado', convertir a 'estado_codigo'
                            if (options.estado_codigo) {
                                params.append('estado_codigo', options.estado_codigo)
                            } else {
                                params.append('estado_codigo', value)
                            }
                            break
                        case 'estado_codigo':
                            // Solo agregar si no se procesó en el caso anterior
                            if (!params.has('estado_codigo')) {
                                params.append('estado_codigo', value)
                            }
                            break
                        case 'search':
                            // Se procesa al final con searchTerm
                            break
                        default:
                            // Agregar parámetros normalmente
                            params.append(key, value)
                            break
                    }
                }
            })

            // Agregar término de búsqueda combinado si existe
            if (searchTerm) {
                params.append('search', searchTerm)
            }

            const queryString = params.toString()
            const url = queryString ? `/api/vehiculos?${queryString}` : "/api/vehiculos"

            console.log("🚗 Obteniendo vehículos desde API:", url)
            console.log("🔍 Filtros procesados:", Object.fromEntries(params))
            console.log("🔍 Término de búsqueda:", searchTerm)

            const response = await apiClient.get(url)

            // El apiClient interceptor devuelve response.data directamente
            // Así que 'response' ya contiene { success, message, vehiculos, pagination }
            return {
                success: true,
                vehiculos: response.vehiculos || response.data || [],
                pagination: response.pagination || {
                    total: response.vehiculos?.length || 0,
                    page: options.page || 1,
                    limit: options.limit || 12,
                    pages: Math.ceil((response.vehiculos?.length || 0) / (options.limit || 12))
                },
                message: response.message || "Vehículos obtenidos exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al obtener vehículos:", error)

            // Manejo de errores específicos
            if (error.response?.status === 401) {
                throw new Error("Token de acceso inválido o expirado")
            }

            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para ver los vehículos")
            }

            throw new Error(error.response?.data?.message || error.message || "Error al obtener los vehículos")
        }
    }

    /**
     * Obtener un vehículo específico por ID
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>} Datos del vehículo
     */
    async getVehiculoById(id) {
        if (!id) {
            throw new Error("ID del vehículo es requerido")
        }

        try {
            console.log("🚗 Obteniendo vehículo por ID:", id)

            const response = await apiClient.get(`/api/vehiculos/${id}`)

            return {
                success: true,
                vehiculo: response.vehiculo || response.data,
                message: response.message || "Vehículo obtenido exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al obtener vehículo:", error)

            if (error.response?.status === 404) {
                throw new Error("Vehículo no encontrado")
            }

            if (error.response?.status === 401) {
                throw new Error("Token de acceso inválido o expirado")
            }

            throw new Error(error.response?.data?.message || error.message || "Error al obtener el vehículo")
        }
    }

    /**
     * Crear un nuevo vehículo
     * @param {Object} vehiculoData - Datos del vehículo a crear
     * @returns {Promise<Object>} Vehículo creado
     */
    async createVehiculo(vehiculoData) {
        if (!vehiculoData) {
            throw new Error("Datos del vehículo son requeridos")
        }

        // Validar datos antes de enviar
        const validation = this.validateVehiculoData(vehiculoData)
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(", ")}`)
        }

        try {
            console.log("� Creando nuevo vehículo:", vehiculoData)

            const response = await apiClient.post("/api/vehiculos", vehiculoData)

            return {
                success: true,
                vehiculo: response.vehiculo || response.data,
                message: response.message || "Vehículo creado exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al crear vehículo:", error)

            if (error.response?.status === 400) {
                const details = error.response?.data?.details || []
                const errorMessage = details.length > 0 ? details.map((d) => d.message).join(", ") : error.response?.data?.message
                throw new Error(errorMessage || "Datos del vehículo inválidos")
            }

            if (error.response?.status === 401) {
                throw new Error("Token de acceso inválido o expirado")
            }

            throw new Error(error.response?.data?.message || error.message || "Error al crear el vehículo")
        }
    }

    /**
     * Actualizar un vehículo existente
     * @param {string} id - ID del vehículo a actualizar
     * @param {Object} vehiculoData - Datos a actualizar
     * @returns {Promise<Object>} Vehículo actualizado
     */
    async updateVehiculo(id, vehiculoData) {
        if (!id) {
            throw new Error("ID del vehículo es requerido")
        }

        if (!vehiculoData || Object.keys(vehiculoData).length === 0) {
            throw new Error("Datos a actualizar son requeridos")
        }

        try {
            console.log("🚗 Actualizando vehículo:", id, vehiculoData)

            const response = await apiClient.put(`/api/vehiculos/${id}`, vehiculoData)

            return {
                success: true,
                vehiculo: response.vehiculo || response.data,
                message: response.message || "Vehículo actualizado exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al actualizar vehículo:", error)

            if (error.response?.status === 404) {
                throw new Error("Vehículo no encontrado")
            }

            if (error.response?.status === 400) {
                const details = error.response?.data?.details || []
                const errorMessage = details.length > 0 ? details.map((d) => d.message).join(", ") : error.response?.data?.message
                throw new Error(errorMessage || "Datos del vehículo inválidos")
            }

            if (error.response?.status === 401) {
                throw new Error("Token de acceso inválido o expirado")
            }

            throw new Error(error.response?.data?.message || error.message || "Error al actualizar el vehículo")
        }
    }

    /**
     * Eliminar un vehículo (soft delete)
     * @param {string} id - ID del vehículo a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteVehiculo(id) {
        if (!id) {
            throw new Error("ID del vehículo es requerido")
        }

        try {
            console.log("🚗 Eliminando vehículo:", id)

            const response = await apiClient.delete(`/api/vehiculos/${id}`)

            return {
                success: true,
                message: response.message || "Vehículo eliminado exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al eliminar vehículo:", error)

            if (error.response?.status === 404) {
                throw new Error("Vehículo no encontrado")
            }

            if (error.response?.status === 401) {
                throw new Error("Token de acceso inválido o expirado")
            }

            if (error.response?.status === 403) {
                throw new Error("No tienes permisos para eliminar este vehículo")
            }

            throw new Error(error.response?.data?.message || error.message || "Error al eliminar el vehículo")
        }
    }

    /**
     * Obtener todos los estados disponibles para vehículos
     * @returns {Promise<Object>} Lista de estados
     */
    async getEstados() {
        try {
            console.log("🚗 Obteniendo estados de vehículos desde API")

            const response = await apiClient.get("/api/vehiculos/filtros/estados")

            return {
                success: true,
                estados: response.estados || response.data || [],
                message: response.message || "Estados obtenidos exitosamente"
            }
        } catch (error) {
            console.warn("⚠️ Endpoint de estados no disponible, usando fallback:", error.message)

            // Fallback: usar endpoint anterior
            try {
                const response = await apiClient.get("/api/estados")

                return {
                    success: true,
                    estados: response.estados || response.data || [],
                    message: response.message || "Estados obtenidos desde fallback"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback de estados:", fallbackError)

                if (fallbackError.response?.status === 401) {
                    throw new Error("Token de acceso inválido o expirado")
                }

                throw new Error(fallbackError.response?.data?.message || fallbackError.message || "Error al obtener los estados de vehículos")
            }
        }
    }

    /**
     * Obtener marcas con modelos y versiones para filtros jerárquicos
     * @returns {Promise<Object>} Lista de marcas con modelos y versiones
     */
    async getMarcasModelos() {
        try {
            console.log("🚗 Obteniendo marcas y modelos desde API")

            const response = await apiClient.get("/api/vehiculos/filtros/marcas-modelos")

            return {
                success: true,
                marcas: response.marcas || response.data || [],
                message: response.message || "Marcas y modelos obtenidos exitosamente"
            }
        } catch (error) {
            console.warn("⚠️ Endpoint de filtros no disponible, usando fallback:", error.message)

            // Fallback: construir estructura jerárquica desde vehículos existentes
            try {
                const vehiculosResponse = await this.getVehiculos({ limit: 200 })

                if (vehiculosResponse.success && vehiculosResponse.vehiculos) {
                    const marcasMap = new Map()

                    vehiculosResponse.vehiculos.forEach((vehiculo) => {
                        const marca = vehiculo?.modelo?.marca || vehiculo?.modelo_auto?.marca
                        const modelo = vehiculo?.modelo?.modelo || vehiculo?.modelo_auto?.modelo
                        const version = vehiculo?.modelo?.version || vehiculo?.modelo_auto?.version

                        if (marca && modelo) {
                            if (!marcasMap.has(marca)) {
                                marcasMap.set(marca, { marca, modelos: [] })
                            }

                            const marcaData = marcasMap.get(marca)
                            let modeloData = marcaData.modelos.find(m => m.modelo === modelo)

                            if (!modeloData) {
                                modeloData = { modelo, versiones: [] }
                                marcaData.modelos.push(modeloData)
                            }

                            if (version && !modeloData.versiones.includes(version)) {
                                modeloData.versiones.push(version)
                            }
                        }
                    })

                    const marcas = Array.from(marcasMap.values())

                    return {
                        success: true,
                        marcas: marcas,
                        message: "Marcas y modelos obtenidos desde fallback"
                    }
                }

                return {
                    success: true,
                    marcas: [],
                    message: "No se encontraron marcas"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback:", fallbackError)
                throw new Error(fallbackError.message || "Error al obtener las marcas y modelos")
            }
        }
    }

    /**
     * Obtener marcas únicas de los vehículos (extraídas de modelo_auto) - DEPRECATED
     * Usar getMarcasModelos() para obtener estructura jerárquica
     * @returns {Promise<Object>} Lista de marcas
     */
    async getMarcas() {
        try {
            console.log("🚗 Obteniendo marcas desde nuevo endpoint")

            const response = await this.getMarcasModelos()

            if (response.success && response.marcas) {
                // Convertir estructura jerárquica a lista simple de marcas
                const marcasSimples = response.marcas.map((marcaData, index) => ({
                    id: index + 1,
                    nombre: marcaData.marca,
                    codigo: marcaData.marca?.toLowerCase().replace(/ /g, "_"),
                    activo: true
                }))

                return {
                    success: true,
                    marcas: marcasSimples,
                    data: marcasSimples,
                    message: "Marcas obtenidas exitosamente"
                }
            }

            return {
                success: true,
                marcas: [],
                data: [],
                message: "No se encontraron marcas"
            }
        } catch (error) {
            console.error("❌ Error al obtener marcas:", error)
            throw new Error(error.message || "Error al obtener las marcas")
        }
    }

    /**
     * Obtener modelos únicos de una marca específica (desde endpoint jerárquico)
     * @param {string} marca - Nombre de la marca
     * @returns {Promise<Object>} Lista de modelos
     */
    async getModelosByMarca(marca) {
        if (!marca) {
            return {
                success: true,
                modelos: [],
                data: [],
                message: "Marca no especificada"
            }
        }

        try {
            console.log("🚗 Obteniendo modelos para marca:", marca)

            // Obtener estructura jerárquica completa
            const response = await this.getMarcasModelos()

            if (response.success && response.marcas) {
                // Buscar la marca específica y extraer sus modelos
                const marcaData = response.marcas.find(m => 
                    m.marca?.toLowerCase() === marca.toLowerCase()
                )

                if (marcaData && marcaData.modelos) {
                    const modelos = marcaData.modelos.map((modeloData, index) => ({
                        id: index + 1,
                        nombre: modeloData.modelo,
                        marca: marca,
                        versiones: modeloData.versiones || [],
                        activo: true
                    }))

                    return {
                        success: true,
                        modelos: modelos,
                        data: modelos,
                        message: "Modelos obtenidos exitosamente"
                    }
                }
            }

            return {
                success: true,
                modelos: [],
                data: [],
                message: `No se encontraron modelos para la marca ${marca}`
            }
        } catch (error) {
            console.error("❌ Error al obtener modelos:", error)
            throw new Error(error.message || `Error al obtener modelos de ${marca}`)
        }
    }

    /**
     * Obtener años únicos disponibles para filtros
     * @returns {Promise<Object>} Lista de años
     */
    async getAños() {
        try {
            console.log("🚗 Obteniendo años disponibles desde API")

            const response = await apiClient.get("/api/vehiculos/filtros/años")

            return {
                success: true,
                años: response.años || response.data || [],
                message: response.message || "Años obtenidos exitosamente"
            }
        } catch (error) {
            console.warn("⚠️ Endpoint de años no disponible, usando fallback:", error.message)

            // Fallback: extraer años desde vehículos existentes
            try {
                const vehiculosResponse = await this.getVehiculos({ limit: 200 })

                if (vehiculosResponse.success && vehiculosResponse.vehiculos) {
                    const añosSet = new Set()

                    vehiculosResponse.vehiculos.forEach((vehiculo) => {
                        const año = vehiculo?.modelo?.modelo_ano || vehiculo?.vehiculo_ano || vehiculo?.año
                        if (año && !isNaN(año)) {
                            añosSet.add(parseInt(año))
                        }
                    })

                    // Ordenar años de mayor a menor
                    const años = Array.from(añosSet).sort((a, b) => b - a)

                    return {
                        success: true,
                        años: años,
                        message: "Años obtenidos desde fallback"
                    }
                }

                return {
                    success: true,
                    años: [],
                    message: "No se encontraron años"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback de años:", fallbackError)
                throw new Error(fallbackError.message || "Error al obtener los años disponibles")
            }
        }
    }

    /**
     * Validar datos de vehículo antes de enviar a la API
     * @param {Object} vehiculoData - Datos del vehículo a validar
     * @returns {Object} Resultado de la validación
     */
    validateVehiculoData(vehiculoData) {
        const errors = []
        const currentYear = new Date().getFullYear()

        // Validaciones requeridas según la API
        if (!vehiculoData.modelo_id) {
            errors.push("El modelo es requerido")
        }

        if (!vehiculoData.vehiculo_ano || vehiculoData.vehiculo_ano < 1950 || vehiculoData.vehiculo_ano > currentYear + 1) {
            errors.push(`El año del vehículo debe estar entre 1950 y ${currentYear + 1}`)
        }

        // Validaciones opcionales
        if (vehiculoData.kilometros !== undefined && vehiculoData.kilometros < 0) {
            errors.push("Los kilómetros no pueden ser negativos")
        }

        if (vehiculoData.valor !== undefined && vehiculoData.valor < 0) {
            errors.push("El valor no puede ser negativo")
        }

        if (vehiculoData.patente && vehiculoData.patente.length > 15) {
            errors.push("La patente no puede tener más de 15 caracteres")
        }

        if (vehiculoData.observaciones && vehiculoData.observaciones.length > 1000) {
            errors.push("Las observaciones no pueden tener más de 1000 caracteres")
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
