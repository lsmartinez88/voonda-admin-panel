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
    marcas = [],
    modelos = [],
    estados = [],
    loadingOptions = false,
    onMarcaChange
}) => {

    const handleFilterChange = (field, value) => {
        if (onFiltersChange) {
            const newFilters = { ...filters, [field]: value };

            // Si cambia la marca, limpiar el modelo seleccionado
            if (field === 'marca') {
                newFilters.modelo = '';
                // Cargar modelos de la nueva marca
                if (onMarcaChange) {
                    onMarcaChange(value);
                }
            }

            // Si cambia el estado, mapear nombre a código
            if (field === 'estado') {
                // Buscar el estado seleccionado para obtener su código
                const estadoSeleccionado = estados.find(estado => estado.nombre === value);
                if (estadoSeleccionado) {
                    newFilters.estado_codigo = estadoSeleccionado.codigo;
                }
                delete newFilters.estado; // Remover el campo estado ya que usamos estado_codigo
            }

            onFiltersChange(newFilters);
        }
    };

    const handleClearFilters = () => {
        if (onFiltersChange) {
            onFiltersChange({
                search: '',
                marca: '',
                modelo: '',
                estado_codigo: '',
                yearFrom: '',
                yearTo: '',
                priceFrom: '',
                priceTo: '',
                orderBy: 'created_at',
                order: 'desc'
            })
        }
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
                        value={
                            filters.estado_codigo && estados.length > 0
                                ? estados.find(e => e.codigo === filters.estado_codigo)?.nombre || ''
                                : ''
                        }
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: 4 }}
                        disabled={loadingOptions}
                    >
                        <MenuItem value=''>Todos los estados</MenuItem>
                        {estados.filter(estado => estado.activo).map(estado => (
                            <MenuItem key={estado.codigo || estado.id} value={estado.nombre}>
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
                        {marcas.map(marca => (
                            <MenuItem key={marca.codigo || marca.id} value={marca.nombre}>
                                {marca.nombre}
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
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label='Buscar'
                            placeholder='Dominio, marca, modelo...'
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Marca</InputLabel>
                            <Select
                                value={filters.marca || ''}
                                label='Marca'
                                onChange={(e) => handleFilterChange('marca', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todas las marcas</MenuItem>
                                {marcas.map(marca => (
                                    <MenuItem key={marca.codigo || marca.id} value={marca.nombre}>
                                        {marca.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                value={filters.modelo || ''}
                                label='Modelo'
                                onChange={(e) => handleFilterChange('modelo', e.target.value)}
                                disabled={loadingOptions || !filters.marca}
                            >
                                <MenuItem value=''>Todos los modelos</MenuItem>
                                {modelos.map(modelo => (
                                    <MenuItem key={modelo.id} value={modelo.nombre}>
                                        {modelo.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={
                                    filters.estado_codigo && estados.length > 0
                                        ? estados.find(e => e.codigo === filters.estado_codigo)?.nombre || ''
                                        : ''
                                }
                                label='Estado'
                                onChange={(e) => handleFilterChange('estado', e.target.value)}
                                disabled={loadingOptions}
                            >
                                <MenuItem value=''>Todos los estados</MenuItem>
                                {estados.filter(estado => estado.activo).map(estado => (
                                    <MenuItem key={estado.codigo || estado.id} value={estado.nombre}>
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

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            value={`${filters.orderBy || 'created_at'}_${filters.order || 'desc'}`}
                            label="Ordenar por"
                            onChange={(e) => {
                                const [orderBy, order] = e.target.value.split('_')
                                onFiltersChange({ ...filters, orderBy, order })
                            }}
                        >
                            <MenuItem value="created_at_desc">Más recientes</MenuItem>
                            <MenuItem value="created_at_asc">Más antiguos</MenuItem>
                            <MenuItem value="valor_asc">Precio menor</MenuItem>
                            <MenuItem value="valor_desc">Precio mayor</MenuItem>
                            <MenuItem value="vehiculo_ano_desc">Año más nuevo</MenuItem>
                            <MenuItem value="vehiculo_ano_asc">Año más viejo</MenuItem>
                            <MenuItem value="kilometros_asc">Menos kilómetros</MenuItem>
                            <MenuItem value="kilometros_desc">Más kilómetros</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>
        </JumboCard>
    )
}

export default VehiclesFilters