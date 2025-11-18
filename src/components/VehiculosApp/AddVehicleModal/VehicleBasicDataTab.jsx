import React, { useState, useEffect } from 'react'
import {
    Grid,
    TextField,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    InputAdornment,
    Typography,
    Box
} from '@mui/material'
import vehiculosService from '../../../services/api/vehiculosService'

const VehicleBasicDataTab = ({ data, errors, onChange }) => {
    const [marcasOptions, setMarcasOptions] = useState([])
    const [modelosOptions, setModelosOptions] = useState([])
    const [versionesOptions, setVersionesOptions] = useState([])
    const [loadingMarcas, setLoadingMarcas] = useState(false)
    const [loadingModelos, setLoadingModelos] = useState(false)
    const [loadingVersiones, setLoadingVersiones] = useState(false)

    // Generar años desde 1970 hasta año actual + 2
    const currentYear = new Date().getFullYear()
    const añosOptions = []
    for (let year = currentYear + 2; year >= 1970; year--) {
        añosOptions.push(year)
    }

    const monedaOptions = [
        { value: 'ARS', label: 'ARS - Peso Argentino' },
        { value: 'USD', label: 'USD - Dólar Estadounidense' }
    ]

    // Cargar marcas al inicializar
    useEffect(() => {
        loadMarcas()
    }, [])

    // Cargar modelos cuando cambia la marca
    useEffect(() => {
        if (data.marca) {
            loadModelos(data.marca)
        } else {
            setModelosOptions([])
            setVersionesOptions([])
        }
    }, [data.marca])

    // Cargar versiones cuando cambia el modelo
    useEffect(() => {
        if (data.marca && data.modelo) {
            loadVersiones(data.marca, data.modelo)
        } else {
            setVersionesOptions([])
        }
    }, [data.marca, data.modelo])

    const loadMarcas = async () => {
        setLoadingMarcas(true)
        try {
            const response = await vehiculosService.getMarcas()
            if (response.success) {
                const marcas = response.marcas.map(marca => 
                    typeof marca === 'string' ? marca : marca.nombre || marca.marca
                )
                setMarcasOptions(marcas)
            }
        } catch (error) {
            console.error('Error cargando marcas:', error)
            setMarcasOptions(['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan'])
        } finally {
            setLoadingMarcas(false)
        }
    }

    const loadModelos = async (marca) => {
        setLoadingModelos(true)
        try {
            const response = await vehiculosService.getModelosByMarca(marca)
            if (response.success) {
                const modelos = response.modelos.map(modelo =>
                    typeof modelo === 'string' ? modelo : modelo.modelo || modelo.nombre
                )
                setModelosOptions(modelos)
            }
        } catch (error) {
            console.error('Error cargando modelos:', error)
            setModelosOptions([])
        } finally {
            setLoadingModelos(false)
        }
    }

    const loadVersiones = async (marca, modelo) => {
        setLoadingVersiones(true)
        try {
            // Por ahora usamos versiones genéricas hasta que tengamos el endpoint
            const versionesGenericas = [
                'Base', 'LX', 'EX', 'EXL', 'Touring', 'Sport', 'Limited',
                'SE', 'SEL', 'Titanium', 'ST', 'RS', 'S', 'SL', 'SV',
                'XE', 'XEI', 'XLI', 'GLI', 'TDI', 'TSI', 'GTI'
            ]
            setVersionesOptions(versionesGenericas)
        } catch (error) {
            console.error('Error cargando versiones:', error)
            setVersionesOptions([])
        } finally {
            setLoadingVersiones(false)
        }
    }

    const handleFieldChange = (field, value) => {
        onChange({
            [field]: value
        })
    }

    const handleDateChange = (event) => {
        const dateValue = event.target.value
        handleFieldChange('fecha_ingreso', dateValue)
    }

    const formatNumber = (value) => {
        if (!value) return ''
        return new Intl.NumberFormat('es-AR').format(value)
    }

    const parseNumber = (value) => {
        if (!value) return 0
        return parseInt(value.toString().replace(/[.,]/g, '')) || 0
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                Información del Vehículo
            </Typography>

            <Grid container spacing={3}>
                    {/* Marca */}
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={marcasOptions}
                            value={data.marca || ''}
                            onChange={(event, newValue) => {
                                handleFieldChange('marca', newValue || '')
                            }}
                            freeSolo
                            loading={loadingMarcas}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Marca *"
                                    error={!!errors.marca}
                                    helperText={errors.marca}
                                    placeholder="Ej: Toyota, Honda, Ford..."
                                />
                            )}
                        />
                    </Grid>

                    {/* Modelo */}
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={modelosOptions}
                            value={data.modelo || ''}
                            onChange={(event, newValue) => {
                                handleFieldChange('modelo', newValue || '')
                            }}
                            freeSolo
                            loading={loadingModelos}
                            disabled={!data.marca}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Modelo *"
                                    error={!!errors.modelo}
                                    helperText={errors.modelo || (!data.marca ? 'Selecciona una marca primero' : '')}
                                    placeholder="Ej: Corolla, Civic, Focus..."
                                />
                            )}
                        />
                    </Grid>

                    {/* Versión */}
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={versionesOptions}
                            value={data.version || ''}
                            onChange={(event, newValue) => {
                                handleFieldChange('version', newValue || '')
                            }}
                            freeSolo
                            loading={loadingVersiones}
                            disabled={!data.marca || !data.modelo}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Versión"
                                    error={!!errors.version}
                                    helperText={errors.version || (!data.modelo ? 'Selecciona un modelo primero' : '')}
                                    placeholder="Ej: XEI, LX, SE..."
                                />
                            )}
                        />
                    </Grid>

                    {/* Año */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth error={!!errors.vehiculo_ano}>
                            <InputLabel>Año *</InputLabel>
                            <Select
                                value={data.vehiculo_ano || currentYear}
                                onChange={(e) => handleFieldChange('vehiculo_ano', e.target.value)}
                                label="Año *"
                            >
                                {añosOptions.map(año => (
                                    <MenuItem key={año} value={año}>
                                        {año}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.vehiculo_ano && (
                                <FormHelperText>{errors.vehiculo_ano}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Patente */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Patente *"
                            value={data.patente || ''}
                            onChange={(e) => handleFieldChange('patente', e.target.value.toUpperCase())}
                            error={!!errors.patente}
                            helperText={errors.patente}
                            placeholder="ABC123"
                            inputProps={{ maxLength: 15 }}
                        />
                    </Grid>

                    {/* Kilómetros */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Kilómetros"
                            type="text"
                            value={formatNumber(data.kilometros)}
                            onChange={(e) => {
                                const numValue = parseNumber(e.target.value)
                                handleFieldChange('kilometros', numValue)
                            }}
                            error={!!errors.kilometros}
                            helperText={errors.kilometros}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">km</InputAdornment>
                            }}
                            placeholder="0"
                        />
                    </Grid>

                    {/* Moneda */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Moneda</InputLabel>
                            <Select
                                value={data.moneda || 'ARS'}
                                onChange={(e) => handleFieldChange('moneda', e.target.value)}
                                label="Moneda"
                            >
                                {monedaOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Valor */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Valor *"
                            type="text"
                            value={formatNumber(data.valor)}
                            onChange={(e) => {
                                const numValue = parseNumber(e.target.value)
                                handleFieldChange('valor', numValue)
                            }}
                            error={!!errors.valor}
                            helperText={errors.valor}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {data.moneda || 'ARS'}
                                    </InputAdornment>
                                )
                            }}
                            placeholder="2.500.000"
                        />
                    </Grid>

                    {/* Fecha de Ingreso */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Ingreso *"
                            type="date"
                            value={data.fecha_ingreso || ''}
                            onChange={handleDateChange}
                            error={!!errors.fecha_ingreso}
                            helperText={errors.fecha_ingreso}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
    )
}

export default VehicleBasicDataTab