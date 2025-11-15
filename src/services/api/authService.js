import apiClient, { setStoredToken, removeStoredToken, getStoredToken, setStoredUser, getStoredUser, clearSession, makeApiRequest } from "./apiClient"

// Credenciales de desarrollo temporal (mientras verificamos la API)
const DEV_CREDENTIALS = {
    email: "admin@voonda.com",
    password: "admin123"
}

// Usuario de desarrollo simulado
const DEV_USER = {
    id: "dev-user-1",
    nombre: "Usuario",
    apellido: "Desarrollo", 
    email: "admin@voonda.com",
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
        nombre: "Voonda"
    },
    ultimo_login: new Date().toISOString()
}

const DEV_TOKEN = "dev-token-" + Date.now()

// Verificar si estamos en modo desarrollo
const isDevelopmentMode = () => {
    return import.meta.env.DEV // Solo en desarrollo
}

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
            console.log("🔗 Realizando login con API real:", credentials.email)
            console.log("🌐 URL base de API:", import.meta.env.DEV ? "PROXY /api" : "https://api.fratelli.voonda.net")

            // Primero intentar con API real
            try {
                const response = await apiClient.post("/api/auth/login", {
                    email: credentials.email,
                    password: credentials.password
                })

                console.log("📡 Respuesta de la API:", response)

                // La respuesta de axios está en response.data
                const apiData = response

                if (apiData.success && apiData.token && apiData.user) {
                    // Guardar token y datos del usuario en sessionStorage
                    setStoredToken(apiData.token)
                    setStoredUser(apiData.user)

                    console.log("✅ Login exitoso con API real")

                    return {
                        success: true,
                        message: apiData.message || "Login exitoso",
                        token: apiData.token,
                        user: apiData.user
                    }
                }
            } catch (apiError) {
                console.log("❌ Error con API real, intentando modo desarrollo...")
                
                // Si falla la API, usar modo desarrollo si estamos en dev
                if (isDevelopmentMode()) {
                    if (credentials.email === DEV_CREDENTIALS.email && credentials.password === DEV_CREDENTIALS.password) {
                        // Simular delay de red
                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        // Guardar token y datos del usuario en sessionStorage
                        setStoredToken(DEV_TOKEN)
                        setStoredUser(DEV_USER)

                        console.log("✅ Login exitoso en modo desarrollo")

                        return {
                            success: true,
                            message: "Login exitoso (modo desarrollo - API no disponible)",
                            token: DEV_TOKEN,
                            user: DEV_USER
                        }
                    } else {
                        return {
                            success: false,
                            error: `Credenciales inválidas. En modo desarrollo usa: ${DEV_CREDENTIALS.email} / ${DEV_CREDENTIALS.password}`
                        }
                    }
                } else {
                    // En producción, mostrar error de API
                    throw apiError
                }
            }

            // Si la API no devuelve success, manejar como error de credenciales
            return {
                success: false,
                error: "Credenciales inválidas"
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

            // Si estamos en modo desarrollo y tenemos token de desarrollo, usar datos locales
            if (isDevelopmentMode() && storedToken.startsWith('dev-token-')) {
                const storedUser = getStoredUser()
                if (storedUser) {
                    console.log("✅ Usuario de desarrollo obtenido desde sessionStorage")
                    return {
                        success: true,
                        user: storedUser
                    }
                }
            }

            try {
                // Usar API real para obtener usuario actual
                const response = await apiClient.get("/api/auth/me")
                console.log("📡 Respuesta de /api/auth/me:", response)

                // La respuesta de axios está en response
                const apiData = response

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
            } catch (apiError) {
                console.log("❌ Error al verificar usuario con API")
                
                // En desarrollo, si tenemos datos almacenados, usarlos
                if (isDevelopmentMode()) {
                    const storedUser = getStoredUser()
                    if (storedUser) {
                        console.log("✅ Usando usuario almacenado en modo desarrollo")
                        return {
                            success: true,
                            user: storedUser
                        }
                    }
                }
                
                throw apiError
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
