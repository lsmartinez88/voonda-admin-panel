import React, { useState } from 'react'
import {
    TableCell,
    TableRow,
    Typography,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const formatPrice = (price, moneda) => {
    if (!price) return 'Consultar precio'

    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numericPrice)) return 'Consultar precio'

    // Formatear con punto como separador de miles
    const formattedNumber = numericPrice.toLocaleString('de-DE')

    // Determinar símbolo según moneda
    const symbol = moneda?.toUpperCase() === 'USD' ? 'US$' : '$'

    return `${symbol} ${formattedNumber}`
}

// Función para obtener color basado en el estado
const getEstadoColor = (estado) => {
    let estadoCodigo = ''

    if (typeof estado === 'string') {
        estadoCodigo = estado
    } else if (typeof estado === 'object' && estado?.codigo) {
        estadoCodigo = estado.codigo
    } else if (typeof estado === 'object' && estado?.nombre) {
        estadoCodigo = estado.nombre
    } else if (typeof estado === 'number') {
        const estadosMap = {
            1: 'DISPONIBLE',
            2: 'VENDIDO',
            3: 'RESERVADO',
            4: 'MANTENIMIENTO'
        }
        estadoCodigo = estadosMap[estado] || 'DISPONIBLE'
    } else {
        estadoCodigo = 'DISPONIBLE'
    }

    switch (estadoCodigo?.toUpperCase()) {
        case 'DISPONIBLE':
            return '#4fc3f7' // Celeste más oscuro
        case 'VENDIDO':
            return '#66bb6a' // Verde más fuerte
        case 'RESERVADO':
            return '#ffa726' // Naranja más fuerte
        case 'EN_REPARACION':
        case 'MANTENIMIENTO':
            return '#ef5350' // Rojo más fuerte
        case 'EN_TRANSITO':
            return '#9c27b0' // Violeta
        case 'BAJA':
            return '#424242' // Negro suave
        default:
            return '#757575' // Gris por defecto
    }
}

const getEstadoLabel = (estado) => {
    let estadoCodigo = ''
    let estadoNombre = ''

    if (typeof estado === 'string') {
        estadoCodigo = estado
        estadoNombre = estado
    } else if (typeof estado === 'object' && estado?.codigo) {
        estadoCodigo = estado.codigo
        estadoNombre = estado.nombre || estado.codigo
    } else if (typeof estado === 'object' && estado?.nombre) {
        estadoCodigo = estado.nombre
        estadoNombre = estado.nombre
    } else if (typeof estado === 'number') {
        const estadosMap = {
            1: { codigo: 'DISPONIBLE', nombre: 'Disponible' },
            2: { codigo: 'VENDIDO', nombre: 'Vendido' },
            3: { codigo: 'RESERVADO', nombre: 'Reservado' },
            4: { codigo: 'MANTENIMIENTO', nombre: 'Mantenimiento' }
        }
        const estadoInfo = estadosMap[estado] || { codigo: 'DISPONIBLE', nombre: 'Disponible' }
        estadoCodigo = estadoInfo.codigo
        estadoNombre = estadoInfo.nombre
    } else {
        return 'Sin estado'
    }

    // Mapear códigos a nombres amigables
    const codigosMap = {
        'DISPONIBLE': 'Disponible',
        'VENDIDO': 'Vendido',
        'RESERVADO': 'Reservado',
        'EN_REPARACION': 'En Reparación',
        'EN_TRANSITO': 'En Tránsito',
        'MANTENIMIENTO': 'Mantenimiento',
        'BAJA': 'Baja'
    }

    return codigosMap[estadoCodigo?.toUpperCase()] || estadoNombre || 'Sin estado'
}

const VehicleItem = ({ vehiculo, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleEdit = () => {
        onEdit(vehiculo)
        handleMenuClose()
    }

    const handleDelete = () => {
        onDelete(vehiculo.id)
        handleMenuClose()
    }

    // Protección contra vehiculo undefined o null
    if (!vehiculo) {
        return null
    }

    const estadoColor = getEstadoColor(vehiculo.estado)

    return (
        <TableRow>
            {/* Vehículo - Primera columna: Marca y modelo en negrita arriba, año versión abajo, badge de estado */}
            <TableCell sx={{ pl: 3 }}>
                <Stack spacing={1}>
                    {/* Marca y modelo en negrita */}
                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 0 }}>
                        {vehiculo?.modelo?.marca || 'Sin marca'} {vehiculo?.modelo?.modelo || 'Sin modelo'}
                    </Typography>
                    {/* Año - versión con badge de estado */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant='body2' color='text.secondary'>
                            {vehiculo?.modelo?.modelo_ano || vehiculo?.vehiculo_ano || 'N/A'} - {vehiculo?.modelo?.version || 'Sin versión'}
                        </Typography>
                        <Chip
                            label={getEstadoLabel(vehiculo.estado)}
                            size='small'
                            variant='outlined'
                            sx={{
                                borderColor: estadoColor,
                                color: estadoColor,
                                '& .MuiChip-label': {
                                    fontWeight: 500,
                                    fontSize: '0.7rem'
                                }
                            }}
                        />
                    </Box>
                </Stack>
            </TableCell>

            {/* Precio - mismo formato que en la card */}
            <TableCell>
                <Typography
                    variant='subtitle1'
                    sx={{
                        fontWeight: 600,
                        color: vehiculo.moneda?.toUpperCase() === 'USD' ? '#2e7d32' : 'primary.main'
                    }}
                >
                    {formatPrice(vehiculo.valor, vehiculo.moneda)}
                </Typography>
            </TableCell>

            {/* Kilometraje */}
            <TableCell>
                <Typography variant='body2'>
                    {vehiculo.kilometros ? `${vehiculo.kilometros.toLocaleString('de-DE')} km` : '-'}
                </Typography>
            </TableCell>

            {/* Patente */}
            <TableCell>
                <Typography variant='body2'>
                    {vehiculo.patente || '-'}
                </Typography>
            </TableCell>

            {/* Fecha Ingreso */}
            <TableCell>
                <Typography variant='body2'>
                    {vehiculo.created_at ? new Date(vehiculo.created_at).toLocaleDateString('es-AR') : '-'}
                </Typography>
            </TableCell>

            {/* Vendedor */}
            <TableCell>
                {vehiculo.vendedor ? (
                    <Tooltip
                        title={
                            <Box sx={{ p: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {vehiculo.vendedor.nombre} {vehiculo.vendedor.apellido}
                                </Typography>
                                {vehiculo.vendedor.telefono && (
                                    <Typography variant='caption' display='block'>
                                        📞 {vehiculo.vendedor.telefono}
                                    </Typography>
                                )}
                                {vehiculo.vendedor.email && (
                                    <Typography variant='caption' display='block'>
                                        ✉️ {vehiculo.vendedor.email}
                                    </Typography>
                                )}
                            </Box>
                        }
                        arrow
                        placement="top"
                    >
                        <Typography
                            variant='body2'
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'primary.main'
                                }
                            }}
                        >
                            {vehiculo.vendedor.nombre} {vehiculo.vendedor.apellido}
                        </Typography>
                    </Tooltip>
                ) : (
                    <Typography variant='body2' color='text.secondary'>
                        -
                    </Typography>
                )}
            </TableCell>

            {/* Acciones - mismo icono y opciones que en las cards */}
            <TableCell align="right" sx={{ pr: 3 }}>
                <IconButton
                    size='small'
                    onClick={handleMenuClick}
                    aria-label="opciones"
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            minWidth: 140,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Editar</ListItemText>
                    </MenuItem>
                    <Divider sx={{ borderColor: 'error.main' }} />
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Eliminar</ListItemText>
                    </MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    )
}

export { VehicleItem }