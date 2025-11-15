import apiClient, { setStoredToken, removeStoredToken, getStoredToken, setStoredUser, getStoredUser, clearSession, makeApiRequest } from "./apiClient"

/**
 * Servicio de autenticación que maneja login, logout y gestión de usuarios
 * Configurado para usar API real tanto en desarrollo como en producción
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
            console.log("� Realizando login con API real:", credentials.email)

            // Usar API real para autenticación
            const response = await apiClient.post("/api/auth/login", {
                email: credentials.email,
                password: credentials.password
            })

            console.log("📡 Respuesta de la API:", response)

            // La respuesta de axios está en response.data
            const apiData = response.data

            if (apiData.success && apiData.token && apiData.user) {
                // Guardar token y datos del usuario en sessionStorage
                setStoredToken(apiData.token)
                setStoredUser(apiData.user)

                console.log("✅ Login exitoso, token guardado")

                return {
                    success: true,
                    message: apiData.message || "Login exitoso",
                    token: apiData.token,
                    user: apiData.user
                }
            }

            // Si la API devuelve success: false, manejar como error de credenciales
            return {
                success: false,
                error: apiData.error || apiData.message || "Credenciales inválidas"
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
            console.log("🔗 Verificando usuario actual con API")

            // Verificar que tenemos token antes de hacer la request
            const storedToken = getStoredToken()
            if (!storedToken) {
                return {
                    success: false,
                    error: "No hay token de autenticación"
                }
            }

            // Usar API real para obtener usuario actual
            const response = await apiClient.get("/api/auth/me")
            console.log("📡 Respuesta de /api/auth/me:", response)

            // La respuesta de axios está en response.data
            const apiData = response.data

            if (apiData.success && apiData.user) {
                // Actualizar datos del usuario en sessionStorage
                setStoredUser(apiData.user)
                console.log("✅ Usuario actual obtenido correctamente")
                
                return {
                    success: true,
                    user: apiData.user
                }
            }

            return {
                success: false,
                error: apiData.message || "Error al obtener usuario"
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
