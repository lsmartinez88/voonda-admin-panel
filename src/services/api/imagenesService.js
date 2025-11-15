import apiClient, { makeApiRequest } from "./apiClient"

/**
 * Servicio para manejo de imágenes de vehículos
 */
class ImagenesService {
    /**
     * Obtener todas las imágenes con filtros
     * @param {Object} options - Opciones de consulta
     * @param {string} options.vehiculo_id - ID del vehículo para filtrar
     * @param {number} options.page - Número de página (default: 1)
     * @param {number} options.limit - Límite de resultados por página (default: 12)
     * @returns {Promise<Object>} Lista de imágenes con paginación
     */
    async getImagenes(options = {}) {
        const params = new URLSearchParams()

        // Agregar parámetros solo si tienen valor
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        const url = queryString ? `/api/imagenes?${queryString}` : "/api/imagenes"

        return makeApiRequest(() => apiClient.get(url), "Error al obtener la lista de imágenes")
    }

    /**
     * Obtener todas las imágenes de un vehículo específico
     * @param {string} vehiculoId - ID del vehículo
     * @returns {Promise<Object>} Lista de imágenes del vehículo
     */
    async getImagenesByVehiculo(vehiculoId) {
        if (!vehiculoId) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        return makeApiRequest(() => apiClient.get(`/api/vehiculos/${vehiculoId}/imagenes`), "Error al obtener las imágenes del vehículo")
    }

    /**
     * Agregar nueva imagen a un vehículo
     * @param {Object} imagenData - Datos de la imagen
     * @returns {Promise<Object>} Imagen creada
     */
    async createImagen(imagenData) {
        if (!imagenData) {
            return { success: false, error: "Datos de la imagen son requeridos" }
        }

        // Validar campos requeridos
        if (!imagenData.vehiculo_id) {
            return { success: false, error: "vehiculo_id es requerido" }
        }

        if (!imagenData.url) {
            return { success: false, error: "url es requerida" }
        }

        return makeApiRequest(() => apiClient.post("/api/imagenes", imagenData), "Error al crear la imagen")
    }

    /**
     * Actualizar una imagen existente
     * @param {string} id - ID de la imagen a actualizar
     * @param {Object} imagenData - Datos a actualizar
     * @returns {Promise<Object>} Imagen actualizada
     */
    async updateImagen(id, imagenData) {
        if (!id) {
            return { success: false, error: "ID de la imagen es requerido" }
        }

        if (!imagenData || Object.keys(imagenData).length === 0) {
            return { success: false, error: "Datos a actualizar son requeridos" }
        }

        return makeApiRequest(() => apiClient.put(`/api/imagenes/${id}`, imagenData), `Error al actualizar la imagen con ID: ${id}`)
    }

    /**
     * Eliminar una imagen
     * @param {string} id - ID de la imagen a eliminar
     * @returns {Promise<Object>} Confirmación de eliminación
     */
    async deleteImagen(id) {
        if (!id) {
            return { success: false, error: "ID de la imagen es requerido" }
        }

        return makeApiRequest(() => apiClient.delete(`/api/imagenes/${id}`), `Error al eliminar la imagen con ID: ${id}`)
    }

    /**
     * Establecer una imagen como principal
     * @param {string} id - ID de la imagen a establecer como principal
     * @returns {Promise<Object>} Confirmación de la operación
     */
    async setImagenPrincipal(id) {
        if (!id) {
            return { success: false, error: "ID de la imagen es requerido" }
        }

        return makeApiRequest(() => apiClient.patch(`/api/imagenes/${id}/principal`), `Error al establecer la imagen como principal: ${id}`)
    }

    /**
     * Validar datos de imagen antes de enviar
     * @param {Object} imagenData - Datos de la imagen a validar
     * @returns {Object} Resultado de la validación
     */
    validateImagenData(imagenData) {
        const errors = []

        if (!imagenData.vehiculo_id) {
            errors.push("El ID del vehículo es requerido")
        }

        if (!imagenData.url) {
            errors.push("La URL de la imagen es requerida")
        } else if (!this.isValidUrl(imagenData.url)) {
            errors.push("La URL de la imagen no es válida")
        }

        if (imagenData.descripcion && imagenData.descripcion.length > 500) {
            errors.push("La descripción no puede tener más de 500 caracteres")
        }

        if (imagenData.orden && (imagenData.orden < 1 || !Number.isInteger(imagenData.orden))) {
            errors.push("El orden debe ser un número entero positivo")
        }

        if (imagenData.es_principal !== undefined && typeof imagenData.es_principal !== "boolean") {
            errors.push("El campo es_principal debe ser verdadero o falso")
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
     * Reordenar imágenes de un vehículo
     * @param {string} vehiculoId - ID del vehículo
     * @param {Array} ordenImagenes - Array con el nuevo orden de las imágenes
     * @returns {Promise<Object>} Resultado de la operación
     */
    async reordenarImagenes(vehiculoId, ordenImagenes) {
        if (!vehiculoId) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        if (!Array.isArray(ordenImagenes)) {
            return { success: false, error: "El orden de imágenes debe ser un array" }
        }

        const promises = ordenImagenes.map((imagenId, index) => {
            return this.updateImagen(imagenId, { orden: index + 1 })
        })

        try {
            const resultados = await Promise.all(promises)
            const errores = resultados.filter((result) => !result.success)

            if (errores.length > 0) {
                return { success: false, error: "Error al reordenar algunas imágenes", errores }
            }

            return { success: true, message: "Imágenes reordenadas exitosamente" }
        } catch (error) {
            return { success: false, error: "Error al reordenar las imágenes" }
        }
    }

    /**
     * Obtener la imagen principal de un vehículo
     * @param {string} vehiculoId - ID del vehículo
     * @returns {Promise<Object>} Imagen principal o null
     */
    async getImagenPrincipal(vehiculoId) {
        const response = await this.getImagenesByVehiculo(vehiculoId)

        if (response.success && response.imagenes) {
            const imagenPrincipal = response.imagenes.find((img) => img.es_principal)
            return imagenPrincipal || null
        }

        return null
    }

    /**
     * Subir múltiples imágenes
     * @param {string} vehiculoId - ID del vehículo
     * @param {Array} imagenes - Array de objetos con datos de imágenes
     * @returns {Promise<Object>} Resultado de la operación
     */
    async uploadMultipleImagenes(vehiculoId, imagenes) {
        if (!vehiculoId) {
            return { success: false, error: "ID del vehículo es requerido" }
        }

        if (!Array.isArray(imagenes) || imagenes.length === 0) {
            return { success: false, error: "Se requiere al menos una imagen" }
        }

        // Agregar vehiculo_id a cada imagen
        const imagenesConVehiculo = imagenes.map((img) => ({
            ...img,
            vehiculo_id: vehiculoId
        }))

        const promises = imagenesConVehiculo.map((imagen) => this.createImagen(imagen))

        try {
            const resultados = await Promise.all(promises)
            const errores = resultados.filter((result) => !result.success)

            if (errores.length > 0) {
                return {
                    success: false,
                    error: "Error al subir algunas imágenes",
                    errores,
                    exitos: resultados.filter((result) => result.success)
                }
            }

            return {
                success: true,
                message: "Imágenes subidas exitosamente",
                imagenes: resultados
            }
        } catch (error) {
            return { success: false, error: "Error al subir las imágenes" }
        }
    }
}

// Crear una instancia única del servicio
const imagenesService = new ImagenesService()

export default imagenesService
