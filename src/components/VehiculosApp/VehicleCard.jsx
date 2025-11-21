import React, { useState } from 'react'
import { JumboCard } from '@jumbo/components'
import { Box, Typography, IconButton, Chip, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CommentIcon from '@mui/icons-material/Comment'
import NoteIcon from '@mui/icons-material/Note'
import BuildIcon from '@mui/icons-material/Build'

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

    const modeloAutos = vehiculo?.modelo || {}
    const marcaReal = vehiculo?.modelo?.marca || 'Sin marca'

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

    const estadoColor = getEstadoColor(vehiculo.estado)
    const { initial } = getBrandLogo(marcaReal)

    const getStateColor = (estado) => {
        // Manejar diferentes formatos del estado
        let estadoCodigo = ''

        if (typeof estado === 'string') {
            estadoCodigo = estado
        } else if (typeof estado === 'object' && estado?.codigo) {
            estadoCodigo = estado.codigo
        } else if (typeof estado === 'object' && estado?.nombre) {
            estadoCodigo = estado.nombre
        } else if (typeof estado === 'number') {
            // Mapear IDs comunes de estados
            const estadosMap = {
                1: 'DISPONIBLE',
                2: 'VENDIDO',
                3: 'RESERVADO',
                4: 'MANTENIMIENTO'
            }
            estadoCodigo = estadosMap[estado] || 'DISPONIBLE'
        } else {
            estadoCodigo = 'DISPONIBLE' // default
        }

        switch (estadoCodigo?.toUpperCase()) {
            case 'DISPONIBLE': return 'info' // Celeste
            case 'VENDIDO': return 'success' // Verde  
            case 'RESERVADO': return 'warning' // Naranja
            case 'EN_REPARACION':
            case 'MANTENIMIENTO': return 'error' // Rojo
            case 'EN_TRANSITO': return 'secondary' // Violeta
            case 'BAJA': return 'default' // Negro/Gris
            default: return 'default' // Por defecto
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
                    <Avatar sx={{
                        bgcolor: 'white',
                        color: estadoColor,
                        border: `2px solid ${estadoColor}`,
                        width: 40,
                        height: 40,
                        fontSize: '1.1rem',
                        fontWeight: 600
                    }}>
                        {initial}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant='subtitle1'
                            sx={{
                                fontWeight: 500,
                                mb: 0,
                                fontSize: '1.1rem',
                                color: 'text.primary'
                            }}
                        >
                            {vehiculo?.modelo?.marca || 'Sin marca'} {vehiculo?.modelo?.modelo || 'Sin modelo'}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {vehiculo?.modelo?.modelo_ano || vehiculo?.vehiculo_ano || 'N/A'} - {vehiculo?.modelo?.version || 'Sin versión'}
                        </Typography>
                    </Box>
                </Box>
                <Box>
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
                </Box>
            </Box>

            {/* Contenido principal */}
            <Box sx={{ flexGrow: 1, mb: 2 }}>
                {/* Estado y precio */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                        label={getEstadoLabel(vehiculo.estado)}
                        size='small'
                        sx={{
                            backgroundColor: estadoColor,
                            color: 'white',
                            border: `1px solid ${estadoColor}`,
                            '& .MuiChip-label': {
                                color: 'white',
                                fontWeight: 500
                            }
                        }}
                    />
                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: 600,
                            color: vehiculo.moneda?.toUpperCase() === 'USD' ? '#2e7d32' : 'primary.main'
                        }}
                    >
                        {formatPrice(vehiculo.valor, vehiculo.moneda)}
                    </Typography>
                </Box>

                {/* Información adicional */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    {vehiculo.patente && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Patente</Typography>
                            <Typography variant='body2'>{vehiculo.patente}</Typography>
                        </Box>
                    )}
                    {vehiculo.kilometros && (
                        <Box>
                            <Typography variant='caption' color='text.secondary'>Kilometraje</Typography>
                            <Typography variant='body2'>{vehiculo.kilometros.toLocaleString('de-DE')} km</Typography>
                        </Box>
                    )}
                    <Box>
                        <Typography variant='caption' color='text.secondary'>Vendedor</Typography>
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
                    </Box>
                    <Box>
                        <Typography variant='caption' color='text.secondary'>Fecha Ingreso</Typography>
                        <Typography variant='body2'>
                            {vehiculo.created_at ? new Date(vehiculo.created_at).toLocaleDateString('es-AR') : '-'}
                        </Typography>
                    </Box>
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

            {/* Footer con iconos informativos */}
            <Box sx={{
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'flex-start', // Alineados a la izquierda
                gap: 1
            }}>
                {/* Icono de Comentarios - Siempre visible */}
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
                                : '#D1D5DB', // Gris más suave cuando no tiene datos
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

                {/* Icono de Pendientes de Preparación - Siempre visible */}
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

                {/* Icono de Notas Generales - Siempre visible */}
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
                                : '#D1D5DB', // Gris más suave cuando no tiene datos
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
        </JumboCard>
    )
}

export { VehicleCard }