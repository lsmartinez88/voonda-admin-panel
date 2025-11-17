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

            // Si hay filtros de marca o modelo, necesitamos obtener los IDs correspondientes
            let marcaId = null
            let modeloId = null

            if (options.marca || options.modelo) {
                try {
                    // Obtener información de marcas y modelos para mapeo
                    const marcasResponse = await this.getMarcasModelos()
                    const marcasData = marcasResponse.marcas || []

                    // Buscar ID de la marca si se especifica
                    if (options.marca) {
                        const marcaEncontrada = marcasData.find(m => 
                            m.marca.toLowerCase() === options.marca.toLowerCase()
                        )
                        if (marcaEncontrada && marcaEncontrada.id) {
                            marcaId = marcaEncontrada.id
                        } else {
                            // Si no encontramos la marca por ID, intentar usar el nombre directamente
                            marcaId = options.marca
                        }
                    }

                    // Buscar ID del modelo si se especifica
                    if (options.modelo) {
                        let modeloEncontrado = null
                        
                        // Buscar en todas las marcas
                        for (const marcaData of marcasData) {
                            if (marcaData.modelos) {
                                modeloEncontrado = marcaData.modelos.find(m => 
                                    m.modelo.toLowerCase() === options.modelo.toLowerCase() ||
                                    m.id === options.modelo
                                )
                                if (modeloEncontrado) break
                            }
                        }

                        if (modeloEncontrado && modeloEncontrado.id) {
                            modeloId = modeloEncontrado.id
                        } else {
                            // Si no encontramos el modelo por ID, intentar usar el nombre directamente
                            modeloId = options.modelo
                        }
                    }
                } catch (mappingError) {
                    console.warn("⚠️ Error al mapear marca/modelo a IDs, usando nombres directos:", mappingError.message)
                    marcaId = options.marca
                    modeloId = options.modelo
                }
            }

            // Procesar y agregar parámetros según la nueva API documentada
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    // Transformar parámetros específicos según la API
                    switch (key) {
                        case "marca":
                            // ✅ REACTIVADO - Usar marcaId mapeado o nombre directo
                            if (marcaId) {
                                params.append("marcaId", marcaId)
                                console.log("🏷️ Filtro marca mapeado:", value, "->", marcaId)
                            }
                            break
                        case "modelo":
                            // ✅ REACTIVADO - Usar modeloId mapeado o nombre directo  
                            if (modeloId) {
                                params.append("modeloId", modeloId)
                                console.log("🚗 Filtro modelo mapeado:", value, "->", modeloId)
                            }
                            break
                        case "search":
                            // ✅ FUNCIONAL - El backend soporta búsqueda en marca/modelo
                            params.append("search", value)
                            break
                        case "año":
                            // Mapear a 'ano' según la documentación de la API
                            params.append("ano", value)
                            break
                        case "estado":
                            // Si se envía 'estado', convertir a 'estado_codigo'
                            if (options.estado_codigo) {
                                params.append("estado_codigo", options.estado_codigo)
                            } else {
                                params.append("estado_codigo", value)
                            }
                            break
                        case "estado_codigo":
                            // Solo agregar si no se procesó en el caso anterior
                            if (!params.has("estado_codigo")) {
                                params.append("estado_codigo", value)
                            }
                            break
                        default:
                            // Agregar parámetros normalmente
                            params.append(key, value)
                            break
                    }
                }
            })

            const queryString = params.toString()
            const url = queryString ? `/api/vehiculos?${queryString}` : "/api/vehiculos"

            console.log("🚗 Obteniendo vehículos desde API:", url)
            console.log("🔍 Filtros procesados:", Object.fromEntries(params))

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
     * Obtener marcas con modelos y versiones para filtros jerárquicos (desde nuevo endpoint)
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
            console.warn("⚠️ Endpoint de marcas-modelos no disponible, extrayendo desde vehículos:", error.message)

            // Fallback: extraer marcas y modelos desde vehículos existentes con IDs
            try {
                const vehiculosResponse = await apiClient.get("/api/vehiculos?limit=200")
                const vehiculos = vehiculosResponse.vehiculos || vehiculosResponse.data || []

                const marcasMap = new Map()

                vehiculos.forEach(vehiculo => {
                    if (vehiculo?.modelo_auto?.marca && vehiculo?.modelo_auto?.modelo) {
                        const marca = vehiculo.modelo_auto.marca
                        const modelo = vehiculo.modelo_auto.modelo
                        const marcaId = vehiculo.modelo_auto.marca_id || marca
                        const modeloId = vehiculo.modelo_id || `${marca}-${modelo}`.toLowerCase()

                        // Crear entrada de marca si no existe
                        if (!marcasMap.has(marca)) {
                            marcasMap.set(marca, {
                                id: marcaId,
                                marca: marca,
                                modelos: []
                            })
                        }

                        // Agregar modelo si no existe
                        const marcaData = marcasMap.get(marca)
                        const modeloExiste = marcaData.modelos.some(m => m.modelo === modelo)
                        
                        if (!modeloExiste) {
                            marcaData.modelos.push({
                                id: modeloId,
                                modelo: modelo,
                                versiones: []
                            })
                        }
                    }
                })

                const marcasArray = Array.from(marcasMap.values())
                    .sort((a, b) => a.marca.localeCompare(b.marca))

                console.log("✅ Marcas y modelos extraídos desde vehículos:", marcasArray.length, "marcas")

                return {
                    success: true,
                    marcas: marcasArray,
                    message: "Marcas y modelos extraídos desde vehículos"
                }
            } catch (fallbackError) {
                console.warn("⚠️ Error extrayendo desde vehículos, usando fallback básico:", fallbackError.message)

                // Fallback básico: estructura simple para testing con IDs
                const marcasBasicas = [
                    {
                        id: "1",
                        marca: "Toyota",
                        modelos: [
                            { id: "1-1", modelo: "Corolla", versiones: ["XEI", "XLI", "SEG"] },
                            { id: "1-2", modelo: "Camry", versiones: ["LE", "SE", "XSE"] },
                            { id: "1-3", modelo: "RAV4", versiones: ["LE", "XLE", "Adventure"] }
                        ]
                    },
                    {
                        id: "2",
                        marca: "Honda", 
                        modelos: [
                            { id: "2-1", modelo: "Civic", versiones: ["LX", "EX", "Sport"] },
                            { id: "2-2", modelo: "Accord", versiones: ["LX", "Sport", "Touring"] },
                            { id: "2-3", modelo: "CR-V", versiones: ["LX", "EX", "EX-L"] }
                        ]
                    },
                    {
                        id: "3",
                        marca: "Ford",
                        modelos: [
                            { id: "3-1", modelo: "Focus", versiones: ["S", "SE", "Titanium"] },
                            { id: "3-2", modelo: "Fiesta", versiones: ["S", "SE", "ST"] },
                            { id: "3-3", modelo: "EcoSport", versiones: ["S", "SE", "Titanium"] }
                        ]
                    }
                ]

                return {
                    success: true,
                    marcas: marcasBasicas,
                    message: "Marcas y modelos obtenidos desde fallback básico"
                }
            }
        }
    }

    /**
     * Obtener marcas disponibles que tienen vehículos (desde nuevo endpoint)
     * @returns {Promise<Object>} Lista de marcas
     */
    async getMarcas() {
        try {
            console.log("🚗 Obteniendo marcas desde API")

            const response = await apiClient.get("/api/vehiculos/filtros/marcas")

            return {
                success: true,
                marcas: response.marcas || response.data || [],
                message: response.message || "Marcas obtenidas exitosamente"
            }
        } catch (error) {
            console.warn("⚠️ Endpoint de marcas no disponible, usando fallback básico:", error.message)

            // Fallback básico: lista estática de marcas comunes
            try {
                const marcasComunes = [
                    "Toyota", "Honda", "Ford", "Chevrolet", "Volkswagen", 
                    "Nissan", "Hyundai", "Kia", "Mazda", "BMW", 
                    "Mercedes-Benz", "Audi", "Peugeot", "Renault", "Fiat"
                ]

                return {
                    success: true,
                    marcas: marcasComunes,
                    message: "Marcas obtenidas desde fallback"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback:", fallbackError)
                throw new Error("Error al obtener las marcas")
            }
        }
    }

    /**
     * Obtener modelos disponibles, opcionalmente filtrados por marca
     * @param {string} marcaId - ID o nombre de la marca (opcional)
     * @returns {Promise<Object>} Lista de modelos
     */
    async getModelos(marcaId = null) {
        try {
            console.log("🚗 Obteniendo modelos desde API", marcaId ? `para marca: ${marcaId}` : "")

            const url = marcaId ? `/api/vehiculos/filtros/modelos?marcaId=${marcaId}` : "/api/vehiculos/filtros/modelos"
            const response = await apiClient.get(url)

            return {
                success: true,
                modelos: response.modelos || response.data || [],
                message: response.message || "Modelos obtenidos exitosamente"
            }
        } catch (error) {
            console.warn("⚠️ Endpoint de modelos no disponible, usando fallback:", error.message)

            // Fallback: construir desde vehículos existentes
            try {
                const vehiculosResponse = await this.getVehiculos({ limit: 200 })

                if (vehiculosResponse.success && vehiculosResponse.vehiculos) {
                    const modelosMap = new Map()

                    vehiculosResponse.vehiculos.forEach((vehiculo) => {
                        const marca = vehiculo?.modelo_auto?.marca
                        const modelo = vehiculo?.modelo_auto?.modelo
                        const modeloId = vehiculo?.modelo_id

                        if (marca && modelo && (!marcaId || marca.toLowerCase() === marcaId.toLowerCase())) {
                            const key = `${marca}-${modelo}`
                            if (!modelosMap.has(key)) {
                                modelosMap.set(key, {
                                    id: modeloId || key,
                                    nombre: modelo,
                                    marca: marca
                                })
                            }
                        }
                    })

                    const modelos = Array.from(modelosMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))

                    return {
                        success: true,
                        modelos: modelos,
                        message: "Modelos obtenidos desde fallback"
                    }
                }

                return {
                    success: true,
                    modelos: [],
                    message: "No se encontraron modelos"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback de modelos:", fallbackError)
                throw new Error(fallbackError.message || "Error al obtener los modelos")
            }
        }
    }

    /**
     * Obtener modelos de una marca específica (usando endpoint optimizado)
     * @param {string} marca - Nombre de la marca
     * @returns {Promise<Object>} Lista de modelos
     */
    async getModelosByMarca(marca) {
        if (!marca) {
            return {
                success: true,
                modelos: [],
                message: "Marca no especificada"
            }
        }

        try {
            console.log("🚗 Obteniendo modelos para marca:", marca)

            // Usar el endpoint específico de modelos con filtro de marca
            const response = await this.getModelos(marca)

            return response
        } catch (error) {
            console.error("❌ Error al obtener modelos:", error)
            throw new Error(error.message || `Error al obtener modelos de ${marca}`)
        }
    }

    /**
     * Obtener años únicos disponibles para filtros (desde nuevo endpoint)
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
            console.warn("⚠️ Endpoint de años no disponible, usando fallback básico:", error.message)

            // Fallback básico: generar rango de años sin llamar a API
            try {
                const currentYear = new Date().getFullYear()
                const años = []
                for (let year = currentYear; year >= currentYear - 30; year--) {
                    años.push(year)
                }

                return {
                    success: true,
                    años: años,
                    message: "Años generados desde fallback"
                }
            } catch (fallbackError) {
                console.error("❌ Error en fallback de años:", fallbackError)
                throw new Error("Error al obtener los años disponibles")
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
