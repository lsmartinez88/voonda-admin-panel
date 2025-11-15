import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'

// Contexto de la aplicación
const AppContext = createContext(null)

// Tipos de acciones
const APP_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
    CLEAR_MESSAGES: 'CLEAR_MESSAGES',
    SET_APP_DATA: 'SET_APP_DATA',
    SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
    SET_THEME_MODE: 'SET_THEME_MODE'
}

// Estado inicial
const initialState = {
    loading: false,
    error: null,
    successMessage: null,
    appData: {
        estados: [],
        marcas: [],
        modelos: []
    },
    ui: {
        sidebarCollapsed: false,
        themeMode: 'light'
    }
}

// Reducer de la aplicación
const appReducer = (state, action) => {
    switch (action.type) {
        case APP_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case APP_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        case APP_ACTIONS.SET_SUCCESS_MESSAGE:
            return {
                ...state,
                successMessage: action.payload,
                error: null
            }

        case APP_ACTIONS.CLEAR_MESSAGES:
            return {
                ...state,
                error: null,
                successMessage: null
            }

        case APP_ACTIONS.SET_APP_DATA:
            return {
                ...state,
                appData: {
                    ...state.appData,
                    ...action.payload
                }
            }

        case APP_ACTIONS.SET_SIDEBAR_COLLAPSED:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebarCollapsed: action.payload
                }
            }

        case APP_ACTIONS.SET_THEME_MODE:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    themeMode: action.payload
                }
            }

        default:
            return state
    }
}

// Hook para usar el contexto
export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp debe ser usado dentro de un AppProvider')
    }
    return context
}

// Provider de la aplicación
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)
    const { isAuthenticated } = useAuth()

    // Cargar configuración desde localStorage al iniciar
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('voonda_theme_mode')
            if (savedTheme) {
                dispatch({
                    type: APP_ACTIONS.SET_THEME_MODE,
                    payload: savedTheme
                })
            }

            const savedSidebar = localStorage.getItem('voonda_sidebar_collapsed')
            if (savedSidebar) {
                dispatch({
                    type: APP_ACTIONS.SET_SIDEBAR_COLLAPSED,
                    payload: JSON.parse(savedSidebar)
                })
            }
        } catch (error) {
            console.error('Error cargando configuración:', error)
        }
    }, [])

    // Acciones
    const setLoading = (loading) => {
        dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading })
    }

    const setError = (error) => {
        dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error })
    }

    const setSuccessMessage = (message) => {
        dispatch({ type: APP_ACTIONS.SET_SUCCESS_MESSAGE, payload: message })
    }

    const clearMessages = () => {
        dispatch({ type: APP_ACTIONS.CLEAR_MESSAGES })
    }

    const setAppData = (data) => {
        dispatch({ type: APP_ACTIONS.SET_APP_DATA, payload: data })
    }

    const setSidebarCollapsed = (collapsed) => {
        try {
            localStorage.setItem('voonda_sidebar_collapsed', JSON.stringify(collapsed))
        } catch (error) {
            console.error('Error guardando configuración del sidebar:', error)
        }
        dispatch({ type: APP_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: collapsed })
    }

    const setThemeMode = (mode) => {
        try {
            localStorage.setItem('voonda_theme_mode', mode)
        } catch (error) {
            console.error('Error guardando tema:', error)
        }
        dispatch({ type: APP_ACTIONS.SET_THEME_MODE, payload: mode })
    }

    // Función para mostrar notificaciones temporales
    const showNotification = (message, type = 'success', duration = 5000) => {
        if (type === 'error') {
            setError(message)
        } else {
            setSuccessMessage(message)
        }

        // Limpiar mensaje después del tiempo especificado
        setTimeout(() => {
            clearMessages()
        }, duration)
    }

    // Función para manejar errores de manera consistente
    const handleError = (error, customMessage = null) => {
        const errorMessage = customMessage ||
            (typeof error === 'string' ? error : error?.message) ||
            'Ha ocurrido un error inesperado'

        console.error('Error en la aplicación:', error)
        setError(errorMessage)
    }

    const value = {
        // Estado
        ...state,

        // Acciones básicas
        setLoading,
        setError,
        setSuccessMessage,
        clearMessages,
        setAppData,

        // Acciones de UI
        setSidebarCollapsed,
        setThemeMode,

        // Utilidades
        showNotification,
        handleError
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}