import { useState, useEffect, useCallback } from "react"
import { vehiculosService } from "@/services/api"

/**
 * Hook para manejar operaciones con vehículos
 */
export const useVehiculos = (initialFilters = {}) => {
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        pages: 0
    })

    // Filtros aplicados actualmente
    const [filters, setFilters] = useState(() => vehiculosService.getDefaultFilters(initialFilters))

    // Cargar vehículos
    const loadVehiculos = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true)
            setError(null)

            console.log("useVehiculos - loadVehiculos called with:", customFilters)
            const result = await vehiculosService.getVehiculos(customFilters)
            console.log("useVehiculos - API response:", result)

            if (result.success) {
                // Manejar ambas estructuras de respuesta
                const vehiculosData = result.data?.vehiculos || result.vehiculos || []
                const paginationData = result.data?.pagination || result.pagination || {}

                console.log("useVehiculos - vehiculos extracted:", vehiculosData)
                console.log("useVehiculos - pagination extracted:", paginationData)

                setVehiculos(vehiculosData)
                setPagination(paginationData)
            } else {
                throw new Error(result.error || "Error al cargar vehículos")
            }
        } catch (err) {
            console.error("useVehiculos - Error loading vehicles:", err)
            setError(err.message)
            setVehiculos([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar vehículos al montar el componente
    useEffect(() => {
        console.log("useVehiculos - useEffect triggered with filters:", filters)
        loadVehiculos(filters)
    }, [loadVehiculos, filters])

    // Actualizar filtros y recargar
    const updateFilters = useCallback(
        (newFilters) => {
            // Solo resetear a página 1 si no se está pasando explícitamente una página
            const updatedFilters = {
                ...filters,
                ...newFilters,
                ...(newFilters.page === undefined && { page: 1 })
            }
            setFilters(updatedFilters)
        },
        [filters]
    )

    // Cambiar página
    const changePage = useCallback(
        (page) => {
            const updatedFilters = { ...filters, page }
            setFilters(updatedFilters)
        },
        [filters]
    )

    // Refrescar lista
    const refresh = useCallback(() => {
        loadVehiculos(filters)
    }, [loadVehiculos, filters])

    // Limpiar filtros
    const clearFilters = useCallback(() => {
        const defaultFilters = vehiculosService.getDefaultFilters()
        setFilters(defaultFilters)
    }, [])

    return {
        vehiculos,
        loading,
        error,
        pagination,
        filters,
        loadVehiculos,
        updateFilters,
        changePage,
        refresh,
        clearFilters
    }
}

/**
 * Hook para manejar un vehículo específico
 */
export const useVehiculo = (vehiculoId) => {
    const [vehiculo, setVehiculo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Cargar vehículo por ID
    const loadVehiculo = useCallback(
        async (id = vehiculoId) => {
            if (!id) return

            try {
                setLoading(true)
                setError(null)

                const result = await vehiculosService.getVehiculoById(id)

                if (result.success && result.data) {
                    // La estructura de la API ya incluye modelo_auto con toda la información
                    setVehiculo(result.data.vehiculo)
                } else {
                    throw new Error(result.error || "Error al cargar el vehículo")
                }
            } catch (err) {
                setError(err.message)
                setVehiculo(null)
            } finally {
                setLoading(false)
            }
        },
        [vehiculoId]
    )

    // Crear nuevo vehículo
    const createVehiculo = useCallback(async (vehiculoData) => {
        try {
            setLoading(true)
            setError(null)

            // Validar datos antes de enviar
            const validation = vehiculosService.validateVehiculoData(vehiculoData)
            if (!validation.isValid) {
                throw new Error(validation.errors.join(", "))
            }

            const result = await vehiculosService.createVehiculo(vehiculoData)

            if (result.success && result.data) {
                setVehiculo(result.data.vehiculo)
                return { success: true, vehiculo: result.data.vehiculo }
            } else {
                throw new Error(result.error || "Error al crear el vehículo")
            }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // Actualizar vehículo
    const updateVehiculo = useCallback(async (id, vehiculoData) => {
        try {
            setLoading(true)
            setError(null)

            const result = await vehiculosService.updateVehiculo(id, vehiculoData)

            if (result.success && result.data) {
                setVehiculo(result.data.vehiculo)
                return { success: true, vehiculo: result.data.vehiculo }
            } else {
                throw new Error(result.error || "Error al actualizar el vehículo")
            }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // Eliminar vehículo
    const deleteVehiculo = useCallback(async (id) => {
        try {
            setLoading(true)
            setError(null)

            const result = await vehiculosService.deleteVehiculo(id)

            if (result.success) {
                return { success: true }
            } else {
                throw new Error(result.error || "Error al eliminar el vehículo")
            }
        } catch (err) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar vehículo al montar o cambiar ID
    useEffect(() => {
        if (vehiculoId) {
            loadVehiculo(vehiculoId)
        }
    }, [vehiculoId, loadVehiculo])

    return {
        vehiculo,
        loading,
        error,
        loadVehiculo,
        createVehiculo,
        updateVehiculo,
        deleteVehiculo
    }
}
