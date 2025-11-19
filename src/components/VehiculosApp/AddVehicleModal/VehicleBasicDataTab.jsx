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
    Box,
    Tooltip,
    IconButton
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import vehiculosService from '../../../services/api/vehiculosService'
import estadosService from '../../../services/api/estadosService'

const VehicleBasicDataTab = ({ data, errors, onChange }) => {
    const [marcasOptions, setMarcasOptions] = useState([])
    const [modelosOptions, setModelosOptions] = useState([])
    const [versionesOptions, setVersionesOptions] = useState([])
    const [estadosOptions, setEstadosOptions] = useState([])
    const [loadingMarcas, setLoadingMarcas] = useState(false)
    const [loadingModelos, setLoadingModelos] = useState(false)
    const [loadingEstados, setLoadingEstados] = useState(false)

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
        loadEstados()
    }, [])

    // Cargar modelos cuando cambia la marca
    useEffect(() => {
        if (data.marca) {
            loadModelos(data.marca)
        } else {
            setModelosOptions([])
        }
    }, [data.marca])

    // Cargar versiones cuando cambia el modelo
    useEffect(() => {
        loadVersiones(data.marca, data.modelo)
    }, [data.marca, data.modelo])

    const loadEstados = async () => {
        setLoadingEstados(true)
        console.log('🔄 Cargando estados desde API...')
        try {
            const response = await estadosService.getEstados()
            console.log('📋 Respuesta de estados completa:', response)
            console.log('📋 response.success:', response.success)
            console.log('📋 response.estados:', response.estados)
            console.log('📋 response.data:', response.data)

            if (response.success && response.estados) {
                console.log('✅ Estados encontrados en response.estados:', response.estados.length, 'estados')
                setEstadosOptions(response.estados)

                // Establecer DISPONIBLE como valor por defecto si no hay estado seleccionado
                if (!data.estado_codigo) {
                    const estadoDisponible = response.estados.find(e => e.codigo === 'DISPONIBLE')
                    if (estadoDisponible) {
                        console.log('🎯 Estableciendo DISPONIBLE como estado por defecto')
                        handleFieldChange('estado_codigo', 'DISPONIBLE')
                    }
                }
            } else {
                console.warn('⚠️ Respuesta de estados no válida:', response)
            }
        } catch (error) {
            console.error('❌ Error cargando estados:', error)
            // Fallback con estado básico
            const fallbackEstados = [{
                id: '1',
                codigo: 'DISPONIBLE',
                nombre: 'Disponible',
                descripcion: 'Vehículo disponible para la venta'
            }]
            console.log('🔄 Usando estados de fallback:', fallbackEstados)
            setEstadosOptions(fallbackEstados)
            if (!data.estado_codigo) {
                handleFieldChange('estado_codigo', 'DISPONIBLE')
            }
        } finally {
            setLoadingEstados(false)
        }
    }

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
        // Siempre cargar versiones genéricas como sugerencias
        // Pero permitir ingreso libre independientemente del modelo
        const versionesGenericas = [
            'Base', 'LX', 'EX', 'EXL', 'Touring', 'Sport', 'Limited',
            'SE', 'SEL', 'Titanium', 'ST', 'RS', 'S', 'SL', 'SV',
            'XE', 'XEI', 'XLI', 'GLI', 'TDI', 'TSI', 'GTI', 'Hybrid',
            'Electric', 'Diesel', 'Turbo', 'AWD', '4WD', '2WD'
        ]
        setVersionesOptions(versionesGenericas)
    }

    const handleFieldChange = (field, value) => {
        console.log(`🔄 Campo cambiado: ${field} = ${value}`)
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
                        onInputChange={(event, newInputValue) => {
                            handleFieldChange('marca', newInputValue || '')
                        }}
                        freeSolo
                        loading={loadingMarcas}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Marca *"
                                error={!!errors.marca}
                                helperText={errors.marca || 'Puedes seleccionar una marca existente o escribir una nueva'}
                                placeholder="Ej: Toyota, Honda, Ford, o tu marca nueva..."
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
                        onInputChange={(event, newInputValue) => {
                            handleFieldChange('modelo', newInputValue || '')
                        }}
                        freeSolo
                        loading={loadingModelos}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Modelo *"
                                error={!!errors.modelo}
                                helperText={errors.modelo || 'Puedes seleccionar un modelo existente o escribir uno nuevo'}
                                placeholder="Ej: Corolla, Civic, Focus, o tu modelo nuevo..."
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
                        onInputChange={(event, newInputValue) => {
                            handleFieldChange('version', newInputValue || '')
                        }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Versión *"
                                error={!!errors.version}
                                helperText={errors.version || 'La versión es requerida. Puedes seleccionar una sugerida o escribir una nueva'}
                                placeholder="Ej: XEI, LX, SE, o tu versión nueva..."
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

                {/* Estado */}
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth error={!!errors.estado_codigo}>
                        <InputLabel>Estado *</InputLabel>
                        <Select
                            value={data.estado_codigo || ''}
                            onChange={(e) => {
                                console.log('🎯 Estado seleccionado en combo:', e.target.value)
                                console.log('🎯 Datos actuales antes del cambio:', data)
                                handleFieldChange('estado_codigo', e.target.value)
                            }}
                            label="Estado *"
                            disabled={loadingEstados}
                        >
                            {estadosOptions.map(estado => (
                                <MenuItem key={estado.id} value={estado.codigo}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography sx={{ flexGrow: 1 }}>
                                            {estado.nombre}
                                        </Typography>
                                        <Tooltip
                                            title={estado.descripcion || 'Sin descripción disponible'}
                                            placement="top"
                                        >
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    p: 0.25,
                                                    minWidth: 20,
                                                    width: 20,
                                                    height: 20,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                    }
                                                }}
                                            >
                                                <InfoIcon
                                                    sx={{
                                                        fontSize: 12,
                                                        color: '#757575'
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.estado_codigo && (
                            <FormHelperText>{errors.estado_codigo}</FormHelperText>
                        )}
                    </FormControl>
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
                <Grid item xs={12} md={3}>
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