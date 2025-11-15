// Componentes de gestión principales
export { default as VendedoresManager } from "./Vendedores/VendedoresManager"
export { default as CompradoresManager } from "./Compradores/CompradoresManager"
export { default as OperacionesManager } from "./Operaciones/OperacionesManager"

// Componentes de vehículos
export { default as VehicleModalNew } from "./Vehiculos/VehicleModalNew"
export { default as VehicleImageManager } from "./Vehiculos/VehicleImageManager"

// Componentes de autenticación
export { default as Login } from "./auth/Login"
export { default as ProtectedRoute } from "./common/ProtectedRoute"

// Contexto de autenticación nuevo (exportar como VoondaAuthProvider para evitar conflictos)
export { AuthProvider as VoondaAuthProvider, AuthContext, useAuth } from "../contexts/AuthContext"
