import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, getStoredToken, getStoredUser, clearSession } from '@/services/api'

// Crear el contexto de autenticación
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Verificar autenticación inicial al cargar la aplicación
    useEffect(() => {
        const initAuth = async () => {
            try {
                setIsLoading(true)

                const storedToken = getStoredToken()
                const storedUser = getStoredUser()

                console.log('🔍 Verificando auth inicial:', { storedToken: storedToken?.substring(0, 20) + '...', hasUser: !!storedUser })

                if (storedToken && storedUser) {
                    // Verificar si el token sigue siendo válido
                    const userResponse = await authService.getCurrentUser()

                    if (userResponse.success) {
                        setToken(storedToken)
                        setUser(userResponse.user)
                        setIsAuthenticated(true)
                        console.log('✅ Usuario autenticado exitosamente')
                    } else {
                        // Token inválido, limpiar sesión
                        console.log('❌ Token inválido, limpiando sesión')
                        clearSession()
                        setToken(null)
                        setUser(null)
                        setIsAuthenticated(false)
                    }
                } else {
                    console.log('❌ No hay token o usuario guardado')
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error)
                clearSession()
                setToken(null)
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    /**
     * Función para iniciar sesión
     */
    const login = async (credentials) => {
        try {
            setIsLoading(true)

            const response = await authService.login(credentials)

            if (response.success) {
                setToken(response.token)
                setUser(response.user)
                setIsAuthenticated(true)

                return { success: true, message: response.message }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            console.error('Error en login:', error)
            return { success: false, error: error.message || 'Error al iniciar sesión' }
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Función para cerrar sesión
     */
    const logout = async () => {
        try {
            setIsLoading(true)

            // Intentar logout en el servidor
            await authService.logout()
        } catch (error) {
            console.error('Error en logout:', error)
        } finally {
            // Siempre limpiar el estado local
            setToken(null)
            setUser(null)
            setIsAuthenticated(false)
            setIsLoading(false)
        }
    }

    /**
     * Función para actualizar datos del usuario
     */
    const refreshUser = async () => {
        try {
            const response = await authService.getCurrentUser()

            if (response.success) {
                setUser(response.user)
                return { success: true, user: response.user }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            console.error('Error actualizando usuario:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Verificar si el usuario tiene un permiso específico
     */
    const hasPermission = (permission) => {
        return authService.hasPermission(permission)
    }

    /**
     * Verificar si el usuario es administrador general
     */
    const isAdminGeneral = () => {
        return authService.isAdminGeneral()
    }

    /**
     * Verificar si el usuario es administrador de empresa
     */
    const isAdminEmpresa = () => {
        return authService.isAdminEmpresa()
    }

    /**
     * Obtener la empresa del usuario
     */
    const getUserCompany = () => {
        return authService.getUserCompany()
    }

    /**
     * Verificar si el usuario puede realizar una acción específica
     */
    const canPerform = (action) => {
        if (!isAuthenticated || !user) return false

        switch (action) {
            case 'vehiculos.leer':
            case 'vehiculos.crear':
            case 'vehiculos.editar':
            case 'vehiculos.eliminar':
                return hasPermission(action)

            case 'vendedores.leer':
            case 'vendedores.crear':
            case 'vendedores.editar':
            case 'vendedores.eliminar':
                return hasPermission(action)

            case 'compradores.leer':
            case 'compradores.crear':
            case 'compradores.editar':
            case 'compradores.eliminar':
                return hasPermission(action)

            case 'operaciones.leer':
            case 'operaciones.crear':
            case 'operaciones.editar':
            case 'operaciones.eliminar':
                return hasPermission(action)

            case 'empresas.leer':
            case 'empresas.crear':
            case 'empresas.editar':
            case 'empresas.eliminar':
                return hasPermission(action)

            default:
                return false
        }
    }

    // Valor del contexto
    const contextValue = {
        // Estado
        user,
        token,
        isLoading,
        isAuthenticated,

        // Funciones
        login,
        logout,
        refreshUser,

        // Utilidades de permisos
        hasPermission,
        isAdminGeneral,
        isAdminEmpresa,
        getUserCompany,
        canPerform,

        // Información del usuario
        userInfo: {
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            email: user?.email || '',
            telefono: user?.telefono || '',
            rol: user?.rol?.nombre || '',
            empresa: user?.empresa?.nombre || '',
            ultimoLogin: user?.ultimo_login || null
        }
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// Exportar el contexto - AuthProvider y useAuth ya están exportados arriba
export { AuthContext }
export default AuthContext