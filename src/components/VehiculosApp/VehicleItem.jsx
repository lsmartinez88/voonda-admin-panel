import React from 'react'
import {
    TableCell,
    TableRow,
    Typography,
    Chip,
    Avatar,
    Stack,
    IconButton,
    Tooltip,
    Box
} from '@mui/material'
import { JumboDdMenu } from '@jumbo/components'
import { getCarBrandLogo, getBrandColor } from '@/utilities/carBrands'
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const formatPrice = (price) => {
    if (!price) return 'Consultar precio'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)
}

const getEstadoColor = (estado) => {
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
        case 'disponible':
            return 'success'
        case 'vendido':
            return 'error'
        case 'reservado':
            return 'warning'
        case 'mantenimiento':
            return 'info'
        default:
            return 'default'
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

const VehicleItem = ({ vehiculo, onEdit, onDelete }) => {
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

    // Usar la misma lógica que VehicleCard para obtener la marca real
    const modeloAutos = vehiculo?.modelo_autos || {}
    const marcaReal = getStringValue(modeloAutos.marca) || getStringValue(vehiculo.marca)
    const brandInfo = getCarBrandLogo(marcaReal)
    const brandColor = getBrandColor(marcaReal)

    const menuItems = [
        {
            title: 'Ver detalles',
            slug: 'view',
            onClick: () => console.log('Ver', vehiculo.id)
        },
        {
            title: 'Editar',
            slug: 'edit',
            onClick: () => onEdit(vehiculo)
        },
        {
            title: 'Eliminar',
            slug: 'delete',
            onClick: () => onDelete(vehiculo.id)
        }
    ]

    return (
        <TableRow>
            {/* Vehículo */}
            <TableCell
                sx={{
                    pl: 3,
                }}
            >
                <Stack direction='row' alignItems='center' spacing={2}>
                    <Avatar
                        sx={{
                            bgcolor: brandColor,
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}
                    >
                        {brandInfo?.initials || 'VH'}
                    </Avatar>
                    <Stack>
                        <Typography variant='subtitle2' fontWeight={600}>
                            {marcaReal} {getStringValue(modeloAutos.modelo) || getStringValue(vehiculo.modelo)}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Año {getStringValue(modeloAutos.año) || getStringValue(vehiculo.vehiculo_ano)}
                        </Typography>
                    </Stack>
                </Stack>
            </TableCell>

            {/* Año */}
            <TableCell>
                <Typography variant='body2'>
                    {getStringValue(modeloAutos.año) || getStringValue(vehiculo.vehiculo_ano) || 'N/A'}
                </Typography>
            </TableCell>

            {/* Motor */}
            <TableCell>
                <Typography variant='body2'>
                    {vehiculo.motor || 'N/A'}
                </Typography>
            </TableCell>

            {/* Combustible */}
            <TableCell>
                <Typography variant='body2'>
                    {getStringValue(modeloAutos.combustible) || getStringValue(vehiculo.combustible) || 'N/A'}
                </Typography>
            </TableCell>

            {/* Precio */}
            <TableCell>
                <Typography variant='subtitle2' fontWeight={600} color='primary'>
                    {formatPrice(vehiculo.valor)}
                </Typography>
            </TableCell>

            {/* Estado */}
            <TableCell>
                <Chip
                    label={getEstadoLabel(vehiculo.estado)}
                    color={getEstadoColor(vehiculo.estado)}
                    size='small'
                    sx={{ textTransform: 'capitalize' }}
                />
            </TableCell>

            {/* Acciones */}
            <TableCell
                align="right"
                sx={{
                    pr: 3,
                }}
            >
                <Stack direction='row' alignItems='center' spacing={0.5} justifyContent="flex-end">
                    <Tooltip title='Editar'>
                        <IconButton
                            size='small'
                            color='primary'
                            onClick={() => onEdit(vehiculo)}
                        >
                            <FaEdit size={14} />
                        </IconButton>
                    </Tooltip>
                    <JumboDdMenu
                        menuItems={menuItems}
                        icon={
                            <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ⋮
                            </Box>
                        }
                    />
                </Stack>
            </TableCell>
        </TableRow>
    )
}

export { VehicleItem }