import React from 'react'
import {
    Grid,
    TextField,
    Typography,
    Box
} from '@mui/material'

const VehicleSellerTab = ({ data, errors, onChange }) => {

    const handleFieldChange = (field, value) => {
        onChange({
            [field]: value
        })
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const formatPhoneNumber = (value) => {
        // Eliminar todos los caracteres no numéricos excepto +
        const cleaned = value.replace(/[^\d+]/g, '')
        
        // Si empieza con +54, formatear como teléfono argentino
        if (cleaned.startsWith('+54')) {
            const numbers = cleaned.slice(3)
            if (numbers.length <= 2) return cleaned
            if (numbers.length <= 4) return `+54 ${numbers.slice(0, 2)} ${numbers.slice(2)}`
            if (numbers.length <= 8) return `+54 ${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`
            return `+54 ${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)}-${numbers.slice(8, 12)}`
        }
        
        return cleaned
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                Información del Vendedor
            </Typography>

            <Grid container spacing={3}>
                {/* Nombre */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nombre *"
                        value={data.vendedor_nombre || ''}
                        onChange={(e) => handleFieldChange('vendedor_nombre', e.target.value)}
                        error={!!errors.vendedor_nombre}
                        helperText={errors.vendedor_nombre}
                        placeholder="Ej: Juan"
                        inputProps={{ 
                            maxLength: 50,
                            minLength: 2 
                        }}
                    />
                </Grid>

                {/* Apellido */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Apellido *"
                        value={data.vendedor_apellido || ''}
                        onChange={(e) => handleFieldChange('vendedor_apellido', e.target.value)}
                        error={!!errors.vendedor_apellido}
                        helperText={errors.vendedor_apellido}
                        placeholder="Ej: Pérez"
                        inputProps={{ 
                            maxLength: 50,
                            minLength: 2 
                        }}
                    />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Teléfono *"
                        value={data.vendedor_telefono || ''}
                        onChange={(e) => {
                            const formattedPhone = formatPhoneNumber(e.target.value)
                            handleFieldChange('vendedor_telefono', formattedPhone)
                        }}
                        error={!!errors.vendedor_telefono}
                        helperText={errors.vendedor_telefono || 'Formato: +54 9 11 1234-5678'}
                        placeholder="+54 9 11 1234-5678"
                        inputProps={{ 
                            maxLength: 20,
                            minLength: 8 
                        }}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={data.vendedor_email || ''}
                        onChange={(e) => handleFieldChange('vendedor_email', e.target.value.toLowerCase())}
                        error={!!errors.vendedor_email}
                        helperText={errors.vendedor_email}
                        placeholder="juan.perez@email.com"
                        inputProps={{ 
                            maxLength: 100
                        }}
                    />
                </Grid>

                {/* Información adicional */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • Si el vendedor ya existe en el sistema (mismo email), se reutilizará la información existente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Si no existe, se creará un nuevo vendedor con esta información
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VehicleSellerTab