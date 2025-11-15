import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = ({ children, requiredPermission = null, requireAdmin = false }) => {
    const { isAuthenticated, isLoading, canPerform, isAdminGeneral } = useAuth()
    const location = useLocation()

    // Mostrar loader mientras se verifica la autenticación
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: 2
                }}
            >
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">
                    Verificando autenticación...
                </Typography>
            </Box>
        )
    }

    // Redirigir al login si no está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Verificar permisos específicos si se requieren
    if (requiredPermission && !canPerform(requiredPermission)) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    textAlign: 'center',
                    p: 3
                }}
            >
                <Typography variant="h5" color="error" gutterBottom>
                    Acceso Denegado
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    No tienes permisos para acceder a esta sección.
                </Typography>
            </Box>
        )
    }

    // Verificar si requiere admin general
    if (requireAdmin && !isAdminGeneral()) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    textAlign: 'center',
                    p: 3
                }}
            >
                <Typography variant="h5" color="error" gutterBottom>
                    Acceso Restringido
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Esta sección solo está disponible para administradores generales.
                </Typography>
            </Box>
        )
    }

    // Si pasa todas las verificaciones, mostrar el componente
    return children
}

export default ProtectedRoute