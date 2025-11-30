/**
 * FratelliCatalogService
 * Servicio para interactuar con la API de Fratelli Automotores
 * y procesar información del catálogo de vehículos
 */

const API_BASE_URL = "https://api.fratelliautomotores.com.ar/api"

class FratelliCatalogService {
    /**
     * Obtiene todos los vehículos activos del catálogo
     * @param {number} limit - Límite de vehículos por página (default: 1000)
     * @returns {Promise<Object>} - Resultado con vehículos del catálogo
     */
    static async fetchAllVehicles(limit = 1000) {
        try {
            console.log("📡 Obteniendo catálogo de Fratelli Automotores...")

            let allCars = []
            let currentPage = 1
            let totalPages = 1

            // Primera llamada para obtener información de paginación
            const firstResponse = await fetch(`${API_BASE_URL}/cars?page=${currentPage}&limit=${limit}&sort=position:desc`)

            if (!firstResponse.ok) {
                throw new Error(`Error en API: ${firstResponse.status} ${firstResponse.statusText}`)
            }

            const firstData = await firstResponse.json()
            totalPages = firstData.totalPages || 1

            // Filtrar solo vehículos activos
            const activeCars = firstData.cars.filter((car) => car.active === true)
            allCars = [...activeCars]

            console.log(`📄 Página 1/${totalPages}: ${activeCars.length} vehículos activos`)

            // Si hay más páginas, obtenerlas
            if (totalPages > 1) {
                for (let page = 2; page <= totalPages; page++) {
                    const response = await fetch(`${API_BASE_URL}/cars?page=${page}&limit=${limit}&sort=position:desc`)

                    if (!response.ok) {
                        console.warn(`⚠️ Error obteniendo página ${page}`)
                        continue
                    }

                    const data = await response.json()
                    const pageActiveCars = data.cars.filter((car) => car.active === true)
                    allCars = [...allCars, ...pageActiveCars]

                    console.log(`📄 Página ${page}/${totalPages}: ${pageActiveCars.length} vehículos activos`)
                }
            }

            console.log(`✅ Total de vehículos activos obtenidos: ${allCars.length}`)

            return {
                success: true,
                data: allCars,
                stats: {
                    total: allCars.length,
                    totalPages: totalPages,
                    activeOnly: true
                }
            }
        } catch (error) {
            console.error("❌ Error obteniendo catálogo:", error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    /**
     * Obtiene el detalle de un vehículo específico
     * @param {string} vehicleId - ID del vehículo
     * @returns {Promise<Object>} - Detalle del vehículo
     */
    static async fetchVehicleDetail(vehicleId) {
        try {
            const response = await fetch(`${API_BASE_URL}/cars/${vehicleId}`)

            if (!response.ok) {
                throw new Error(`Error obteniendo detalle: ${response.status}`)
            }

            const data = await response.json()
            return {
                success: true,
                data: data
            }
        } catch (error) {
            console.error(`❌ Error obteniendo detalle de vehículo ${vehicleId}:`, error)
            return {
                success: false,
                error: error.message,
                data: null
            }
        }
    }

    /**
     * Extrae la versión del vehículo desde la descripción
     * Ejemplo: "FORD TERRITORY TITANIUM – 2023" → versión: "TITANIUM"
     * @param {Object} vehicle - Objeto del vehículo con brand, model, year y description
     * @returns {string} - Versión extraída o cadena vacía
     */
    static extractVersion(vehicle) {
        try {
            if (!vehicle.description) {
                return ""
            }

            const description = vehicle.description.toUpperCase().trim()
            const brand = (vehicle.brand || "").toUpperCase().trim()
            const model = (vehicle.model || "").toUpperCase().trim()
            const year = String(vehicle.year || "").trim()

            // Buscar la primera línea de la descripción (generalmente contiene marca, modelo, versión y año)
            const firstLine = description.split("\n")[0].split("\r")[0].trim()

            // Remover emojis y caracteres especiales al inicio
            let cleanLine = firstLine.replace(/^[^\w\s]+/, "").trim()

            // Remover marca si está al inicio
            if (brand && cleanLine.startsWith(brand)) {
                cleanLine = cleanLine.substring(brand.length).trim()
            }

            // Remover modelo si está al inicio
            if (model) {
                // El modelo puede estar con o sin la marca incluida
                const modelWithoutBrand = model.replace(brand, "").trim()
                if (cleanLine.startsWith(model)) {
                    cleanLine = cleanLine.substring(model.length).trim()
                } else if (modelWithoutBrand && cleanLine.startsWith(modelWithoutBrand)) {
                    cleanLine = cleanLine.substring(modelWithoutBrand.length).trim()
                }
            }

            // Remover año si está al final (con o sin guión)
            if (year) {
                cleanLine = cleanLine.replace(new RegExp(`[–-]?\\s*${year}\\s*$`), "").trim()
            }

            // Lo que queda es potencialmente la versión
            let version = cleanLine.trim()

            // Limpiar caracteres especiales al inicio y final
            version = version
                .replace(/^[–-]+/, "")
                .replace(/[–-]+$/, "")
                .trim()

            return version || ""
        } catch (error) {
            console.error("Error extrayendo versión:", error)
            return ""
        }
    }

    /**
     * Procesa un vehículo del catálogo y lo convierte al formato necesario
     * @param {Object} catalogVehicle - Vehículo del catálogo
     * @returns {Object} - Vehículo en formato procesado
     */
    static processCatalogVehicle(catalogVehicle) {
        const version = this.extractVersion(catalogVehicle)
        const thumbnailUrl = catalogVehicle.Images?.[0]?.thumbnailUrl || ""

        return {
            // Datos originales del catálogo
            id: String(catalogVehicle.id).trim(),
            brand: catalogVehicle.brand,
            model: catalogVehicle.model,
            year: catalogVehicle.year,
            price: catalogVehicle.price,
            mileage: catalogVehicle.mileage,
            color: catalogVehicle.color,
            transmission: catalogVehicle.transmission,
            fuel: catalogVehicle.fuel,
            doors: catalogVehicle.doors,
            featured: catalogVehicle.featured,
            favorite: catalogVehicle.favorite,
            category: catalogVehicle.Category?.name || "",
            description: catalogVehicle.description,
            thumbnailUrl: thumbnailUrl,

            // Versión extraída
            version: version,

            // URLs construidas
            publicacion_web: `https://www.fratelliautomotores.com.ar/catalogo/${catalogVehicle.id}`,
            publicacion_api_call: `${API_BASE_URL}/cars/${catalogVehicle.id}`,

            // Estado original para referencia
            active: catalogVehicle.active,
            position: catalogVehicle.position,
            createdAt: catalogVehicle.createdAt,
            updatedAt: catalogVehicle.updatedAt
        }
    }

    /**
     * Procesa todos los vehículos del catálogo
     * @param {Array} vehicles - Array de vehículos del catálogo
     * @returns {Array} - Array de vehículos procesados
     */
    static processAllVehicles(vehicles) {
        return vehicles.map((vehicle) => this.processCatalogVehicle(vehicle))
    }

    /**
     * Obtiene y procesa todo el catálogo
     * @returns {Promise<Object>} - Catálogo procesado
     */
    static async getCatalogProcessed() {
        try {
            const result = await this.fetchAllVehicles()

            if (!result.success) {
                return result
            }

            const processedVehicles = this.processAllVehicles(result.data)

            return {
                success: true,
                data: processedVehicles,
                stats: {
                    ...result.stats,
                    withVersion: processedVehicles.filter((v) => v.version).length,
                    withoutVersion: processedVehicles.filter((v) => !v.version).length
                }
            }
        } catch (error) {
            console.error("❌ Error procesando catálogo:", error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }
}

export default FratelliCatalogService
