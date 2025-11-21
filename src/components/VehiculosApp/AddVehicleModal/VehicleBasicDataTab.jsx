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

    // 🔧 ESTADO LOCAL para campos que se resetean
    const [localVersion, setLocalVersion] = useState('')

    // 🔍 DEBUG: Log de datos recibidos (solo cuando cambian los datos)
    useEffect(() => {
        console.log('🔍 VehicleBasicDataTab - data recibido:', {
            marca: data?.marca,
            modelo: data?.modelo,
            version: data?.version,
            estado_codigo: data?.estado_codigo,
            vehiculo_ano: data?.vehiculo_ano,
            patente: data?.patente,
            valor: data?.valor
        })
    }, [data])

    // 🔧 SINCRONIZACIÓN: Inicializar estado local solo una vez con datos iniciales
    useEffect(() => {
        if (data?.version && localVersion === '') {
            console.log('🔄 Inicializando localVersion con valor inicial:', data.version)
            setLocalVersion(data.version)
        }
    }, [data?.version, localVersion])

    // 🔄 Cargar opciones cuando se monta el componente
    useEffect(() => {
        loadMarcas()
        loadEstados()
    }, [])

    // 🎯 Cargar modelos cuando cambia la marca
    useEffect(() => {
        if (data.marca && marcasOptions.length > 0) {
            loadModelos(data.marca)
        }
    }, [data.marca, marcasOptions.length])

    // 🎯 Cargar versiones cuando cambia el modelo
    useEffect(() => {
        if (data.marca && data.modelo) {
            loadVersiones(data.marca, data.modelo)
        }
    }, [data.marca, data.modelo])

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

                // NO establecer estado automáticamente en modo edición
                console.log('✅ Estados cargados, esperando selección manual del usuario')
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
            console.log('✅ Estados fallback cargados, esperando selección manual')
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

                // Las opciones se cargarán completas y luego se incluirá la marca actual si es necesario
                setMarcasOptions(marcas)
                console.log('✅ Marcas cargadas:', marcas.length, 'marcas')
            }
        } catch (error) {
            console.error('Error cargando marcas:', error)
            const fallbackMarcas = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan']
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

                // Las opciones se cargarán y luego el Autocomplete mostrará el valor actual
                setModelosOptions(modelos)
                console.log('✅ Modelos cargados para', marca, ':', modelos.length, 'modelos')
            }
        } catch (error) {
            console.error('Error cargando modelos:', error)
            setModelosOptions([]) // Opciones vacías en caso de error
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

        // Las versiones genéricas siempre estarán disponibles
        setVersionesOptions(versionesGenericas)
        console.log('✅ Versiones cargadas:', versionesGenericas.length, 'versiones')
    }

    const handleFieldChange = (field, value) => {
        console.log(`🔄 Campo cambiado: ${field} = ${value}`)

        // Validación específica de patente
        if (field === 'patente' && value) {
            const patenteValidada = validatePatente(value)
            console.log(`🔍 Validación de patente: ${value} -> válida: ${patenteValidada.isValid}`, patenteValidada.error || '')
        }

        onChange({
            [field]: value
        })
    }

    // Función para validar formato de patente argentina
    const validatePatente = (patente) => {
        if (!patente || patente.trim() === '') {
            return { isValid: false, error: 'Patente es requerida' }
        }

        const patenteClean = patente.trim().toUpperCase().replace(/[\s-]/g, '') // Remover espacios y guiones

        // Formato viejo: ABC123 (3 letras + 3 números)
        const formatoViejo = /^[A-Z]{3}[0-9]{3}$/

        // Formato nuevo: AB123CD (2 letras + 3 números + 2 letras)  
        const formatoNuevo = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/

        // Formato mercosur: AB123CD (similar al nuevo)
        const formatoMercosur = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/

        if (formatoViejo.test(patenteClean) || formatoNuevo.test(patenteClean) || formatoMercosur.test(patenteClean)) {
            return { isValid: true }
        }

        return {
            isValid: false,
            error: 'Formato inválido. Use ABC123 (viejo) o AB123CD (nuevo)'
        }
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
                        value={localVersion || null}
                        onChange={(event, newValue) => {
                            const versionValue = newValue || ''
                            console.log('🔄 Versión seleccionada desde lista:', versionValue)
                            setLocalVersion(versionValue) // Actualizar estado local
                            handleFieldChange('version', versionValue) // Notificar al padre
                        }}
                        onInputChange={(event, newInputValue) => {
                            console.log('🔄 Versión escrita manualmente:', newInputValue)
                            setLocalVersion(newInputValue) // Actualizar estado local mientras escribe
                            handleFieldChange('version', newInputValue) // Notificar al padre
                        }}
                        freeSolo
                        selectOnFocus
                        clearOnBlur={false} // ⚡ NO limpiar al perder foco
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
                    <TextField
                        fullWidth
                        label="Año *"
                        value={data.vehiculo_ano || currentYear}
                        onChange={(e) => {
                            const value = e.target.value
                            // Solo permitir números
                            if (value === '' || /^\d+$/.test(value)) {
                                const numValue = value === '' ? '' : parseInt(value)
                                handleFieldChange('vehiculo_ano', numValue)
                            }
                        }}
                        error={!!errors.vehiculo_ano}
                        helperText={errors.vehiculo_ano || 'Ingresa el año del vehículo (ej: 2020)'}
                        placeholder="2020"
                        inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            min: 1970,
                            max: new Date().getFullYear() + 1
                        }}
                    />
                </Grid>

                {/* Patente */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Patente *"
                        value={data.patente || ''}
                        onChange={(e) => handleFieldChange('patente', e.target.value.toUpperCase())}
                        error={!!errors.patente}
                        helperText={errors.patente || 'Formato: ABC123 o AB123CD'}
                        placeholder="ABC123 o AB123CD"
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