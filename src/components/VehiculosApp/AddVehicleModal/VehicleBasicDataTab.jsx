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

        // 🔍 DEBUG: Log de datos recibidos
    useEffect(() => {
        console.log('🔍 VehicleBasicDataTab - data recibido:', data)
        console.log('🔍 VehicleBasicDataTab - marca:', data?.marca, '| tipo:', typeof data?.marca, '| valor válido:', Boolean(data?.marca && data.marca !== ''))
        console.log('🔍 VehicleBasicDataTab - modelo:', data?.modelo, '| tipo:', typeof data?.modelo, '| valor válido:', Boolean(data?.modelo && data.modelo !== ''))
        console.log('🔍 VehicleBasicDataTab - version:', data?.version, '| tipo:', typeof data?.version, '| valor válido:', Boolean(data?.version && data.version !== ''))
        console.log('🔍 VehicleBasicDataTab - estado_codigo:', data?.estado_codigo, '| tipo:', typeof data?.estado_codigo, '| valor válido:', Boolean(data?.estado_codigo && data.estado_codigo !== ''))
        console.log('🔍 VehicleBasicDataTab - otros campos clave:', {
            vehiculo_ano: data?.vehiculo_ano,
            patente: data?.patente,
            kilometros: data?.kilometros,
            valor: data?.valor,
            moneda: data?.moneda,
            fecha_ingreso: data?.fecha_ingreso
        })

        // 🎯 NUEVO: Debug específico para los valores de Autocomplete
        console.log('🎯 DEBUG AUTOCOMPLETE:')
        console.log('  - data.marca:', `"${data?.marca}"`, '| length:', data?.marca?.length)
        console.log('  - data.modelo:', `"${data?.modelo}"`, '| length:', data?.modelo?.length)
        console.log('  - data.version:', `"${data?.version}"`, '| length:', data?.version?.length)
        console.log('  - marcasOptions:', marcasOptions)
        console.log('  - modelosOptions:', modelosOptions) 
        console.log('  - versionesOptions:', versionesOptions)
    }, [data, marcasOptions, modelosOptions, versionesOptions])

    // 🚀 NUEVO: Cargar opciones inmediatamente al recibir datos (modo edición)
    useEffect(() => {
        if (data.marca || data.modelo || data.version) {
            console.log('🔄 Datos iniciales detectados - Cargando opciones para modo edición')
            console.log('  - Marca inicial:', data.marca)
            console.log('  - Modelo inicial:', data.modelo) 
            console.log('  - Versión inicial:', data.version)
            
            // Cargar marcas si aún no están cargadas
            if (marcasOptions.length === 0) {
                loadMarcas()
            }
            
            // Cargar modelos si hay marca
            if (data.marca && modelosOptions.length === 0) {
                loadModelos(data.marca)
            }
            
            // Cargar versiones si hay marca y modelo
            if (data.marca && data.modelo && versionesOptions.length === 0) {
                loadVersiones(data.marca, data.modelo)
            }
        }
    }, [data.marca, data.modelo, data.version, marcasOptions.length, modelosOptions.length, versionesOptions.length])

    // 🎯 NUEVO: Efecto para verificar si los valores están en las opciones después de cargar
    useEffect(() => {
        if (data.marca && marcasOptions.length > 0) {
            const marcaEncontrada = marcasOptions.includes(data.marca)
            console.log('🔍 Verificando marca en opciones:', data.marca, 'encontrada:', marcaEncontrada)
            if (!marcaEncontrada) {
                console.log('⚠️ Marca no encontrada en opciones, agregándola:', data.marca)
                setMarcasOptions(prev => {
                    if (!prev.includes(data.marca)) {
                        return [data.marca, ...prev]
                    }
                    return prev
                })
            }
        }

        if (data.modelo && modelosOptions.length > 0 && data.marca) {
            const modeloEncontrado = modelosOptions.includes(data.modelo)
            console.log('🔍 Verificando modelo en opciones:', data.modelo, 'encontrado:', modeloEncontrado)
            if (!modeloEncontrado) {
                console.log('⚠️ Modelo no encontrado en opciones, agregándolo:', data.modelo)
                setModelosOptions(prev => {
                    if (!prev.includes(data.modelo)) {
                        return [data.modelo, ...prev]
                    }
                    return prev
                })
            }
        }

        if (data.version && versionesOptions.length > 0) {
            const versionEncontrada = versionesOptions.includes(data.version)
            console.log('🔍 Verificando versión en opciones:', data.version, 'encontrada:', versionEncontrada)
            if (!versionEncontrada) {
                console.log('⚠️ Versión no encontrada en opciones, agregándola:', data.version)
                setVersionesOptions(prev => {
                    if (!prev.includes(data.version)) {
                        return [data.version, ...prev]
                    }
                    return prev
                })
            }
        }
    }, [data.marca, data.modelo, data.version, marcasOptions, modelosOptions, versionesOptions])    // Generar años desde 1970 hasta año actual + 2
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
            console.log('🔄 Marca cambió, cargando modelos para:', data.marca)
            loadModelos(data.marca)
        } else {
            setModelosOptions([])
            setVersionesOptions([])
        }
    }, [data.marca])

    // Cargar versiones cuando cambia el modelo
    useEffect(() => {
        if (data.marca && data.modelo) {
            console.log('🔄 Modelo cambió, cargando versiones para:', data.marca, data.modelo)
            loadVersiones(data.marca, data.modelo)
        } else {
            setVersionesOptions([])
        }
    }, [data.marca, data.modelo])

    // 🔄 MEJORADO: Asegurar que los valores actuales estén en las opciones
    useEffect(() => {
        if (data.marca && marcasOptions.length > 0) {
            const marcaExists = marcasOptions.some(marca =>
                typeof marca === 'string' ? marca === data.marca : marca.nombre === data.marca
            )
            if (!marcaExists) {
                console.log('🔄 Agregando marca faltante a opciones:', data.marca)
                setMarcasOptions(prev => [...prev, data.marca])
            }
        }
    }, [data.marca, marcasOptions])

    useEffect(() => {
        if (data.modelo && modelosOptions.length > 0 && data.marca) {
            const modeloExists = modelosOptions.some(modelo =>
                typeof modelo === 'string' ? modelo === data.modelo : modelo.nombre === data.modelo
            )
            if (!modeloExists) {
                console.log('🔄 Agregando modelo faltante a opciones:', data.modelo)
                setModelosOptions(prev => [...prev, data.modelo])
            }
        }
    }, [data.modelo, modelosOptions, data.marca])

    useEffect(() => {
        if (data.version && versionesOptions.length > 0 && data.marca && data.modelo) {
            const versionExists = versionesOptions.some(version =>
                typeof version === 'string' ? version === data.version : version.nombre === data.version
            )
            if (!versionExists) {
                console.log('🔄 Agregando versión faltante a opciones:', data.version)
                setVersionesOptions(prev => [...prev, data.version])
            }
        }
    }, [data.version, versionesOptions, data.marca, data.modelo])

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

                // Establecer DISPONIBLE como valor por defecto SOLO si no hay estado seleccionado Y no hay datos prellenados
                if (!data.estado_codigo) {
                    const estadoDisponible = response.estados.find(e => e.codigo === 'DISPONIBLE')
                    if (estadoDisponible) {
                        console.log('🎯 Estableciendo DISPONIBLE como estado por defecto (modo creación)')
                        handleFieldChange('estado_codigo', 'DISPONIBLE')
                    }
                } else {
                    console.log('🔄 Estado ya prellenado en modo edición:', data.estado_codigo)
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

                // Asegurar que la marca actual esté en las opciones (modo edición)
                if (data.marca && !marcas.includes(data.marca)) {
                    console.log('🔄 Incluyendo marca actual en opciones:', data.marca)
                    marcas.unshift(data.marca) // Agregar al principio
                }

                setMarcasOptions(marcas)
                console.log('✅ Marcas cargadas:', marcas.length, 'marcas. Marca actual:', data.marca)
            }
        } catch (error) {
            console.error('Error cargando marcas:', error)
            const fallbackMarcas = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan']

            // Incluir marca actual en fallback también
            if (data.marca && !fallbackMarcas.includes(data.marca)) {
                fallbackMarcas.unshift(data.marca)
            }

            setMarcasOptions(fallbackMarcas)
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

                // Asegurar que el modelo actual esté en las opciones (modo edición)
                if (data.modelo && data.marca === marca && !modelos.includes(data.modelo)) {
                    console.log('🔄 Incluyendo modelo actual en opciones:', data.modelo)
                    modelos.unshift(data.modelo) // Agregar al principio
                }

                setModelosOptions(modelos)
                console.log('✅ Modelos cargados para', marca, ':', modelos.length, 'modelos. Modelo actual:', data.modelo)
            }
        } catch (error) {
            console.error('Error cargando modelos:', error)
            // Si hay un modelo actual y coincide la marca, incluirlo en las opciones vacías
            const fallbackModelos = []
            if (data.modelo && data.marca === marca) {
                fallbackModelos.push(data.modelo)
                console.log('🔄 Usando modelo actual como fallback:', data.modelo)
            }
            setModelosOptions(fallbackModelos)
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

        // Asegurar que la versión actual esté en las opciones (modo edición)
        if (data.version && !versionesGenericas.includes(data.version)) {
            console.log('🔄 Incluyendo versión actual en opciones:', data.version)
            versionesGenericas.unshift(data.version) // Agregar al principio
        }

        setVersionesOptions(versionesGenericas)
        console.log('✅ Versiones cargadas:', versionesGenericas.length, 'versiones. Versión actual:', data.version)
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
                        value={data.marca || null}
                        onChange={(event, newValue) => {
                            console.log('🔄 Marca seleccionada desde lista:', newValue)
                            handleFieldChange('marca', newValue || '')
                        }}
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        loading={loadingMarcas}
                        getOptionLabel={(option) => {
                            return typeof option === 'string' ? option : (option?.nombre || option?.marca || '')
                        }}
                        isOptionEqualToValue={(option, value) => {
                            if (!option || !value) return false
                            const optionStr = typeof option === 'string' ? option : (option?.nombre || option?.marca || '')
                            const valueStr = typeof value === 'string' ? value : (value?.nombre || value?.marca || '')
                            return optionStr === valueStr
                        }}
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
                        value={data.modelo || null}
                        onChange={(event, newValue) => {
                            console.log('🔄 Modelo seleccionado desde lista:', newValue)
                            handleFieldChange('modelo', newValue || '')
                        }}
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        loading={loadingModelos}
                        disabled={!data.marca}
                        getOptionLabel={(option) => {
                            return typeof option === 'string' ? option : (option?.modelo || option?.nombre || '')
                        }}
                        isOptionEqualToValue={(option, value) => {
                            if (!option || !value) return false
                            const optionStr = typeof option === 'string' ? option : (option?.modelo || option?.nombre || '')
                            const valueStr = typeof value === 'string' ? value : (value?.modelo || value?.nombre || '')
                            return optionStr === valueStr
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Modelo *"
                                error={!!errors.modelo}
                                helperText={errors.modelo || (!data.marca ? 'Selecciona primero una marca' : 'Puedes seleccionar un modelo existente o escribir uno nuevo')}
                                placeholder="Ej: Corolla, Civic, Focus, o tu modelo nuevo..."
                            />
                        )}
                    />
                </Grid>

                {/* Versión */}
                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={versionesOptions}
                        value={data.version || null}
                        onChange={(event, newValue) => {
                            console.log('🔄 Versión seleccionada desde lista:', newValue)
                            handleFieldChange('version', newValue || '')
                        }}
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        getOptionLabel={(option) => {
                            return typeof option === 'string' ? option : (option?.version || option?.nombre || '')
                        }}
                        isOptionEqualToValue={(option, value) => {
                            if (!option || !value) return false
                            const optionStr = typeof option === 'string' ? option : (option?.version || option?.nombre || '')
                            const valueStr = typeof value === 'string' ? value : (value?.version || value?.nombre || '')
                            return optionStr === valueStr
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Versión"
                                error={!!errors.version}
                                helperText={errors.version || 'Puedes seleccionar una versión existente o escribir una nueva'}
                                placeholder="Ej: Base, LX, Sport, o tu versión..."
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