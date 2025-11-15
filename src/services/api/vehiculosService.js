import apiClient, { makeApiRequest } from "./apiClient"

// Datos ficticios para desarrollo cuando la API no está disponible
const mockVehiculos = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        año: 2022,
        patente: "ABC123",
        kilometros: 15000,
        valor: 25000,
        estado: "Disponible",
        observaciones: "Excelente estado",
        fecha_ingreso: "2024-01-15"
    },
    {
        id: 2,
        marca: "Ford",
        modelo: "Focus",
        año: 2021,
        patente: "DEF456",
        kilometros: 22000,
        valor: 22000,
        estado: "Vendido",
        observaciones: "Menor desgaste",
        fecha_ingreso: "2024-02-10"
    },
    {
        id: 3,
        marca: "Chevrolet",
        modelo: "Cruze",
        año: 2023,
        patente: "GHI789",
        kilometros: 8000,
        valor: 28000,
        estado: "Reservado",
        observaciones: "Como nuevo",
        fecha_ingreso: "2024-03-05"
    }
];

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
        try {
            const params = new URLSearchParams()

            // Agregar parámetros solo si tienen valor
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value)
                }
            })

            const queryString = params.toString()
            const url = queryString ? `/api/vehiculos?${queryString}` : "/api/vehiculos"

            const result = await makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de vehículos")
            
            // Si la API funciona, devolver el resultado
            if (result.success) {
                return result;
            }
            
            // Si falla, usar datos mockeados
            console.warn("🔄 API no disponible, usando datos de desarrollo...");
            return this.getMockVehiculos(options);
            
        } catch (error) {
            // En caso de error, usar datos mockeados
            console.warn("🔄 Error con API, usando datos de desarrollo:", error.message);
            return this.getMockVehiculos(options);
        }
    }

    /**
     * Obtener datos mockeados de vehículos para desarrollo
     * @param {Object} options - Opciones de consulta
     * @returns {Object} Datos mockeados con estructura similar a la API
     */
    getMockVehiculos(options = {}) {
        let filteredVehiculos = [...mockVehiculos];

        // Aplicar filtro de búsqueda si existe
        if (options.search) {
            const searchTerm = options.search.toLowerCase();
            filteredVehiculos = filteredVehiculos.filter(vehiculo => 
                vehiculo.marca.toLowerCase().includes(searchTerm) ||
                vehiculo.modelo.toLowerCase().includes(searchTerm) ||
                vehiculo.patente.toLowerCase().includes(searchTerm)
            );
        }

        // Aplicar filtro por marca si existe
        if (options.marca) {
            filteredVehiculos = filteredVehiculos.filter(vehiculo => 
                vehiculo.marca.toLowerCase() === options.marca.toLowerCase()
            );
        }

        // Aplicar filtro por modelo si existe
        if (options.modelo) {
            filteredVehiculos = filteredVehiculos.filter(vehiculo => 
                vehiculo.modelo.toLowerCase() === options.modelo.toLowerCase()
            );
        }

        // Aplicar filtro por estado si existe
        if (options.estado) {
            filteredVehiculos = filteredVehiculos.filter(vehiculo => 
                vehiculo.estado.toLowerCase() === options.estado.toLowerCase()
            );
        }

        // Aplicar ordenamiento
        const sortBy = options.sortBy || 'fecha_ingreso';
        const order = options.order || 'desc';
        
        filteredVehiculos.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            // Convertir fechas para comparación
            if (sortBy === 'fecha_ingreso') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (order === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });

        // Aplicar paginación
        const page = options.page || 1;
        const limit = options.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVehiculos = filteredVehiculos.slice(startIndex, endIndex);

        return {
            success: true,
            vehiculos: paginatedVehiculos,
            data: paginatedVehiculos, // Por compatibilidad
            total: filteredVehiculos.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(filteredVehiculos.length / limit)
        };
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

        try {
            const result = await makeApiRequest(() => apiClient.post("/api/vehiculos", vehiculoData), "Error al crear el vehículo")
            
            if (result.success) {
                return result;
            }
            
            // Fallback para desarrollo
            console.warn("🔄 API no disponible, simulando creación de vehículo...");
            
            const nuevoVehiculo = {
                id: Date.now(), // ID temporal
                ...vehiculoData,
                fecha_ingreso: new Date().toISOString().split('T')[0]
            };
            
            // Agregar a los datos mock (solo en memoria)
            mockVehiculos.push(nuevoVehiculo);
            
            return {
                success: true,
                vehiculo: nuevoVehiculo,
                message: "Vehículo creado correctamente (modo desarrollo)"
            };
            
        } catch (error) {
            console.warn("🔄 Error con API, simulando creación:", error.message);
            
            const nuevoVehiculo = {
                id: Date.now(),
                ...vehiculoData,
                fecha_ingreso: new Date().toISOString().split('T')[0]
            };
            
            mockVehiculos.push(nuevoVehiculo);
            
            return {
                success: true,
                vehiculo: nuevoVehiculo,
                message: "Vehículo creado correctamente (modo desarrollo)"
            };
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
            return { success: false, error: "ID del vehículo es requerido" }
        }

        if (!vehiculoData || Object.keys(vehiculoData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        try {
            const result = await makeApiRequest(() => apiClient.put(`/api/vehiculos/${id}`, vehiculoData), `Error al actualizar el vehículo con ID: ${id}`)
            
            if (result.success) {
                return result;
            }
            
            // Fallback para desarrollo
            console.warn("🔄 API no disponible, simulando actualización de vehículo...");
            
            const index = mockVehiculos.findIndex(v => v.id == id);
            if (index !== -1) {
                mockVehiculos[index] = { ...mockVehiculos[index], ...vehiculoData };
                return {
                    success: true,
                    vehiculo: mockVehiculos[index],
                    message: "Vehículo actualizado correctamente (modo desarrollo)"
                };
            }
            
            return { success: false, error: "Vehículo no encontrado" };
            
        } catch (error) {
            console.warn("🔄 Error con API, simulando actualización:", error.message);
            
            const index = mockVehiculos.findIndex(v => v.id == id);
            if (index !== -1) {
                mockVehiculos[index] = { ...mockVehiculos[index], ...vehiculoData };
                return {
                    success: true,
                    vehiculo: mockVehiculos[index],
                    message: "Vehículo actualizado correctamente (modo desarrollo)"
                };
            }
            
            return { success: false, error: "Vehículo no encontrado" };
        }
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

        try {
            const result = await makeApiRequest(() => apiClient.delete(`/api/vehiculos/${id}`), `Error al eliminar el vehículo con ID: ${id}`)
            
            if (result.success) {
                return result;
            }
            
            // Fallback para desarrollo
            console.warn("🔄 API no disponible, simulando eliminación de vehículo...");
            
            const index = mockVehiculos.findIndex(v => v.id == id);
            if (index !== -1) {
                mockVehiculos.splice(index, 1);
                return {
                    success: true,
                    message: "Vehículo eliminado correctamente (modo desarrollo)"
                };
            }
            
            return { success: false, error: "Vehículo no encontrado" };
            
        } catch (error) {
            console.warn("🔄 Error con API, simulando eliminación:", error.message);
            
            const index = mockVehiculos.findIndex(v => v.id == id);
            if (index !== -1) {
                mockVehiculos.splice(index, 1);
                return {
                    success: true,
                    message: "Vehículo eliminado correctamente (modo desarrollo)"
                };
            }
            
            return { success: false, error: "Vehículo no encontrado" };
        }
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
