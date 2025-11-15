import apiClient, { setStoredToken, removeStoredToken, getStoredToken, setStoredUser, getStoredUser, clearSession, makeApiRequest } from "./apiClient"

// Credenciales de desarrollo
const DEV_CREDENTIALS = {
    email: "demo@voonda.com",
    password: "demo123"
}

// Usuario de desarrollo simulado
const DEV_USER = {
    id: "dev-user-1",
    nombre: "Usuario",
    apellido: "Demo",
    email: "demo@voonda.com",
    telefono: "+54 11 1234-5678",
    rol: {
        id: "admin-role",
        nombre: "administrador_general",
        permisos: {
            vehiculos: { leer: true, crear: true, editar: true, eliminar: true },
            vendedores: { leer: true, crear: true, editar: true, eliminar: true },
            compradores: { leer: true, crear: true, editar: true, eliminar: true },
            operaciones: { leer: true, crear: true, editar: true, eliminar: true },
            empresas: { leer: true, crear: true, editar: true, eliminar: true }
        }
    },
    empresa: {
        id: "voonda-empresa",
        nombre: "Voonda Demo"
    },
    ultimo_login: new Date().toISOString()
}

const DEV_TOKEN = "dev-token-" + Date.now()

// Verificar si estamos en modo desarrollo
const isDevelopmentMode = () => {
    return false // Siempre usar API real
}

/**
 * Servicio de autenticación que maneja login, logout y gestión de usuarios
 */
class AuthService {
    /**
     * Iniciar sesión con email y contraseña
     * @param {Object} credentials - Credenciales del usuario
     * @param {string} credentials.email - Email del usuario
     * @param {string} credentials.password - Contraseña del usuario
     * @returns {Promise<Object>} Respuesta con token y datos del usuario
     */
    async login(credentials) {
        try {
            // En modo desarrollo, usar credenciales simuladas
            if (isDevelopmentMode()) {
                console.log("🔧 Modo desarrollo activado")

                if (credentials.email === DEV_CREDENTIALS.email && credentials.password === DEV_CREDENTIALS.password) {
                    // Simular delay de red
                    await new Promise((resolve) => setTimeout(resolve, 1000))

                    // Guardar token y datos del usuario en sessionStorage
                    setStoredToken(DEV_TOKEN)
                    setStoredUser(DEV_USER)

                    return {
                        success: true,
                        message: "Login exitoso (modo desarrollo)",
                        token: DEV_TOKEN,
                        user: DEV_USER
                    }
                } else {
                    return {
                        success: false,
                        error: "Credenciales inválidas. Usa: demo@voonda.com / demo123"
                    }
                }
            }

            // En producción, usar API real
            const response = await apiClient.post("/api/auth/login", credentials)

            if (response.success && response.token && response.user) {
                // Guardar token y datos del usuario en sessionStorage
                setStoredToken(response.token)
                setStoredUser(response.user)

                return {
                    success: true,
                    message: response.message,
                    token: response.token,
                    user: response.user
                }
            }

            // Si la API devuelve success: false, manejar como error de credenciales
            return {
                success: false,
                error: response.error || response.message || "Error en el login"
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error)
            return {
                success: false,
                error: error.message || "Error al iniciar sesión"
            }
        }
    }

    /**
     * Cerrar sesión del usuario actual
     * @returns {Promise<Object>} Respuesta de confirmación
     */
    async logout() {
        try {
            // Intentar cerrar sesión en el servidor
            const response = await apiClient.post("/api/auth/logout")

            // Siempre limpiar datos locales, incluso si falla la request
            clearSession()

            return {
                success: true,
                message: response.message || "Sesión cerrada exitosamente"
            }
        } catch (error) {
            // Siempre limpiar datos locales, incluso si falla la request
            clearSession()
            console.error("Error al cerrar sesión:", error)
            return {
                success: false,
                error: error.message || "Error al cerrar sesión"
            }
        }
    }

    /**
     * Obtener información del usuario actual desde la API
     * @returns {Promise<Object>} Datos del usuario autenticado
     */
    async getCurrentUser() {
        try {
            // En modo desarrollo, devolver usuario simulado si hay token válido
            if (isDevelopmentMode()) {
                const storedToken = getStoredToken()
                const storedUser = getStoredUser()

                if (storedToken && storedUser) {
                    return {
                        success: true,
                        user: storedUser
                    }
                } else {
                    return {
                        success: false,
                        error: "No hay sesión activa"
                    }
                }
            }

            // En producción, usar API real
            const response = await apiClient.get("/api/auth/me")

            if (response.success && response.user) {
                // Actualizar datos del usuario en sessionStorage
                setStoredUser(response.user)
                return {
                    success: true,
                    user: response.user
                }
            }

            return {
                success: false,
                error: response.message || "Error al obtener usuario"
            }
        } catch (error) {
            console.error("Error al obtener información del usuario:", error)
            return {
                success: false,
                error: error.message || "Error al obtener información del usuario"
            }
        }
    }

    /**
     * Obtener datos del usuario guardados localmente
     * @returns {Object|null} Datos del usuario o null si no existen
     */
    getStoredUserData() {
        return getStoredUser()
    }

    /**
     * Limpiar todos los datos de autenticación
     */
    clearAuthData() {
        clearSession()
    }

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean} True si está autenticado
     */
    isAuthenticated() {
        return !!(getStoredToken() && getStoredUser())
    }

    /**
     * Verificar si el usuario tiene un permiso específico
     * @param {string} permission - Permiso a verificar (ej: 'vehiculos.leer')
     * @returns {boolean} True si el usuario tiene el permiso
     */
    hasPermission(permission) {
        const userData = this.getStoredUserData()
        if (!userData || !userData.rol || !userData.rol.permisos) {
            return false
        }

        const permisos = userData.rol.permisos
        const [recurso, accion] = permission.split(".")

        // Verificar si tiene el permiso específico o es admin general
        if (userData.rol.nombre === "administrador_general") {
            return true
        }

        return permisos[recurso] && permisos[recurso][accion] === true
    }

    /**
     * Verificar si el usuario es administrador general
     * @returns {boolean} True si es administrador general
     */
    isAdminGeneral() {
        const userData = this.getStoredUserData()
        return userData?.rol?.nombre === "administrador_general"
    }

    /**
     * Verificar si el usuario es administrador de empresa
     * @returns {boolean} True si es administrador de empresa
     */
    isAdminEmpresa() {
        const userData = this.getStoredUserData()
        return userData?.rol?.nombre === "administrador_empresa"
    }

    /**
     * Obtener la empresa del usuario actual
     * @returns {Object|null} Datos de la empresa o null
     */
    getUserCompany() {
        const userData = this.getStoredUserData()
        return userData?.empresa || null
    }
}

// Crear una instancia única del servicio
const authService = new AuthService()

export default authService
