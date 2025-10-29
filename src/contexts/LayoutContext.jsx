import React, { createContext, useContext, useState, useEffect } from 'react'

const LayoutContext = createContext()

export const useLayout = () => {
    const context = useContext(LayoutContext)
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider')
    }
    return context
}

export const LayoutProvider = ({ children }) => {
    const [showAllPanels, setShowAllPanels] = useState(() => {
        // Leer del localStorage al inicializar
        const saved = localStorage.getItem('voonda-show-all-panels')
        return saved ? JSON.parse(saved) : false // Por defecto solo muestra Voonda
    })

    // Guardar en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('voonda-show-all-panels', JSON.stringify(showAllPanels))
    }, [showAllPanels])

    const toggleAllPanels = () => {
        setShowAllPanels(prev => !prev)
    }

    const value = {
        showAllPanels,
        setShowAllPanels,
        toggleAllPanels
    }

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    )
}