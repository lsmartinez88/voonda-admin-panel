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

        const response = await makeApiRequest(() => apiClient.get("/api/estados"), "Error al obtener los estados de vehículos")

        // Guardar en cache si la respuesta es exitosa
        if (response.success && response.estados) {
            this.estadosCache = response.estados
            this.cacheExpiry = Date.now() + this.cacheTimeout
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
