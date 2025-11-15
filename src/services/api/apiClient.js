import axios from "axios"

// Configuración base de la API
const isDevelopment = import.meta.env.DEV
const API_BASE_URL = isDevelopment ? "" : "https://api.fratelli.voonda.net" // Usar proxy en desarrollo
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

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
    (config) => {
        const token = getStoredToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log("Token agregado a request:", token) // Debug
        } else {
            console.log("No hay token disponible") // Debug
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
    (response) => {
        // Para respuestas exitosas (status 2xx), devolver los datos directamente
        return response.data
    },
    (error) => {
        // Manejar errores de autenticación
        if (error.response?.status === 401) {
            // Token inválido o expirado - limpiar toda la sesión
            clearSession()
            return Promise.reject(new Error("Sesión expirada. Por favor, inicia sesión nuevamente."))
        }

        // Manejar errores de permisos
        if (error.response?.status === 403) {
            return Promise.reject(new Error("No tienes permisos para realizar esta acción."))
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
            console.error("Error sin respuesta del servidor:", error)
            return Promise.reject(new Error(`Error de conexión: ${error.message || "No se pudo conectar con el servidor"}`))
        }

        // Extraer mensaje de error de la API
        const errorMessage = error.response?.data?.message || error.response?.data?.error || `Error ${error.response?.status}: ${error.response?.statusText}`

        return Promise.reject(new Error(errorMessage))
    }
)

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

export default apiClient
