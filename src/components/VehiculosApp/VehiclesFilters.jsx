import React from 'react'
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    alpha,
    IconButton,
    Chip,
    Avatar,
    Typography
} from '@mui/material'
import { JumboCard } from '@jumbo/components'
import Grid from '@mui/material/Grid2'
import { RiFilterLine } from 'react-icons/ri'

const estadosVehiculos = [
    { value: '', label: 'Todos los estados' },
    { value: 'Disponible', label: 'Disponible' },
    { value: 'Vendido', label: 'Vendido' },
    { value: 'Reservado', label: 'Reservado' },
    { value: 'Mantenimiento', label: 'Mantenimiento' }
]

const estadosFilterData = [
    { category: 'Todos', slug: '', count: 0 },
    { category: 'Disponible', slug: 'Disponible', count: 0 },
    { category: 'Vendido', slug: 'Vendido', count: 0 },
    { category: 'Reservado', slug: 'Reservado', count: 0 }
]

export const VehiclesFilters = ({
    filtros,
    setFiltros,
    aplicarFiltros,
    limpiarFiltros
}) => {
    const [selectedEstado, setSelectedEstado] = React.useState('')

    return (
        <JumboCard contentWrapper sx={{ mb: 3 }}>
            {/* Filtros móviles */}
            <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                borderRadius={2}
                sx={{
                    p: theme => theme.spacing(0.75, 1),
                    backgroundColor: theme => alpha(theme.palette.common.black, 0.05),
                    display: { lg: 'none' },
                    mb: { xs: 0, lg: 2 }
                }}
            >
                <FormControl size='small' sx={{ minWidth: 120 }}>
                    <Select
                        value={filtros.estado}
                        onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        displayEmpty
                        sx={{ borderRadius: 4 }}
                    >
                        {estadosVehiculos.map(estado => (
                            <MenuItem key={estado.value} value={estado.value}>
                                {estado.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    size='small'
                    placeholder='Marca'
                    value={filtros.marca}
                    onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 4 },
                        minWidth: 100
                    }}
                />
            </Stack>

            {/* Filtros desktop */}
            <Box sx={{ mb: 2, display: { xs: 'none', lg: 'block' } }}>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                    Filtros de Búsqueda
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label='Marca'
                            value={filtros.marca}
                            onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filtros.estado}
                                label='Estado'
                                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                            >
                                {estadosVehiculos.map(estado => (
                                    <MenuItem key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Año desde'
                            value={filtros.año_desde}
                            onChange={(e) => setFiltros({ ...filtros, año_desde: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Año hasta'
                            value={filtros.año_hasta}
                            onChange={(e) => setFiltros({ ...filtros, año_hasta: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <IconButton
                            onClick={aplicarFiltros}
                            sx={{
                                border: 1,
                                borderRadius: 1.5,
                                fontSize: 18,
                                width: 40,
                                height: 40
                            }}
                            color='primary'
                        >
                            <RiFilterLine />
                        </IconButton>
                    </Grid>
                </Grid>

                {/* Filtros por precio */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Precio desde'
                            value={filtros.precio_desde}
                            onChange={(e) => setFiltros({ ...filtros, precio_desde: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Precio hasta'
                            value={filtros.precio_hasta}
                            onChange={(e) => setFiltros({ ...filtros, precio_hasta: e.target.value })}
                            size='small'
                        />
                    </Grid>
                </Grid>

                {/* Chips de estado estilo Invoice */}
                <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
                    <Stack
                        direction='row'
                        display='flex'
                        alignItems='center'
                        spacing={1}
                        borderRadius={2}
                        sx={{
                            p: theme => theme.spacing(0.75, 1, 0.75, 1.75),
                        }}
                    >
                        <Typography
                            variant='body1'
                            sx={{
                                textTransform: 'uppercase',
                                fontSize: 12,
                                letterSpacing: 1.5,
                                mr: 1.25,
                            }}
                        >
                            VEHÍCULOS
                        </Typography>
                        {estadosFilterData.map((item, index) => (
                            <Chip
                                key={index}
                                label={item.category}
                                avatar={<Avatar>{item.count}</Avatar>}
                                onClick={() => {
                                    setSelectedEstado(item.slug)
                                    setFiltros({ ...filtros, estado: item.slug })
                                }}
                                variant='outlined'
                                color={selectedEstado === item.slug ? 'primary' : 'default'}
                                sx={{
                                    flexDirection: 'row-reverse',
                                    borderRadius: '24px',
                                    mr: 1,
                                    '.MuiChip-label': {
                                        paddingInline: 1.5,
                                    },
                                    '.MuiChip-avatar': {
                                        mr: 0.75,
                                        ml: -0.5,
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                {/* Botones de acción */}
                <Stack direction='row' spacing={2}>
                    <Button
                        onClick={aplicarFiltros}
                        variant='contained'
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5,
                            fontSize: 14
                        }}
                        disableElevation
                    >
                        Aplicar Filtros
                    </Button>
                    <Button
                        onClick={limpiarFiltros}
                        variant='outlined'
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5,
                            fontSize: 14
                        }}
                    >
                        Limpiar
                    </Button>
                </Stack>
            </Box>
        </JumboCard>
    )
}