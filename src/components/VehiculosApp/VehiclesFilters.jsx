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
    Typography
} from '@mui/material'
import { JumboCard } from '@jumbo/components'
import Grid from '@mui/material/Grid2'

export const VehiclesFilters = ({
    filters = {},
    onFiltersChange,
    loading = false,
    marcasModelos = [],
    años = [],
    estados = [],
    loadingOptions = false,
    getModelosForMarca
}) => {

    const handleFilterChange = (field, value) => {
        if (onFiltersChange) {
            const newFilters = { ...filters, [field]: value }

            // Si cambia la marca, limpiar el modelo seleccionado y actualizar automáticamente
            if (field === 'marca') {
                newFilters.modelo = '' // Limpiar modelo cuando cambia marca

                // Si se selecciona una marca específica y solo tiene un modelo, seleccionarlo automáticamente
                const modelos = getModelosForMarca(value)
                if (modelos && modelos.length === 1) {
                    newFilters.modelo = modelos[0].modelo
                }
            }

            // Si cambia el modelo, verificar que la marca correspondiente esté seleccionada
            if (field === 'modelo' && value && !filters.marca) {
                // Buscar la marca del modelo seleccionado
                const marcaDelModelo = marcasModelos.find(marcaData =>
                    marcaData.modelos.some(modeloData => 
                        modeloData.modelo === value || modeloData.id === value
                    )
                )
                if (marcaDelModelo) {
                    newFilters.marca = marcaDelModelo.marca
                }
            }

            // Si cambia el estado, usar el código del estado
            if (field === 'estado') {
                // Buscar el estado seleccionado para obtener su código
                const estadoSeleccionado = estados.find(estado => estado.codigo === value)
                if (estadoSeleccionado) {
                    newFilters.estado_codigo = estadoSeleccionado.codigo
                    newFilters.estado = value
                } else if (value === '') {
                    delete newFilters.estado_codigo
                    newFilters.estado = ''
                }
            }

            onFiltersChange(newFilters)
        }
    }

    const handleClearFilters = () => {
        if (onFiltersChange) {
            onFiltersChange({
                search: '',
                marca: '',
                modelo: '',
                año: '',
                estado: '',
                yearFrom: '',
                yearTo: '',
                priceFrom: '',
                priceTo: '',
                orderBy: 'created_at',
                order: 'desc'
            })
        }
    }

    // Obtener todas las marcas disponibles
    const getAllMarcas = () => {
        return marcasModelos.map(marcaData => marcaData.marca)
    }

    // Obtener todos los modelos disponibles
    const getAllModelos = () => {
        const todosLosModelos = []
        marcasModelos.forEach(marcaData => {
            if (marcaData.modelos) {
                marcaData.modelos.forEach(modeloData => {
                    todosLosModelos.push({
                        modelo: modeloData.modelo,
                        marca: marcaData.marca,
                        versiones: modeloData.versiones || []
                    })
                })
            }
        })
        return todosLosModelos
    }

    // Obtener modelos según la marca seleccionada
    const getModelosDisponibles = () => {
        if (filters.marca) {
            return getModelosForMarca(filters.marca)
        }
        return getAllModelos()
    }

    return (
        <JumboCard contentWrapper sx={{ mb: 3 }}>
            {/* Filtros móviles */}
            <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ mb: 2, display: { xs: 'flex', lg: 'none' } }}
            >
                <TextField
                    size='small'
                    placeholder='Buscar...'
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 4 },
                        minWidth: 200
                    }}
                />
                <FormControl size='small' sx={{ minWidth: 120 }}>
                    <Select
                        value={filters.estado || ''}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 4 }}
                        disabled={loadingOptions}
                    >
                        <MenuItem value=''>Todos los estados</MenuItem>
                        {estados.map(estado => (
                            <MenuItem key={estado.id || estado.codigo} value={estado.codigo}>
                                {estado.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 120 }}>
                    <Select
                        value={filters.marca || ''}
                        onChange={(e) => handleFilterChange('marca', e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 4 }}
                        disabled={loadingOptions}
                    >
                        <MenuItem value=''>Todas las marcas</MenuItem>
                        {getAllMarcas().map(marca => (
                            <MenuItem key={marca} value={marca}>
                                {marca}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 120 }}>
                    <Select
                        value={filters.año || ''}
                        onChange={(e) => handleFilterChange('año', e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 4 }}
                        disabled={loadingOptions}
                    >
                        <MenuItem value=''>Todos los años</MenuItem>
                        {años.map(año => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {/* Filtros desktop */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                    Filtros de Búsqueda
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 2.4 }}>
                        <TextField
                            fullWidth
                            label='Buscar'
                            placeholder='Dominio, marca, modelo...'
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.4 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Marca</InputLabel>
                            <Select
                                value={filters.marca || ''}
                                label='Marca'
                                onChange={(e) => handleFilterChange('marca', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todas las marcas</MenuItem>
                                {getAllMarcas().map(marca => (
                                    <MenuItem key={marca} value={marca}>
                                        {marca}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.4 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                value={filters.modelo || ''}
                                label='Modelo'
                                onChange={(e) => handleFilterChange('modelo', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todos los modelos</MenuItem>
                                {getModelosDisponibles().map((modeloData, index) => (
                                    <MenuItem 
                                        key={`${modeloData.modelo}-${index}`} 
                                        value={modeloData.id || modeloData.modelo}
                                    >
                                        {modeloData.modelo}
                                        {filters.marca === '' && (
                                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                ({modeloData.marca})
                                            </Typography>
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.4 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Año</InputLabel>
                            <Select
                                value={filters.año || ''}
                                label='Año'
                                onChange={(e) => handleFilterChange('año', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todos los años</MenuItem>
                                {años.map(año => (
                                    <MenuItem key={año} value={año}>
                                        {año}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.4 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.estado || ''}
                                label='Estado'
                                onChange={(e) => handleFilterChange('estado', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todos los estados</MenuItem>
                                {estados.map(estado => (
                                    <MenuItem key={estado.id || estado.codigo} value={estado.codigo}>
                                        {estado.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        disabled={loading}
                        size="small"
                    >
                        Limpiar Filtros
                    </Button>
                    {(filters.marca || filters.modelo || filters.año || filters.estado || filters.search) && (
                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                            Filtros activos: {[filters.marca, filters.modelo, filters.año, filters.estado, filters.search].filter(Boolean).length}
                        </Typography>
                    )}
                    {(filters.marca || filters.modelo) && (
                        <Typography
                            variant="caption"
                            color="success.main"
                            sx={{
                                alignSelf: 'center',
                                fontWeight: 500,
                                backgroundColor: 'success.light',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem'
                            }}
                        >
                            ✅ Filtros marca/modelo activos (adaptados al backend)
                        </Typography>
                    )}
                    {filters.search && !filters.marca && !filters.modelo && (
                        <Typography
                            variant="caption"
                            color="success.main"
                            sx={{
                                alignSelf: 'center',
                                fontWeight: 500,
                                backgroundColor: 'success.light',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem'
                            }}
                        >
                            ✅ Búsqueda general activa
                        </Typography>
                    )}
                </Stack>
            </Box>
        </JumboCard>
    )
}

export default VehiclesFilters