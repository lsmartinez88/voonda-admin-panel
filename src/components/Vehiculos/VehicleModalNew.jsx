import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    Divider,
    Tabs,
    Tab,
    Chip,
    FormHelperText,
    Autocomplete
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { vehiculosService, vendedoresService, compradoresService, estadosService } from '@/services/api'

const VehicleModalNew = ({ vehicle, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        // Campos requeridos por la nueva API
        modelo_id: '',
        vehiculo_ano: new Date().getFullYear(),
        patente: '',
        kilometros: 0,
        valor: '',
        moneda: 'ARS',
        estado_codigo: 'salon',
        estado_id: '',
        tipo_operacion: '',
        fecha_ingreso: '',
        observaciones: '',

        // Nuevos campos según la documentación
        pendientes_preparacion: [],
        comentarios: '',
        vendedor_id: '',
        comprador_id: ''
    })

    const [errors, setErrors] = useState({})
    const [activeTab, setActiveTab] = useState(0)
    const [loading, setLoading] = useState(false)

    // Estados para dropdowns
    const [estados, setEstados] = useState([])
    const [vendedores, setVendedores] = useState([])
    const [compradores, setCompradores] = useState([])

    // Estados para manejo de arrays
    const [newPendiente, setNewPendiente] = useState('')

    // Cargar datos necesarios al montar el componente
    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar estados disponibles
                const estadosResponse = await estadosService.getEstados()
                if (estadosResponse.success) {
                    setEstados(estadosResponse.estados)
                }

                // Cargar vendedores para select
                const vendedoresResponse = await vendedoresService.getVendedoresForSelect()
                if (Array.isArray(vendedoresResponse)) {
                    setVendedores(vendedoresResponse)
                }

                // Cargar compradores para select
                const compradoresResponse = await compradoresService.getCompradoresForSelect()
                if (Array.isArray(compradoresResponse)) {
                    setCompradores(compradoresResponse)
                }
            } catch (error) {
                console.error('Error cargando datos:', error)
            }
        }

        loadData()
    }, [])

    // Mapear datos del vehículo cuando se recibe (para edición)
    useEffect(() => {
        if (vehicle) {
            const mappedVehicle = {
                modelo_id: vehicle.modelo_id || '',
                vehiculo_ano: vehicle.vehiculo_ano || new Date().getFullYear(),
                patente: vehicle.patente || '',
                kilometros: vehicle.kilometros || 0,
                valor: vehicle.valor || '',
                moneda: vehicle.moneda || 'ARS',
                estado_codigo: vehicle.estado?.codigo || 'salon',
                estado_id: vehicle.estado?.id || '',
                tipo_operacion: vehicle.tipo_operacion || '',
                fecha_ingreso: vehicle.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : '',
                observaciones: vehicle.observaciones || '',

                // Nuevos campos
                pendientes_preparacion: vehicle.pendientes_preparacion || [],
                comentarios: vehicle.comentarios || '',
                vendedor_id: vehicle.vendedor_id || '',
                comprador_id: vehicle.comprador_id || ''
            }

            setFormData(mappedVehicle)
        }
    }, [vehicle])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }))

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Si cambió el estado_codigo, buscar el estado_id correspondiente
        if (name === 'estado_codigo' && newValue) {
            const estado = estados.find(e => e.codigo === newValue)
            if (estado) {
                setFormData(prev => ({
                    ...prev,
                    estado_id: estado.id
                }))
            }
        }
    }

    const handleAutocompleteChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value ? value.value : ''
        }))

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // Manejar pendientes de preparación
    const addPendiente = () => {
        if (newPendiente.trim()) {
            setFormData(prev => ({
                ...prev,
                pendientes_preparacion: [...prev.pendientes_preparacion, newPendiente.trim()]
            }))
            setNewPendiente('')
        }
    }

    const removePendiente = (index) => {
        setFormData(prev => ({
            ...prev,
            pendientes_preparacion: prev.pendientes_preparacion.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        // Validaciones según la nueva API
        if (!formData.modelo_id) {
            newErrors.modelo_id = 'El modelo es requerido'
        }

        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1950 || formData.vehiculo_ano > new Date().getFullYear() + 1) {
            newErrors.vehiculo_ano = `Año inválido (1950 - ${new Date().getFullYear() + 1})`
        }

        if (formData.kilometros && formData.kilometros < 0) {
            newErrors.kilometros = 'Los kilómetros no pueden ser negativos'
        }

        if (formData.valor && formData.valor < 0) {
            newErrors.valor = 'El valor no puede ser negativo'
        }

        if (formData.patente && formData.patente.length > 15) {
            newErrors.patente = 'La patente no puede tener más de 15 caracteres'
        }

        if (formData.observaciones && formData.observaciones.length > 1000) {
            newErrors.observaciones = 'Las observaciones no pueden tener más de 1000 caracteres'
        }

        if (formData.comentarios && formData.comentarios.length > 2000) {
            newErrors.comentarios = 'Los comentarios no pueden tener más de 2000 caracteres'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            // Preparar datos según la nueva estructura de la API
            const dataToSend = {
                modelo_id: formData.modelo_id,
                vehiculo_ano: parseInt(formData.vehiculo_ano),
                patente: formData.patente || null,
                kilometros: parseInt(formData.kilometros) || 0,
                valor: formData.valor ? parseFloat(formData.valor) : null,
                moneda: formData.moneda || 'ARS',
                estado_codigo: formData.estado_codigo || 'salon',
                tipo_operacion: formData.tipo_operacion || null,
                fecha_ingreso: formData.fecha_ingreso || null,
                observaciones: formData.observaciones || null,

                // Nuevos campos
                pendientes_preparacion: formData.pendientes_preparacion.length > 0 ? formData.pendientes_preparacion : null,
                comentarios: formData.comentarios || null,
                vendedor_id: formData.vendedor_id || null,
                comprador_id: formData.comprador_id || null
            }

            let response
            if (vehicle?.id) {
                // Actualizar vehículo existente
                response = await vehiculosService.updateVehiculo(vehicle.id, dataToSend)
            } else {
                // Crear nuevo vehículo
                response = await vehiculosService.createVehiculo(dataToSend)
            }

            if (response.success) {
                onSave(response.vehiculo || response.data)
            } else {
                setErrors({ general: response.error || 'Error al guardar el vehículo' })
            }
        } catch (error) {
            console.error('Error al guardar vehículo:', error)
            setErrors({ general: error.message || 'Error al guardar el vehículo' })
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'basica', label: 'Información Básica' },
        { id: 'comercial', label: 'Información Comercial' },
        { id: 'adicional', label: 'Información Adicional' }
    ]

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, maxHeight: '90vh' }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, index) => (
                        <Tab key={tab.id} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            <DialogContent sx={{ py: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Error general */}
                    {errors.general && (
                        <Box sx={{ mb: 3 }}>
                            <Typography color="error" variant="body2">
                                {errors.general}
                            </Typography>
                        </Box>
                    )}

                    {/* Tab: Información Básica */}
                    {activeTab === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Datos del Vehículo
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Año del Vehículo"
                                        name="vehiculo_ano"
                                        type="number"
                                        value={formData.vehiculo_ano}
                                        onChange={handleChange}
                                        error={!!errors.vehiculo_ano}
                                        helperText={errors.vehiculo_ano}
                                        required
                                        inputProps={{ min: 1950, max: new Date().getFullYear() + 1 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Patente"
                                        name="patente"
                                        value={formData.patente}
                                        onChange={handleChange}
                                        error={!!errors.patente}
                                        helperText={errors.patente}
                                        inputProps={{ maxLength: 15 }}
                                        placeholder="ABC123"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Kilómetros"
                                        name="kilometros"
                                        type="number"
                                        value={formData.kilometros}
                                        onChange={handleChange}
                                        error={!!errors.kilometros}
                                        helperText={errors.kilometros}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.estado_codigo}>
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            name="estado_codigo"
                                            value={formData.estado_codigo}
                                            label="Estado"
                                            onChange={handleChange}
                                        >
                                            {estados.map((estado) => (
                                                <MenuItem key={estado.id} value={estado.codigo}>
                                                    {estado.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.estado_codigo && (
                                            <FormHelperText>{errors.estado_codigo}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Observaciones"
                                        name="observaciones"
                                        multiline
                                        rows={3}
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        error={!!errors.observaciones}
                                        helperText={errors.observaciones}
                                        inputProps={{ maxLength: 1000 }}
                                        placeholder="Descripción, estado del vehículo, características especiales..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab: Información Comercial */}
                    {activeTab === 1 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Comercial
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Valor"
                                        name="valor"
                                        type="number"
                                        value={formData.valor}
                                        onChange={handleChange}
                                        error={!!errors.valor}
                                        helperText={errors.valor}
                                        inputProps={{ min: 0, step: '0.01' }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Moneda</InputLabel>
                                        <Select
                                            name="moneda"
                                            value={formData.moneda}
                                            label="Moneda"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="ARS">ARS (Pesos Argentinos)</MenuItem>
                                            <MenuItem value="USD">USD (Dólares)</MenuItem>
                                            <MenuItem value="EUR">EUR (Euros)</MenuItem>
                                            <MenuItem value="BRL">BRL (Real Brasileño)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tipo de Operación"
                                        name="tipo_operacion"
                                        value={formData.tipo_operacion}
                                        onChange={handleChange}
                                        placeholder="ej: Venta, Consignación"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Ingreso"
                                        name="fecha_ingreso"
                                        type="date"
                                        value={formData.fecha_ingreso}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={vendedores}
                                        getOptionLabel={(option) => option.label}
                                        value={vendedores.find(v => v.value === formData.vendedor_id) || null}
                                        onChange={(event, newValue) => handleAutocompleteChange('vendedor_id', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Vendedor"
                                                error={!!errors.vendedor_id}
                                                helperText={errors.vendedor_id}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                <Box>
                                                    <Typography variant="body1">{option.label}</Typography>
                                                    {option.telefono && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tel: {option.telefono}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={compradores}
                                        getOptionLabel={(option) => option.label}
                                        value={compradores.find(c => c.value === formData.comprador_id) || null}
                                        onChange={(event, newValue) => handleAutocompleteChange('comprador_id', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Comprador"
                                                error={!!errors.comprador_id}
                                                helperText={errors.comprador_id}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props}>
                                                <Box>
                                                    <Typography variant="body1">{option.label}</Typography>
                                                    {option.telefono && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tel: {option.telefono}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab: Información Adicional */}
                    {activeTab === 2 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Adicional
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Pendientes de Preparación */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Pendientes de Preparación
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            value={newPendiente}
                                            onChange={(e) => setNewPendiente(e.target.value)}
                                            placeholder="ej: Revisión mecánica"
                                            size="small"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    addPendiente()
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={addPendiente}
                                            startIcon={<AddIcon />}
                                            disabled={!newPendiente.trim()}
                                        >
                                            Agregar
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {formData.pendientes_preparacion.map((pendiente, index) => (
                                            <Chip
                                                key={index}
                                                label={pendiente}
                                                onDelete={() => removePendiente(index)}
                                                color="warning"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Comentarios"
                                        name="comentarios"
                                        multiline
                                        rows={4}
                                        value={formData.comentarios}
                                        onChange={handleChange}
                                        error={!!errors.comentarios}
                                        helperText={errors.comentarios}
                                        inputProps={{ maxLength: 2000 }}
                                        placeholder="Comentarios adicionales sobre el vehículo..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ minWidth: 120 }}
                    disabled={loading}
                >
                    {loading
                        ? (vehicle ? 'Actualizando...' : 'Creando...')
                        : (vehicle ? 'Actualizar' : 'Crear')
                    } Vehículo
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default VehicleModalNew