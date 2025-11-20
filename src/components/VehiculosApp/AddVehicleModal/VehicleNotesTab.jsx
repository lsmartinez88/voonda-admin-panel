import React from 'react'
import {
    Grid,
    TextField,
    Typography,
    Box
} from '@mui/material'
import ArrayStringField from '../ArrayStringField'

const VehicleNotesTab = ({ data, errors, onChange }) => {

    const handleFieldChange = (field, value) => {
        onChange({
            [field]: value
        })
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                Notas y Comentarios
            </Typography>

            <Grid container spacing={3}>
                {/* Pendientes de Preparación */}
                <Grid item xs={12}>
                    <ArrayStringField
                        label="Pendientes de Preparación"
                        value={data.pendientes_preparacion || []}
                        onChange={(newArray) => handleFieldChange('pendientes_preparacion', newArray)}
                        placeholder="Ej: Revisión mecánica completa, Cambio de aceite y filtros..."
                        helperText={
                            errors.pendientes_preparacion ||
                            "Agregue las tareas pendientes para preparar el vehículo. Cada elemento será una tarea específica."
                        }
                        error={!!errors.pendientes_preparacion}
                    />
                </Grid>

                {/* Comentarios */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Comentarios Adicionales"
                        value={data.comentarios || ''}
                        onChange={(e) => handleFieldChange('comentarios', e.target.value)}
                        error={!!errors.comentarios}
                        helperText={
                            errors.comentarios ||
                            `${(data.comentarios || '').length}/2000 caracteres`
                        }
                        placeholder="Agrega cualquier comentario adicional sobre el vehículo...

Ejemplos:
- Historial de mantenimiento
- Condiciones especiales de venta
- Detalles sobre equipamiento adicional
- Información del propietario anterior
- Observaciones sobre el estado general
- Precio negociable / condiciones de financiamiento"
                        inputProps={{
                            maxLength: 2000
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: '0.95rem',
                                lineHeight: 1.5
                            }
                        }}
                    />
                </Grid>

                {/* Información adicional */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • <strong>Pendientes de Preparación:</strong> Lista las tareas que deben completarse antes de que el vehículo esté listo para la venta
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • <strong>Comentarios:</strong> Información general, historial, condiciones especiales o cualquier detalle relevante
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Ambos campos son opcionales y pueden editarse posteriormente
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VehicleNotesTab