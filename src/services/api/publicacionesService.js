import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de publicaciones de vehículos
 */
class PublicacionesService {
    /**
     * Obtener todas las publicaciones de un vehículo
     * @param {string} vehiculoId - ID del vehículo
     * @returns {Promise<Object>} Lista de publicaciones
     */
    async getPublicacionesByVehiculo(vehiculoId) {
        if (!vehiculoId) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/vehiculos/${vehiculoId}/publicaciones`), "Error al obtener las publicaciones del vehículo")
    }

    /**
     * Crear nueva publicación para un vehículo
     * @param {string} vehiculoId - ID del vehículo
     * @param {Object} publicacionData - Datos de la publicación
     * @returns {Promise<Object>} Publicación creada
     */
    async createPublicacion(vehiculoId, publicacionData) {
        if (!vehiculoId) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        if (!publicacionData) {
            return { success: false, error: "Datos de la publicación son requeridos" }
        }

        // Validar campos requeridos
        if (!publicacionData.plataforma) {
            return { success: false, error: "La plataforma es requerida" }
        }

        if (!publicacionData.titulo) {
            return { success: false, error: "El título es requerido" }
        }

        return makeApiRequest(() => apiClient.post(`/api/vehiculos/${vehiculoId}/publicaciones`, publicacionData), "Error al crear la publicación")
    }

    /**
     * Actualizar una publicación existente
     * @param {string} publicacionId - ID de la publicación
     * @param {Object} publicacionData - Datos a actualizar
     * @returns {Promise<Object>} Publicación actualizada
     */
    async updatePublicacion(publicacionId, publicacionData) {
        if (!publicacionId) {
            return { success: false, error: "ID de la publicación es requerido" }
        }

        if (!publicacionData || Object.keys(publicacionData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/publicaciones/${publicacionId}`, publicacionData), "Error al actualizar la publicación")
    }

    /**
     * Eliminar una publicación (soft delete)
     * @param {string} publicacionId - ID de la publicación
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deletePublicacion(publicacionId) {
        if (!publicacionId) {
            return { success: false, error: "ID de la publicación es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/publicaciones/${publicacionId}`), "Error al eliminar la publicación")
    }

    /**
     * Validar datos de publicación antes de enviar
     * @param {Object} publicacionData - Datos de la publicación a validar
     * @returns {Object} Resultado de la validación
     */
    validatePublicacionData(publicacionData) {
        const errors = []
        const plataformasValidas = ["facebook", "web", "mercadolibre", "instagram", "whatsapp", "olx", "autocosmos", "otro"]

        if (!publicacionData.plataforma) {
            errors.push("La plataforma es requerida")
        } else if (!plataformasValidas.includes(publicacionData.plataforma)) {
            errors.push("Plataforma no válida")
        }

        if (!publicacionData.titulo) {
            errors.push("El título es requerido")
        } else if (publicacionData.titulo.length > 200) {
            errors.push("El título no puede tener más de 200 caracteres")
        }

        if (publicacionData.url_publicacion && !this.isValidUrl(publicacionData.url_publicacion)) {
            errors.push("La URL de la publicación no es válida")
        }

        if (publicacionData.id_publicacion && publicacionData.id_publicacion.length > 100) {
            errors.push("El ID de la publicación no puede tener más de 100 caracteres")
        }

        if (publicacionData.ficha_breve && publicacionData.ficha_breve.length > 1000) {
            errors.push("La ficha breve no puede tener más de 1000 caracteres")
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Validar si una URL es válida
     * @param {string} url - URL a validar
     * @returns {boolean} Verdadero si la URL es válida
     */
    isValidUrl(url) {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Obtener las plataformas de publicación disponibles
     * @returns {Array} Lista de plataformas con información
     */
    getPlataformasDisponibles() {
        return [
            { value: "facebook", label: "Facebook", color: "primary" },
            { value: "web", label: "Sitio Web", color: "info" },
            { value: "mercadolibre", label: "Mercado Libre", color: "warning" },
            { value: "instagram", label: "Instagram", color: "secondary" },
            { value: "whatsapp", label: "WhatsApp", color: "success" },
            { value: "olx", label: "OLX", color: "default" },
            { value: "autocosmos", label: "AutoCosmos", color: "default" },
            { value: "otro", label: "Otro", color: "default" }
        ]
    }

    /**
     * Obtener información de una plataforma específica
     * @param {string} plataforma - Código de la plataforma
     * @returns {Object} Información de la plataforma
     */
    getInfoPlataforma(plataforma) {
        const plataformas = this.getPlataformasDisponibles()
        return plataformas.find((p) => p.value === plataforma) || { value: plataforma, label: plataforma, color: "default" }
    }
}

// Crear una instancia única del servicio
const publicacionesService = new PublicacionesService()

export default publicacionesService
