import apiClient, { setStoredToken, setStoredUser, clearSession, getStoredUser, getStoredToken } from "./apiClient"

/**
 * Servicio de autenticación para la API de Voonda
 * Conecta únicamente con endpoints reales
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
            console.log("🔐 Intentando login con API:", credentials.email)

            const response = await apiClient.post("/api/auth/login", {
                email: credentials.email.trim(),
                password: credentials.password
            })

            console.log("✅ Login exitoso:", response)

            // Verificar estructura de respuesta según documentación
            if (response.success && response.token && response.user) {
                // Guardar token y datos del usuario
                setStoredToken(response.token)
                setStoredUser(response.user)

                return {
                    success: true,
                    user: response.user,
                    token: response.token,
                    message: response.message || "Inicio de sesión exitoso"
                }
            }

            throw new Error(response.message || "Respuesta inválida del servidor")
        } catch (error) {
            console.error("❌ Error al iniciar sesión:", error.message)
            throw new Error(error.response?.data?.message || error.message || "Credenciales inválidas")
        }
    }

    /**
     * Cerrar sesión del usuario actual
     * @returns {Promise<Object>} Respuesta de confirmación
     */
    async logout() {
        try {
            console.log("🔐 Cerrando sesión en API")

            try {
                const response = await apiClient.post("/api/auth/logout")
                console.log("✅ Logout exitoso:", response.message)
            } catch (error) {
                console.warn("⚠️ Error al cerrar sesión en API (continuando):", error.message)
            }

            // Siempre limpiar datos locales
            clearSession()

            return {
                success: true,
                message: "Sesión cerrada exitosamente"
            }
        } catch (error) {
            console.error("❌ Error al cerrar sesión:", error)

            // Incluso si hay error, limpiar datos locales
            clearSession()

            return {
                success: true,
                message: "Sesión cerrada exitosamente"
            }
        }
    }

    /**
     * Obtener información del usuario actual desde la API
     * @returns {Promise<Object>} Datos del usuario autenticado
     */
    async getCurrentUser() {
        try {
            const token = getStoredToken()

            if (!token) {
                throw new Error("No hay token de autenticación")
            }

            console.log("🔐 Verificando usuario actual con API")

            const response = await apiClient.get("/api/auth/me")

            if (response.success && response.user) {
                // Actualizar datos del usuario en sessionStorage
                setStoredUser(response.user)

                console.log("✅ Usuario actual obtenido de API")

                return {
                    success: true,
                    user: response.user,
                    message: response.message || "Usuario obtenido exitosamente"
                }
            }

            throw new Error(response.message || "Error al obtener usuario")
        } catch (error) {
            console.error("❌ Error al obtener información del usuario:", error)

            // Si hay error de autenticación, limpiar sesión
            if (error.message.includes("Token") || error.message.includes("401")) {
                clearSession()
            }

            throw new Error(error.message || "Error al obtener información del usuario")
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
     * Verificar si el usuario tiene un permiso específico
     * @param {string} modulo - Módulo (ej: 'vehiculos', 'operaciones')
     * @param {string} accion - Acción (ej: 'leer', 'crear', 'editar', 'eliminar')
     * @returns {boolean} Si tiene permisos
     */
    hasPermission(modulo, accion) {
        const userData = this.getStoredUserData()
        if (!userData || !userData.rol || !userData.rol.permisos) {
            return false
        }

        // Admin general tiene todos los permisos
        if (userData.rol.nombre === "administrador_general") {
            return true
        }

        const permisos = userData.rol.permisos[modulo]
        if (!permisos) {
            return false
        }

        return permisos[accion] === true
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

    /**
     * Obtener el token actual
     * @returns {string|null} Token actual
     */
    getCurrentToken() {
        return getStoredToken()
    }

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean} Si está autenticado
     */
    isAuthenticated() {
        const token = getStoredToken()
        const user = getStoredUser()
        return !!(token && user)
    }
}

// Crear una instancia única del servicio
const authService = new AuthService()

export default authService
