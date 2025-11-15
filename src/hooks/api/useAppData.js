import { useState, useEffect, useCallback } from "react"
import { vehiculosService } from "@/services/api"

/**
 * Hook para manejar los estados de vehículos
 */
export const useEstados = () => {
    const [estados, setEstados] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Cargar estados
    const loadEstados = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await vehiculosService.getEstados()

            if (result.success && result.data) {
                setEstados(result.data.estados || [])
            } else {
                throw new Error(result.error || "Error al cargar los estados")
            }
        } catch (err) {
            setError(err.message)
            setEstados([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar estados al montar el componente
    useEffect(() => {
        loadEstados()
    }, [loadEstados])

    // Obtener estado por código
    const getEstadoByCodigo = useCallback(
        (codigo) => {
            return estados.find((estado) => estado.codigo === codigo) || null
        },
        [estados]
    )

    // Obtener estado por ID
    const getEstadoById = useCallback(
        (id) => {
            return estados.find((estado) => estado.id === id) || null
        },
        [estados]
    )

    // Obtener opciones para select/dropdown
    const getEstadosOptions = useCallback(() => {
        return estados.map((estado) => ({
            value: estado.codigo,
            label: estado.nombre,
            description: estado.descripcion,
            id: estado.id
        }))
    }, [estados])

    return {
        estados,
        loading,
        error,
        loadEstados,
        getEstadoByCodigo,
        getEstadoById,
        getEstadosOptions
    }
}

/**
 * Hook para manejar configuraciones y datos auxiliares
 */
export const useAppData = () => {
    const [appData, setAppData] = useState({
        estados: [],
        marcas: [], // Podría expandirse para obtener marcas de la API
        modelos: [] // Podría expandirse para obtener modelos de la API
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Cargar todos los datos auxiliares
    const loadAppData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            // Por ahora solo cargar estados, pero se puede expandir
            const estadosResult = await vehiculosService.getEstados()

            if (estadosResult.success) {
                setAppData((prev) => ({
                    ...prev,
                    estados: estadosResult.data.estados || []
                }))
            } else {
                throw new Error("Error al cargar datos de la aplicación")
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar datos al montar
    useEffect(() => {
        loadAppData()
    }, [loadAppData])

    return {
        appData,
        loading,
        error,
        loadAppData
    }
}
