import React from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Stack,
    Box,
    Avatar,
    Tooltip
} from '@mui/material'
import { JumboDdMenu } from '@jumbo/components'
import { getCarBrandLogo, getBrandColor } from '@/utilities/carBrands'
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount)
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

export const VehicleCard = ({ vehiculo, onEdit, onDelete }) => {
    const brandInfo = getCarBrandLogo(vehiculo.marca)
    const brandColor = getBrandColor(vehiculo.marca)

    const menuItems = [
        {
            title: 'Ver detalles',
            slug: 'view',
            onClick: () => console.log('Ver', vehiculo.id)
        },
        {
            title: 'Editar',
            slug: 'edit',
            onClick: onEdit
        },
        {
            title: 'Eliminar',
            slug: 'delete',
            onClick: onDelete
        }
    ]

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                }
            }}
        >
            {/* Header con marca y estado */}
            <Box sx={{ p: 2, pb: 1 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='flex-start' spacing={1}>
                    <Stack direction='row' alignItems='center' spacing={1.5} flex={1}>
                        <Avatar
                            sx={{
                                bgcolor: brandColor,
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}
                        >
                            {brandInfo?.initials || 'VH'}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                            <Typography
                                variant='subtitle1'
                                fontWeight={600}
                                noWrap
                                title={vehiculo.marca}
                            >
                                {vehiculo.marca}
                            </Typography>
                            <Typography
                                variant='body2'
                                color='text.secondary'
                                noWrap
                                title={vehiculo.modelo_autos?.nombre || vehiculo.modelo || 'Modelo no especificado'}
                            >
                                {vehiculo.modelo_autos?.nombre || vehiculo.modelo || 'Modelo no especificado'}
                            </Typography>
                        </Box>
                    </Stack>

                    <JumboDdMenu
                        menuItems={menuItems}
                        icon={<Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⋮</Box>}
                    />
                </Stack>
            </Box>

            {/* Contenido principal */}
            <CardContent sx={{ pt: 0, pb: 1, flex: 1 }}>
                <Stack spacing={2}>
                    {/* Año y Motor */}
                    <Stack direction='row' justifyContent='space-between'>
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Año
                            </Typography>
                            <Typography variant='body2' fontWeight={500}>
                                {vehiculo.vehiculo_ano || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Motor
                            </Typography>
                            <Typography variant='body2' fontWeight={500}>
                                {vehiculo.motor || 'N/A'}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Combustible y Transmisión */}
                    <Stack direction='row' justifyContent='space-between'>
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Combustible
                            </Typography>
                            <Typography variant='body2' fontWeight={500}>
                                {vehiculo.combustible || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Transmisión
                            </Typography>
                            <Typography variant='body2' fontWeight={500}>
                                {vehiculo.transmision || 'N/A'}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Precio */}
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant='h6' color='primary' fontWeight={700}>
                            {vehiculo.valor ? formatCurrency(vehiculo.valor) : 'Precio no disponible'}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>

            {/* Footer con estado */}
            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                <Chip
                    label={vehiculo.estado || 'Sin estado'}
                    color={getEstadoColor(vehiculo.estado)}
                    size='small'
                    sx={{
                        textTransform: 'capitalize',
                        fontWeight: 500
                    }}
                />
            </CardActions>
        </Card>
    )
}