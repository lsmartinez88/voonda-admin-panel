import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de estados de vehículos
 */
class EstadosService {
    constructor() {
        this.estadosCache = null
        this.cacheExpiry = null
        this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
    }

    /**
     * Obtener todos los estados de vehículos
     * @param {boolean} forceRefresh - Forzar actualización del cache
     * @returns {Promise<Object>} Lista de estados
     */
    async getEstados(forceRefresh = false) {
        // Verificar si el cache es válido
        if (!forceRefresh && this.estadosCache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            return { success: true, estados: this.estadosCache }
        }

        const response = await makeApiRequest(() => apiClient.get("/api/vehiculos/filtros/estados"), "Error al obtener los estados de vehículos")

        // Guardar en cache si la respuesta es exitosa
        // La API puede devolver estados en response.estados o response.data.estados
        let estados = null
        if (response.success) {
            if (response.estados) {
                estados = response.estados
            } else if (response.data && response.data.estados) {
                estados = response.data.estados
            }

            if (estados) {
                this.estadosCache = estados
                this.cacheExpiry = Date.now() + this.cacheTimeout

                return {
                    success: true,
                    estados: estados,
                    message: response.message || response.data?.message || "Estados obtenidos exitosamente"
                }
            }
        }

        return response
    }

    /**
     * Obtener un estado específico por código
     * @param {string} codigo - Código del estado
     * @returns {Promise<Object>} Estado encontrado o null
     */
    async getEstadoByCodigo(codigo) {
        const response = await this.getEstados()

        if (response.success && response.estados) {
            const estado = response.estados.find((e) => e.codigo === codigo)
            return estado || null
        }

        return null
    }

    /**
     * Obtener un estado específico por ID
     * @param {string} id - ID del estado
     * @returns {Promise<Object>} Estado encontrado o null
     */
    async getEstadoById(id) {
        const response = await this.getEstados()

        if (response.success && response.estados) {
            const estado = response.estados.find((e) => e.id === id)
            return estado || null
        }

        return null
    }

    /**
     * Obtener información de color para un estado específico
     * @param {string} codigo - Código del estado
     * @returns {string} Color para el estado
     */
    getColorEstado(codigo) {
        const colorMap = {
            salon: "success",
            consignacion: "warning",
            pyc: "secondary",
            preparacion: "info",
            vendido: "error",
            entregado: "default"
        }

        return colorMap[codigo] || "default"
    }

    /**
     * Obtener el estado por defecto para nuevos vehículos
     * @returns {Promise<string>} Código del estado por defecto
     */
    async getEstadoDefault() {
        const response = await this.getEstados()

        if (response.success && response.estados) {
            // Buscar específicamente el estado DISPONIBLE
            const estadoDisponible = response.estados.find((e) => e.codigo === "DISPONIBLE")
            if (estadoDisponible) {
                console.log("✅ Estado DISPONIBLE encontrado:", estadoDisponible)
                return "DISPONIBLE"
            }

            // Si no existe DISPONIBLE, buscar alternativas comunes
            const alternativas = ["DISPONIBLE", "SALON", "DISPONIBLE_VENTA"]
            for (const alt of alternativas) {
                const estado = response.estados.find((e) => e.codigo === alt)
                if (estado) {
                    console.log(`✅ Estado alternativo encontrado: ${alt}`, estado)
                    return alt
                }
            }

            // Si no se encuentra ninguna alternativa, usar el primer estado disponible
            if (response.estados.length > 0) {
                const primerEstado = response.estados[0].codigo
                console.warn(`⚠️ Usando primer estado disponible como fallback: ${primerEstado}`)
                return primerEstado
            }
        }

        console.error("❌ No se encontraron estados válidos, usando DISPONIBLE por defecto")
        return "DISPONIBLE" // Fallback final
    }

    /**
     * Verificar si un código de estado es válido
     * @param {string} codigo - Código a validar
     * @returns {boolean} Verdadero si el código es válido
     */
    async isValidEstadoCodigo(codigo) {
        const estados = await this.getEstados()

        if (estados.success && estados.estados) {
            return estados.estados.some((e) => e.codigo === codigo)
        }

        return false
    }

    /**
     * Limpiar cache de estados
     */
    clearCache() {
        this.estadosCache = null
        this.cacheExpiry = null
    }

    /**
     * Obtener lista de estados formateada para select/dropdown
     * @returns {Promise<Array>} Estados formateados
     */
    async getEstadosForSelect() {
        const response = await this.getEstados()

        if (response.success && response.estados) {
            return response.estados.map((estado) => ({
                value: estado.codigo,
                label: estado.nombre,
                id: estado.id,
                descripcion: estado.descripcion,
                color: this.getColorEstado(estado.codigo)
            }))
        }

        return []
    }

    /**
     * Obtener estados agrupados por categoría (opcional, para futuras mejoras)
     * @returns {Promise<Object>} Estados agrupados
     */
    async getEstadosAgrupados() {
        const response = await this.getEstados()

        if (response.success && response.estados) {
            const grupos = {
                disponibles: [],
                procesando: [],
                finalizados: []
            }

            response.estados.forEach((estado) => {
                switch (estado.codigo) {
                    case "salon":
                    case "consignacion":
                        grupos.disponibles.push(estado)
                        break
                    case "pyc":
                    case "preparacion":
                        grupos.procesando.push(estado)
                        break
                    case "vendido":
                    case "entregado":
                        grupos.finalizados.push(estado)
                        break
                    default:
                        grupos.disponibles.push(estado)
                }
            })

            return grupos
        }

        return { disponibles: [], procesando: [], finalizados: [] }
    }
}

// Crear una instancia única del servicio
const estadosService = new EstadosService()

export default estadosService
