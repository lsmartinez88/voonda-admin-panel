import React, { createContext, useContext, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'

// Create Context
const DialogContext = createContext()

// Provider Component
export const JumboDialogProvider = ({ children }) => {
    const [dialogState, setDialogState] = useState({
        open: false,
        title: '',
        content: null,
        actions: null,
        onConfirm: null,
        onCancel: null
    })

    const showDialog = ({ title, content, actions, onConfirm, onCancel }) => {
        setDialogState({
            open: true,
            title,
            content,
            actions,
            onConfirm,
            onCancel
        })
    }

    const hideDialog = () => {
        setDialogState((prev) => ({ ...prev, open: false }))
    }

    const showConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
        showDialog({
            title,
            content: message,
            actions: (
                <>
                    <Button
                        onClick={() => {
                            onCancel && onCancel()
                            hideDialog()
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            onConfirm && onConfirm()
                            hideDialog()
                        }}
                    >
                        Confirmar
                    </Button>
                </>
            )
        })
    }

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog, showConfirmDialog }}>
            {children}
            <Dialog open={dialogState.open} onClose={hideDialog} maxWidth='sm' fullWidth>
                {dialogState.title && <DialogTitle>{dialogState.title}</DialogTitle>}
                <DialogContent>{dialogState.content}</DialogContent>
                {dialogState.actions && <DialogActions>{dialogState.actions}</DialogActions>}
            </Dialog>
        </DialogContext.Provider>
    )
}

// Hook
export const useJumboDialog = () => {
    const context = useContext(DialogContext)
    if (!context) {
        throw new Error('useJumboDialog must be used within JumboDialogProvider')
    }
    return context
}