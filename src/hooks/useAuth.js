import { AuthContext } from "@/contexts/AuthContext"
import React from "react"

export function useAuth() {
    return React.useContext(AuthContext)
}
