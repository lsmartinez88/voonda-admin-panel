import React, { useState, useEffect } from 'react'
import {
    Box,
    TextField,
    IconButton,
    Button,
    Typography,
    Chip,
    Stack,
    Paper
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Check as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material'

const ArrayStringField = ({
    label = "Elementos",
    value = [],
    onChange,
    placeholder = "Escriba un elemento...",
    helperText = "",
    error = false,
    disabled = false
}) => {
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState('')
    const [editingIndex, setEditingIndex] = useState(-1)
    const [editingValue, setEditingValue] = useState('')

    // Sincronizar con valor externo
    useEffect(() => {
        if (Array.isArray(value)) {
            setItems(value)
        } else if (typeof value === 'string' && value.trim()) {
            // Si viene como string separado por saltos de línea
            setItems(value.split('\n').map(item => item.trim()).filter(item => item.length > 0))
        } else {
            setItems([])
        }
    }, [value])

    const notifyChange = (newItems) => {
        if (onChange) {
            onChange(newItems)
        }
    }

    const addItem = () => {
        if (newItem.trim()) {
            const newItems = [...items, newItem.trim()]
            setItems(newItems)
            setNewItem('')
            notifyChange(newItems)
        }
    }

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
        notifyChange(newItems)
    }

    const startEdit = (index) => {
        setEditingIndex(index)
        setEditingValue(items[index])
    }

    const saveEdit = () => {
        if (editingValue.trim()) {
            const newItems = [...items]
            newItems[editingIndex] = editingValue.trim()
            setItems(newItems)
            setEditingIndex(-1)
            setEditingValue('')
            notifyChange(newItems)
        }
    }

    const cancelEdit = () => {
        setEditingIndex(-1)
        setEditingValue('')
    }

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (action === 'add') {
                addItem()
            } else if (action === 'save') {
                saveEdit()
            }
        }
    }

    return (
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {label}
            </Typography>

            {/* Campo para agregar nuevo elemento */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'add')}
                    disabled={disabled}
                    error={error}
                />
                <IconButton
                    onClick={addItem}
                    disabled={!newItem.trim() || disabled}
                    color="primary"
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {/* Lista de elementos */}
            {items.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Elementos ({items.length}):
                    </Typography>
                    <Stack spacing={1}>
                        {items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {editingIndex === index ? (
                                    // Modo edición
                                    <>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'save')}
                                            autoFocus
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={saveEdit}
                                            color="success"
                                            disabled={!editingValue.trim()}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={cancelEdit}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    // Modo vista
                                    <>
                                        <Chip
                                            label={item}
                                            variant="outlined"
                                            sx={{ flexGrow: 1, justifyContent: 'flex-start' }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => startEdit(index)}
                                            disabled={disabled}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeItem(index)}
                                            color="error"
                                            disabled={disabled}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            )}

            {/* Helper text */}
            {helperText && (
                <Typography variant="caption" color={error ? "error" : "text.secondary"} sx={{ mt: 1, display: 'block' }}>
                    {helperText}
                </Typography>
            )}

            {/* Info adicional */}
            {items.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No hay elementos. Agregue el primero arriba.
                </Typography>
            )}
        </Box>
    )
}

export default ArrayStringField