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
    switch (estado?.toLowerCase()) {
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

const VehicleItem = ({ item: vehiculo, onEdit, onDelete }) => {
    // Usar la misma lógica que VehicleCard para obtener la marca real
    const marcaReal = vehiculo.modelo_autos?.marca || vehiculo.marca
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
                            {marcaReal} {vehiculo.modelo_autos?.modelo || vehiculo.modelo}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Año {vehiculo.modelo_autos?.año || vehiculo.vehiculo_ano}
                        </Typography>
                    </Stack>
                </Stack>
            </TableCell>

            {/* Año */}
            <TableCell>
                <Typography variant='body2'>
                    {vehiculo.modelo_autos?.año || vehiculo.vehiculo_ano || 'N/A'}
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
                    {vehiculo.modelo_autos?.combustible || vehiculo.combustible || 'N/A'}
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
                    label={vehiculo.estado || 'Sin estado'}
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
                            <IconButton size='small'>
                                <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    ⋮
                                </Box>
                            </IconButton>
                        }
                    />
                </Stack>
            </TableCell>
        </TableRow>
    )
}

export { VehicleItem }