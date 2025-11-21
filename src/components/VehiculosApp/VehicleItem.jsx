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
import CommentIcon from '@mui/icons-material/Comment'
import NoteIcon from '@mui/icons-material/Note'
import BuildIcon from '@mui/icons-material/Build'

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
        <TableRow sx={{ height: 80 }}> {/* Altura fija para doble línea */}
            {/* Columna 1: Marca/Modelo arriba, Año/Versión/Estado abajo */}
            <TableCell sx={{ pl: 3 }}>
                <Stack spacing={0.5}>
                    {/* Línea 1: Marca y modelo */}
                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 0 }}>
                        {vehiculo?.modelo?.marca || 'Sin marca'} {vehiculo?.modelo?.modelo || 'Sin modelo'}
                    </Typography>
                    {/* Línea 2: Año, versión y estado */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant='body2' color='text.secondary'>
                            {vehiculo?.modelo?.modelo_ano || vehiculo?.vehiculo_ano || 'N/A'} - {vehiculo?.modelo?.version || 'Sin versión'}
                        </Typography>
                        <Chip
                            label={getEstadoLabel(vehiculo.estado)}
                            size='small'
                            sx={{
                                backgroundColor: estadoColor,
                                color: 'white',
                                '& .MuiChip-label': {
                                    color: 'white',
                                    fontWeight: 500,
                                    fontSize: '0.7rem'
                                }
                            }}
                        />
                    </Box>
                </Stack>
            </TableCell>

            {/* Columna 2: Precio arriba, Kilometraje abajo */}
            <TableCell>
                <Stack spacing={0.5}>
                    {/* Línea 1: Precio */}
                    <Typography
                        variant='subtitle1'
                        sx={{
                            fontWeight: 600,
                            color: vehiculo.moneda?.toUpperCase() === 'USD' ? '#2e7d32' : 'primary.main'
                        }}
                    >
                        {formatPrice(vehiculo.valor, vehiculo.moneda)}
                    </Typography>
                    {/* Línea 2: Kilometraje */}
                    <Typography variant='body2' color='text.secondary'>
                        {vehiculo.kilometros ? `${vehiculo.kilometros.toLocaleString('de-DE')} km` : 'Sin datos'}
                    </Typography>
                </Stack>
            </TableCell>

            {/* Columna 3: Fecha de ingreso arriba, Patente abajo */}
            <TableCell>
                <Stack spacing={0.5}>
                    {/* Línea 1: Fecha ingreso */}
                    <Typography variant='body2'>
                        {vehiculo.created_at ? new Date(vehiculo.created_at).toLocaleDateString('es-AR') : 'Sin fecha'}
                    </Typography>
                    {/* Línea 2: Patente */}
                    <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
                        {vehiculo.patente || 'Sin patente'}
                    </Typography>
                </Stack>
            </TableCell>

            {/* Columna 4: Vendedor con tooltip */}
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
                        Sin asignar
                    </Typography>
                )}
            </TableCell>

            {/* Columna 5: Iconos de información (como en VehicleCard) */}
            <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    {/* Icono de Comentarios */}
                    <Tooltip
                        title={
                            <Box sx={{ maxWidth: 300, p: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Comentarios Adicionales
                                </Typography>
                                <Typography variant="body2">
                                    {(vehiculo.comentarios || vehiculo.descripcion)
                                        ? (vehiculo.comentarios || vehiculo.descripcion)
                                        : 'Sin comentarios'
                                    }
                                </Typography>
                            </Box>
                        }
                        arrow
                        placement="top"
                    >
                        <IconButton
                            size="small"
                            sx={{
                                color: (vehiculo.comentarios || vehiculo.descripcion)
                                    ? '#5DADE2' // Azul más fuerte cuando tiene datos
                                    : '#D1D5DB', // Gris suave cuando no tiene datos
                                '&:hover': {
                                    color: (vehiculo.comentarios || vehiculo.descripcion)
                                        ? '#3498DB' // Azul más intenso en hover
                                        : '#9CA3AF'
                                }
                            }}
                        >
                            <CommentIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Icono de Pendientes de Preparación */}
                    <Tooltip
                        title={
                            <Box sx={{ maxWidth: 300, p: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Pendientes de Preparación
                                </Typography>
                                {(() => {
                                    const pendientes = vehiculo.pendientes_preparacion;

                                    if (!pendientes) {
                                        return <Typography variant="body2">Sin pendientes de preparación</Typography>;
                                    }

                                    if (Array.isArray(pendientes)) {
                                        return pendientes.length > 0 ? (
                                            <Box>
                                                {pendientes.map((item, index) => (
                                                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                                        • {item}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2">Sin pendientes de preparación</Typography>
                                        );
                                    }

                                    if (typeof pendientes === 'string' && pendientes.trim()) {
                                        // Dividir por diferentes separadores comunes y también por puntos
                                        const items = pendientes.split(/[,;\n•-]/).filter(item => item.trim()).map(item => item.trim());
                                        return items.length > 1 ? (
                                            <Box>
                                                {items.map((item, index) => (
                                                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                                        • {item}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2">• {pendientes.trim()}</Typography>
                                        );
                                    }

                                    return <Typography variant="body2">Sin pendientes de preparación</Typography>;
                                })()}
                            </Box>
                        }
                        arrow
                        placement="top"
                    >
                        <IconButton
                            size="small"
                            sx={{
                                color: (() => {
                                    const pendientes = vehiculo.pendientes_preparacion;
                                    const hasPendientes = pendientes && (
                                        (Array.isArray(pendientes) && pendientes.length > 0) ||
                                        (typeof pendientes === 'string' && pendientes.trim())
                                    );
                                    return hasPendientes ? '#5DADE2' : '#D1D5DB'; // Azul más fuerte o gris suave
                                })(),
                                '&:hover': {
                                    color: (() => {
                                        const pendientes = vehiculo.pendientes_preparacion;
                                        const hasPendientes = pendientes && (
                                            (Array.isArray(pendientes) && pendientes.length > 0) ||
                                            (typeof pendientes === 'string' && pendientes.trim())
                                        );
                                        return hasPendientes ? '#3498DB' : '#9CA3AF';
                                    })()
                                }
                            }}
                        >
                            <BuildIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Icono de Notas Generales */}
                    <Tooltip
                        title={
                            <Box sx={{ maxWidth: 300, p: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Notas del Vehículo
                                </Typography>
                                {vehiculo.notas_generales ? (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="caption" color="text.secondary">Generales:</Typography>
                                        <Typography variant="body2">{vehiculo.notas_generales}</Typography>
                                    </Box>
                                ) : null}
                                {vehiculo.notas_mecánicas ? (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="caption" color="text.secondary">Mecánicas:</Typography>
                                        <Typography variant="body2">{vehiculo.notas_mecánicas}</Typography>
                                    </Box>
                                ) : null}
                                {vehiculo.notas_vendedor ? (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Del Vendedor:</Typography>
                                        <Typography variant="body2">{vehiculo.notas_vendedor}</Typography>
                                    </Box>
                                ) : null}
                                {!vehiculo.notas_generales && !vehiculo.notas_mecánicas && !vehiculo.notas_vendedor && (
                                    <Typography variant="body2">Sin notas adicionales</Typography>
                                )}
                            </Box>
                        }
                        arrow
                        placement="top"
                    >
                        <IconButton
                            size="small"
                            sx={{
                                color: (vehiculo.notas_generales || vehiculo.notas_mecánicas || vehiculo.notas_vendedor)
                                    ? '#5DADE2' // Azul más fuerte cuando tiene datos
                                    : '#D1D5DB', // Gris suave cuando no tiene datos
                                '&:hover': {
                                    color: (vehiculo.notas_generales || vehiculo.notas_mecánicas || vehiculo.notas_vendedor)
                                        ? '#3498DB' // Azul más intenso en hover
                                        : '#9CA3AF'
                                }
                            }}
                        >
                            <NoteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>

            {/* Columna 6: Acciones (sin header) */}
            <TableCell align="center" sx={{ pr: 3 }}>
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