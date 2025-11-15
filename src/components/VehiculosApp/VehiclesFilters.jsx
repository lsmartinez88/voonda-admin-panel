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

const estadosVehiculos = [
    { value: '', label: 'Todos los estados' },
    { value: 'salon', label: 'Salón' },
    { value: 'consignacion', label: 'Consignación' }
]

export const VehiclesFilters = ({
    filters = {},
    onFiltersChange,
    loading = false
}) => {
    
    const handleFilterChange = (field, value) => {
        if (onFiltersChange) {
            onFiltersChange({ ...filters, [field]: value })
        }
    }

    const handleClearFilters = () => {
        if (onFiltersChange) {
            onFiltersChange({
                search: '',
                marca: '',
                modelo: '',
                condicion: '',
                sortBy: 'fecha_ingreso',
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
                        value={filters.condicion || ''}
                        onChange={(e) => handleFilterChange('condicion', e.target.value)}
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
                    value={filters.marca || ''}
                    onChange={(e) => handleFilterChange('marca', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 4 },
                        minWidth: 100
                    }}
                />
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
                        <TextField
                            fullWidth
                            label='Marca'
                            value={filters.marca || ''}
                            onChange={(e) => handleFilterChange('marca', e.target.value)}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label='Modelo'
                            value={filters.modelo || ''}
                            onChange={(e) => handleFilterChange('modelo', e.target.value)}
                            size='small'
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.condicion || ''}
                                label='Estado'
                                onChange={(e) => handleFilterChange('condicion', e.target.value)}
                            >
                                {estadosVehiculos.map(estado => (
                                    <MenuItem key={estado.value} value={estado.value}>
                                        {estado.label}
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
                            value={`${filters.sortBy || 'fecha_ingreso'}_${filters.order || 'desc'}`}
                            label="Ordenar por"
                            onChange={(e) => {
                                const [sortBy, order] = e.target.value.split('_')
                                onFiltersChange({ ...filters, sortBy, order })
                            }}
                        >
                            <MenuItem value="fecha_ingreso_desc">Más recientes</MenuItem>
                            <MenuItem value="fecha_ingreso_asc">Más antiguos</MenuItem>
                            <MenuItem value="marca_asc">Marca A-Z</MenuItem>
                            <MenuItem value="marca_desc">Marca Z-A</MenuItem>
                            <MenuItem value="precio_asc">Precio menor</MenuItem>
                            <MenuItem value="precio_desc">Precio mayor</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Box>
        </JumboCard>
    )
}

export default VehiclesFilters