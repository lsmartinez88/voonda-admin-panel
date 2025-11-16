import axios from "axios"

// Configuración base de la API
const isDevelopment = import.meta.env.DEV
const API_BASE_URL = isDevelopment
    ? "" // En desarrollo usar proxy de Vite (/api -> https://api.fratelli.voonda.net)
    : import.meta.env.VITE_API_BASE_URL || "https://api.fratelli.voonda.net"

// Fallback directo sin proxy si el proxy falla
const DIRECT_API_URL = "https://api.fratelli.voonda.net"
const TOKEN_KEY = "voonda_access_token"
const USER_KEY = "voonda_user_data"

// Funciones para manejar el token y usuario en sessionStorage
export const getStoredToken = () => {
    try {
        return sessionStorage.getItem(TOKEN_KEY)
    } catch (error) {
        console.warn("Error accediendo al sessionStorage:", error)
        return null
    }
}

export const setStoredToken = (token) => {
    try {
        sessionStorage.setItem(TOKEN_KEY, token)
        console.log("Token guardado:", token) // Debug
    } catch (error) {
        console.warn("Error guardando token en sessionStorage:", error)
    }
}

export const removeStoredToken = () => {
    try {
        sessionStorage.removeItem(TOKEN_KEY)
    } catch (error) {
        console.warn("Error removiendo token del sessionStorage:", error)
    }
}

// Funciones para manejar datos del usuario
export const getStoredUser = () => {
    try {
        const userData = sessionStorage.getItem(USER_KEY)
        return userData ? JSON.parse(userData) : null
    } catch (error) {
        console.warn("Error accediendo a datos de usuario:", error)
        return null
    }
}

export const setStoredUser = (userData) => {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData))
    } catch (error) {
        console.warn("Error guardando datos de usuario:", error)
    }
}

export const removeStoredUser = () => {
    try {
        sessionStorage.removeItem(USER_KEY)
    } catch (error) {
        console.warn("Error removiendo datos de usuario:", error)
    }
}

// Función para limpiar toda la sesión
export const clearSession = () => {
    removeStoredToken()
    removeStoredUser()
}

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    const token = getStoredToken()
    return !!token
}

// Crear instancia de axios con configuración base
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

// Cliente directo para fallback sin proxy
const directApiClient = axios.create({
    baseURL: DIRECT_API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

// Función para agregar interceptores a un cliente
const addInterceptors = (client, clientName) => {
    // Interceptor para agregar token automáticamente
    client.interceptors.request.use(
        (config) => {
            const token = getStoredToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
                console.log(`${clientName} Token agregado a request:`, token.substring(0, 20) + "...")
            } else {
                console.log(`${clientName} No hay token disponible`)
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Interceptor para manejar respuestas y errores globalmente
    client.interceptors.response.use(
        (response) => {
            // Para respuestas exitosas (status 2xx), devolver los datos directamente
            console.log(`✅ ${clientName} Respuesta exitosa:`, response.status, response.data)
            return response.data
        },
        (error) => {
            console.error(`❌ ${clientName} Error en respuesta:`, error)

            // Manejar errores de autenticación
            if (error.response?.status === 401) {
                clearSession()
                return Promise.reject(new Error("Sesión expirada. Por favor, inicia sesión nuevamente."))
            }

            // Manejar errores de permisos
            if (error.response?.status === 403) {
                return Promise.reject(new Error("No tienes permisos para realizar esta acción."))
            }

            // Manejar errores de servidor (500)
            if (error.response?.status === 500) {
                console.error(`❌ ${clientName} Error 500 completo:`, error.response)
                console.error(`❌ ${clientName} Error 500 data:`, error.response?.data)
                console.error(`❌ ${clientName} Error 500 headers:`, error.response?.headers)
                const message = error.response?.data?.message || error.response?.data?.error || error.response?.data || "Error interno del servidor"
                return Promise.reject(new Error(message))
            }

            // Manejar errores de rate limiting
            if (error.response?.status === 429) {
                const message = error.response?.data?.message || error.response?.data?.error || "Demasiados intentos. Por favor, espera antes de intentar nuevamente."
                return Promise.reject(new Error(message))
            }

            // Manejar errores de red
            if (error.code === "ECONNABORTED") {
                return Promise.reject(new Error("La solicitud tardó demasiado tiempo. Verifica tu conexión."))
            }

            if (error.code === "ERR_NETWORK") {
                return Promise.reject(new Error("Error de red. Verifica tu conexión a internet."))
            }

            if (!error.response) {
                console.error(`${clientName} Error sin respuesta del servidor:`, error)
                return Promise.reject(new Error(`Error de conexión: ${error.message || "No se pudo conectar con el servidor"}`))
            }

            // Extraer mensaje de error de la API
            const errorMessage = error.response?.data?.message || error.response?.data?.error || `Error ${error.response?.status}: ${error.response?.statusText}`

            return Promise.reject(new Error(errorMessage))
        }
    )
}

// Agregar interceptores a ambos clientes
addInterceptors(apiClient, "PROXY")
addInterceptors(directApiClient, "DIRECT") // Función inteligente que intenta proxy primero, luego directo
const smartApiRequest = async (method, url, data = null, config = {}) => {
    try {
        console.log(`🔄 Intentando request con PROXY: ${method.toUpperCase()} ${url}`)

        // Intentar con proxy primero
        let response
        switch (method.toLowerCase()) {
            case "get":
                response = await apiClient.get(url, config)
                break
            case "post":
                response = await apiClient.post(url, data, config)
                break
            case "put":
                response = await apiClient.put(url, data, config)
                break
            case "delete":
                response = await apiClient.delete(url, config)
                break
            default:
                throw new Error(`Método HTTP no soportado: ${method}`)
        }

        console.log(`✅ PROXY request exitoso: ${method.toUpperCase()} ${url}`)
        return response
    } catch (proxyError) {
        console.warn(`⚠️ PROXY falló: ${proxyError.message}`)

        // Si el proxy falla con 500 o CORS, intentar directamente
        if (proxyError.message.includes("500") || proxyError.message.includes("CORS") || proxyError.message.includes("Error de red")) {
            try {
                console.log(`🔄 Intentando request DIRECTO: ${method.toUpperCase()} ${url}`)

                let directResponse
                switch (method.toLowerCase()) {
                    case "get":
                        directResponse = await directApiClient.get(url, config)
                        break
                    case "post":
                        directResponse = await directApiClient.post(url, data, config)
                        break
                    case "put":
                        directResponse = await directApiClient.put(url, data, config)
                        break
                    case "delete":
                        directResponse = await directApiClient.delete(url, config)
                        break
                }

                console.log(`✅ DIRECT request exitoso: ${method.toUpperCase()} ${url}`)
                return directResponse
            } catch (directError) {
                console.error(`❌ DIRECT también falló: ${directError.message}`)
                // Si el directo también falla, lanzar el error original del proxy
                throw proxyError
            }
        }

        // Si no es un error de proxy/CORS, lanzar error original
        throw proxyError
    }
}

// Crear cliente con funciones inteligentes
const intelligentApiClient = {
    get: (url, config) => smartApiRequest("get", url, null, config),
    post: (url, data, config) => smartApiRequest("post", url, data, config),
    put: (url, data, config) => smartApiRequest("put", url, data, config),
    delete: (url, config) => smartApiRequest("delete", url, config)
}

// Función para hacer requests con manejo de errores consistente
export const makeApiRequest = async (requestFunction, errorMessage = "Error en la solicitud") => {
    try {
        const response = await requestFunction()
        return { success: true, data: response }
    } catch (error) {
        console.error(errorMessage, error)
        return {
            success: false,
            error: error.message || errorMessage
        }
    }
}

export default intelligentApiClient
