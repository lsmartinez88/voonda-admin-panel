import { useState, useEffect, useContext, createContext } from "react"
import authService from "@/services/api/authService"

// Contexto de autenticación
const AuthContext = createContext(null)

// Hook para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}

// Provider de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Verificar autenticación al cargar la app
    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const storedUser = authService.getStoredUserData()
            const hasToken = authService.getStoredToken()

            if (storedUser && hasToken) {
                // Verificar que el token sea válido
                const result = await authService.getCurrentUser()

                if (result.success && result.data.user) {
                    setUser(result.data.user)
                    setIsAuthenticated(true)
                    // Actualizar datos del usuario si hay diferencias
                    authService.saveAuthData(hasToken, result.data.user)
                } else {
                    // Token inválido, limpiar datos
                    logout()
                }
            } else {
                setIsAuthenticated(false)
            }
        } catch (error) {
            console.error("Error verificando estado de autenticación:", error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        try {
            setLoading(true)
            const result = await authService.login(credentials)

            if (result.success && result.data.token && result.data.user) {
                const { token, user: userData } = result.data

                // Guardar datos de autenticación
                authService.saveAuthData(token, userData)

                // Actualizar estado
                setUser(userData)
                setIsAuthenticated(true)

                return { success: true, user: userData }
            } else {
                return {
                    success: false,
                    error: result.error || "Error en el login"
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || "Error inesperado en el login"
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            // Intentar logout en el servidor
            await authService.logout()
        } catch (error) {
            console.error("Error en logout del servidor:", error)
        } finally {
            // Limpiar estado local independientemente del resultado del servidor
            authService.clearAuthData()
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    const hasPermission = (permission) => {
        return authService.hasPermission(permission)
    }

    const isAdminGeneral = () => {
        return authService.isAdminGeneral()
    }

    const isAdminEmpresa = () => {
        return authService.isAdminEmpresa()
    }

    const getUserCompany = () => {
        return authService.getUserCompany()
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        isAdminGeneral,
        isAdminEmpresa,
        getUserCompany,
        checkAuthStatus
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
