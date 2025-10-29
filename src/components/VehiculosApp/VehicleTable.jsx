import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
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

export const VehicleTable = ({ vehiculos, onEdit, onDelete }) => {
    return (
        <TableContainer>
            <Table sx={{ minWidth: 800 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            'th:first-child': { pl: 3 },
                            'th:last-child': { pr: 3 }
                        }}
                    >
                        <TableCell width={200}>Vehículo</TableCell>
                        <TableCell width={120}>Año</TableCell>
                        <TableCell width={120}>Motor</TableCell>
                        <TableCell width={120}>Combustible</TableCell>
                        <TableCell width={150}>Precio</TableCell>
                        <TableCell width={120}>Estado</TableCell>
                        <TableCell width={100}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehiculos.map((vehiculo, index) => {
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
                                onClick: () => onEdit(vehiculo)
                            },
                            { 
                                title: 'Eliminar', 
                                slug: 'delete',
                                onClick: () => onDelete(vehiculo.id)
                            }
                        ]

                        return (
                            <TableRow
                                key={vehiculo.id}
                                sx={{
                                    'td:first-child': { pl: 3 },
                                    'td:last-child': { pr: 3 },
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                {/* Vehículo */}
                                <TableCell>
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
                                                {vehiculo.marca}
                                            </Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                {vehiculo.modelo_autos?.nombre || vehiculo.modelo || 'Modelo no especificado'}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>

                                {/* Año */}
                                <TableCell>
                                    <Typography variant='body2'>
                                        {vehiculo.vehiculo_ano || 'N/A'}
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
                                        {vehiculo.combustible || 'N/A'}
                                    </Typography>
                                </TableCell>

                                {/* Precio */}
                                <TableCell>
                                    <Typography variant='subtitle2' fontWeight={600} color='primary'>
                                        {vehiculo.valor ? formatCurrency(vehiculo.valor) : 'N/A'}
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
                                <TableCell>
                                    <Stack direction='row' alignItems='center' spacing={0.5}>
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
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}