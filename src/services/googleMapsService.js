/**
 * Servicio para obtener información de Google Maps Places API
 * Obtiene los horarios de atención de un lugar desde Google Maps
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

class GoogleMapsService {
    /**
     * Extraer Place ID de una URL de Google Maps
     * @param {string} url - URL de Google Maps (puede ser maps.app.goo.gl o google.com/maps)
     */
    static extractPlaceId(url) {
        // Intentar extraer de URL corta
        const shortMatch = url.match(/maps\.app\.goo\.gl\/([a-zA-Z0-9]+)/)
        if (shortMatch) {
            return null // Las URLs cortas necesitan ser resueltas primero
        }

        // Intentar extraer de URL completa
        const placeIdMatch = url.match(/place_id=([^&]+)/)
        if (placeIdMatch) {
            return placeIdMatch[1]
        }

        // Intentar extraer del formato !1s{place_id}
        const alternativeMatch = url.match(/!1s([^!]+)/)
        if (alternativeMatch) {
            return alternativeMatch[1]
        }

        return null
    }

    /**
     * Obtener información del lugar desde Google Maps
     * @param {string} placeId - ID del lugar en Google Maps
     */
    static async getPlaceDetails(placeId) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,opening_hours,formatted_address&key=${GOOGLE_MAPS_API_KEY}`, {
                method: "GET"
            })

            const data = await response.json()

            if (data.status === "OK" && data.result) {
                return {
                    success: true,
                    data: {
                        name: data.result.name,
                        address: data.result.formatted_address,
                        openingHours: data.result.opening_hours?.weekday_text || [],
                        isOpen: data.result.opening_hours?.open_now || null
                    }
                }
            } else {
                return {
                    success: false,
                    error: `Error de Google Maps API: ${data.status}`
                }
            }
        } catch (error) {
            console.error("Error obteniendo detalles del lugar:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Buscar lugar por nombre y dirección
     * @param {string} query - Nombre o dirección del lugar
     */
    static async findPlace(query) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`, {
                method: "GET"
            })

            const data = await response.json()

            if (data.status === "OK" && data.candidates && data.candidates.length > 0) {
                return {
                    success: true,
                    placeId: data.candidates[0].place_id,
                    name: data.candidates[0].name,
                    address: data.candidates[0].formatted_address
                }
            } else {
                return {
                    success: false,
                    error: "No se encontró el lugar"
                }
            }
        } catch (error) {
            console.error("Error buscando lugar:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Parsear horario de Google Maps a formato comparable
     * Ejemplo: "lunes: 9:00–18:00" → { day: 'lunes', hours: '9:00–18:00', isClosed: false }
     */
    static parseGoogleMapsHour(hourText) {
        const [day, hours] = hourText.split(": ")
        const isClosed = hours?.toLowerCase().includes("cerrado") || hours?.toLowerCase().includes("closed")

        return {
            day: day.toLowerCase().trim(),
            hours: hours?.trim() || "",
            isClosed
        }
    }
}

export default GoogleMapsService
