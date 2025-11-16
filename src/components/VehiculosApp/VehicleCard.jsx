import React from 'react'
import { JumboCard } from '@jumbo/components'
import { Box, Typography, IconButton, Chip, Avatar } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveEtaIcon from '@mui/icons-material/DriveEta'

// Función para obtener avatar de marca
const getBrandLogo = (marca) => {
    const brandColors = {
        'toyota': '#eb0a1e',
        'ford': '#003478',
        'chevrolet': '#ffc72c',
        'volkswagen': '#001e50',
        'nissan': '#c3002f',
        'honda': '#cc0000',
        'hyundai': '#002c5f',
        'kia': '#05141f',
        'mazda': '#0c4c93',
        'subaru': '#0054a6',
        'mitsubishi': '#dc143c',
        'suzuki': '#0066cc',
        'default': '#6b7280'
    }

    const brand = marca?.toLowerCase() || 'default'
    const color = brandColors[brand] || brandColors.default
    const initial = marca?.charAt(0)?.toUpperCase() || 'V'

    return { color, initial }
}

const VehicleCard = ({ vehiculo, onEdit, onDelete }) => {
    // Protección contra vehiculo undefined o null
    if (!vehiculo) {
        return null // No renderizar nada si no hay vehiculo
    }

    // Función auxiliar para obtener valores string seguros
    const getStringValue = (value, defaultValue = '') => {
        if (typeof value === 'string') return value
        if (typeof value === 'number') return value.toString()
        if (typeof value === 'object' && value?.nombre) return value.nombre
        if (typeof value === 'object' && value?.valor) return value.valor
        return defaultValue
    }

    const modeloAutos = vehiculo?.modelo_autos || {}
    const marcaReal = getStringValue(modeloAutos.marca) || getStringValue(vehiculo.marca)
    const { color, initial } = getBrandLogo(marcaReal)

    const getStateColor = (estado) => {
        // Manejar diferentes formatos del estado
        let estadoNombre = ''

        if (typeof estado === 'string') {
            estadoNombre = estado
        } else if (typeof estado === 'object' && estado?.nombre) {
            estadoNombre = estado.nombre
        } else if (typeof estado === 'object' && estado?.estado) {
            estadoNombre = estado.estado
        } else if (typeof estado === 'number') {
            // Mapear IDs comunes de estados
            const estadosMap = {
                1: 'disponible',
                2: 'vendido',
                3: 'reservado',
                4: 'mantenimiento'
            }
            estadoNombre = estadosMap[estado] || 'disponible'
        } else {
            estadoNombre = 'disponible' // default
        }

        switch (estadoNombre?.toLowerCase()) {
            case 'disponible': return 'success'
            case 'vendido': return 'error'
            case 'reservado': return 'warning'
            case 'mantenimiento': return 'info'
            default: return 'default'
        }
    }

    const getEstadoLabel = (estado) => {
        if (typeof estado === 'string') {
            return estado
        } else if (typeof estado === 'object' && estado?.nombre) {
            return estado.nombre
        } else if (typeof estado === 'object' && estado?.estado) {
            return estado.estado
        } else if (typeof estado === 'number') {
            const estadosMap = {
                1: 'Disponible',
                2: 'Vendido',
                3: 'Reservado',
                4: 'Mantenimiento'
            }
            return estadosMap[estado] || 'Disponible'
        }
        return 'Sin estado'
    }

    const formatPrice = (price) => {
        if (!price) return 'Consultar precio'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    return (
        <JumboCard
            contentWrapper
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
            }}
        >
            {/* Header con avatar y acciones */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: color, width: 40, height: 40, fontSize: '1.1rem', fontWeight: 600 }}>
                        {initial}
                    </Avatar>
                    <Box>
                        <Typography variant='h6' sx={{ fontWeight: 600, mb: 0 }}>
                            {getStringValue(modeloAutos.marca) || getStringValue(vehiculo.marca)} {getStringValue(modeloAutos.modelo) || getStringValue(vehiculo.modelo)}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                            Año {getStringValue(modeloAutos.año) || getStringValue(vehiculo.vehiculo_ano)}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton size='small' onClick={() => onEdit(vehiculo)} color='primary'>
                        <EditIcon />
                    </IconButton>
                    <IconButton size='small' onClick={() => onDelete(vehiculo.id)} color='error'>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Contenido principal */}
            <Box sx={{ flexGrow: 1, mb: 2 }}>
                {/* Estado y precio */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                        label={getEstadoLabel(vehiculo.estado)}
                        color={getStateColor(vehiculo.estado)}
                        size='small'
                    />
                    <Typography variant='h6' color='primary.main' sx={{ fontWeight: 600 }}>
                        {formatPrice(vehiculo.valor)}
                    </Typography>
                </Box>

                {/* Información adicional */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    {(getStringValue(modeloAutos.combustible) || getStringValue(vehiculo.combustible)) && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Combustible</Typography>
                            <Typography variant='body2'>{getStringValue(modeloAutos.combustible) || getStringValue(vehiculo.combustible)}</Typography>
                        </Box>
                    )}
                    {vehiculo.kilometros && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Kilometraje</Typography>
                            <Typography variant='body2'>{vehiculo.kilometros.toLocaleString()} km</Typography>
                        </Box>
                    )}
                    {(getStringValue(modeloAutos.caja) || getStringValue(vehiculo.caja) || getStringValue(vehiculo.transmision)) && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Transmisión</Typography>
                            <Typography variant='body2'>{getStringValue(modeloAutos.caja) || getStringValue(vehiculo.caja) || getStringValue(vehiculo.transmision)}</Typography>
                        </Box>
                    )}
                    {vehiculo.motor && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Motor</Typography>
                            <Typography variant='body2'>{vehiculo.motor}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Descripción */}
                {vehiculo.descripcion && (
                    <Typography variant='body2' color='text.secondary' sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {vehiculo.descripcion}
                    </Typography>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DriveEtaIcon color='action' fontSize='small' />
                    <Typography variant='caption' color='text.secondary'>
                        ID: {vehiculo.id}
                    </Typography>
                </Box>
                <Typography variant='caption' color='text.secondary'>
                    {vehiculo.created_at ? new Date(vehiculo.created_at).toLocaleDateString('es-AR') : 'Fecha N/A'}
                </Typography>
            </Box>
        </JumboCard>
    )
}

export { VehicleCard }