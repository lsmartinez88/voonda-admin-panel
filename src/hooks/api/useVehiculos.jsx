import { useState, useEffect, useCallback } from 'react'
import apiClient from '../../services/api/apiClient'

export const useVehiculos = () => {
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        pages: 0
    })

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        orderBy: 'created_at',
        order: 'desc',
        search: '',
        estado_codigo: '',
        yearFrom: '',
        yearTo: '',
        priceFrom: '',
        priceTo: ''
    })

    const loadVehiculos = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('🚗 Cargando vehículos con filtros:', filters)

            // Construir query params
            const params = new URLSearchParams()

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    params.append(key, value)
                }
            })

            const queryString = params.toString()
            const url = `/api/vehiculos${queryString ? `?${queryString}` : ''}`

            console.log('📡 URL de la API:', url)

            const response = await apiClient.get(url)

            console.log('✅ Respuesta de vehículos:', response)

            if (response.success) {
                setVehiculos(response.vehiculos || [])
                setPagination(response.pagination || {
                    total: 0,
                    page: 1,
                    limit: 12,
                    pages: 0
                })
            } else {
                throw new Error(response.message || 'Error cargando vehículos')
            }

        } catch (err) {
            console.error('❌ Error al cargar vehículos:', err)
            setError(err.message || 'Error desconocido')
            setVehiculos([])
        } finally {
            setLoading(false)
        }
    }, [filters])

    const updateFilters = useCallback((newFilters) => {
        console.log('🔄 Actualizando filtros:', newFilters)
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }))
    }, [])

    const changePage = useCallback((newPage) => {
        updateFilters({ page: newPage })
    }, [updateFilters])

    const refresh = useCallback(() => {
        loadVehiculos()
    }, [loadVehiculos])

    const resetFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: 12,
            orderBy: 'created_at',
            order: 'desc',
            search: '',
            estado_codigo: '',
            yearFrom: '',
            yearTo: '',
            priceFrom: '',
            priceTo: ''
        })
    }, [])

    const crearVehiculo = useCallback(async (vehiculoData) => {
        try {
            console.log('🆕 Creando vehículo:', vehiculoData)
            const response = await apiClient.post('/api/vehiculos', vehiculoData)

            if (response.success) {
                console.log('✅ Vehículo creado:', response.vehiculo)
                await refresh()
                return response.vehiculo
            } else {
                throw new Error(response.message || 'Error creando vehículo')
            }
        } catch (err) {
            console.error('❌ Error al crear vehículo:', err)
            throw err
        }
    }, [refresh])

    const actualizarVehiculo = useCallback(async (id, vehiculoData) => {
        try {
            console.log('🔄 Actualizando vehículo:', id, vehiculoData)
            const response = await apiClient.put(`/api/vehiculos/${id}`, vehiculoData)

            if (response.success) {
                console.log('✅ Vehículo actualizado:', response.vehiculo)
                await refresh()
                return response.vehiculo
            } else {
                throw new Error(response.message || 'Error actualizando vehículo')
            }
        } catch (err) {
            console.error('❌ Error al actualizar vehículo:', err)
            throw err
        }
    }, [refresh])

    const eliminarVehiculo = useCallback(async (id) => {
        try {
            console.log('🗑️ Eliminando vehículo:', id)
            const response = await apiClient.delete(`/api/vehiculos/${id}`)

            if (response.success) {
                console.log('✅ Vehículo eliminado')
                await refresh()
                return true
            } else {
                throw new Error(response.message || 'Error eliminando vehículo')
            }
        } catch (err) {
            console.error('❌ Error al eliminar vehículo:', err)
            throw err
        }
    }, [refresh])

    useEffect(() => {
        loadVehiculos()
    }, [loadVehiculos])

    return {
        vehiculos,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        changePage,
        refresh,
        resetFilters,
        crearVehiculo,
        actualizarVehiculo,
        eliminarVehiculo
    }
}

export default useVehiculos