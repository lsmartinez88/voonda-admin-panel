import React from "react"
import { AuthProvider } from "./AuthContext"
import { AppProvider } from "./AppContext"

/**
 * Provider combinado que incluye todos los contextos necesarios
 */
export const CombinedProvider = ({ children }) => {
    return (
        <AuthProvider>
            <AppProvider>{children}</AppProvider>
        </AuthProvider>
    )
}

// Exportar contextos individuales también
export { AppProvider, useApp } from "./AppContext"
export { AuthProvider, useAuth } from "./AuthContext"
