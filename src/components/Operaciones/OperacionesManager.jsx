import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Box,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Tooltip,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material'
import {
    AccountBalance as AccountBalanceIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    DriveEta as CarIcon
} from '@mui/icons-material'
import { operacionesService } from '../../services/api'

const OperacionesManager = () => {
    const [operaciones, setOperaciones] = useState([])
    const [tiposOperacion, setTiposOperacion] = useState([])
    const [estadosOperacion, setEstadosOperacion] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingOperacion, setEditingOperacion] = useState(null)
    const [formData, setFormData] = useState({
        tipo: '',
        vehiculo_id: '',
        persona_id: '',
        monto: '',
        moneda: 'ARS',
        estado: '',
        fecha_operacion: new Date().toISOString().split('T')[0],
        observaciones: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')
            const [operacionesResponse, tiposResponse, estadosResponse] = await Promise.all([
                operacionesService.getOperaciones(),
                operacionesService.getTiposOperacion(),
                operacionesService.getEstadosOperacion()
            ])

            if (operacionesResponse.success) {
                setOperaciones(operacionesResponse.operaciones || [])
            }
            if (tiposResponse.success) {
                setTiposOperacion(tiposResponse.tipos || [])
            }
            if (estadosResponse.success) {
                setEstadosOperacion(estadosResponse.estados || [])
            }
        } catch (error) {
            console.error('Error loading data:', error)
            setError('Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (operacion = null) => {
        setEditingOperacion(operacion)
        if (operacion) {
            setFormData({
                tipo: operacion.tipo || '',
                vehiculo_id: operacion.vehiculo_id || '',
                persona_id: operacion.persona_id || '',
                monto: operacion.monto || '',
                moneda: operacion.moneda || 'ARS',
                estado: operacion.estado || '',
                fecha_operacion: operacion.fecha_operacion || new Date().toISOString().split('T')[0],
                observaciones: operacion.observaciones || ''
            })
        } else {
            setFormData({
                tipo: '',
                vehiculo_id: '',
                persona_id: '',
                monto: '',
                moneda: 'ARS',
                estado: '',
                fecha_operacion: new Date().toISOString().split('T')[0],
                observaciones: ''
            })
        }
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingOperacion(null)
        setFormData({
            tipo: '',
            vehiculo_id: '',
            persona_id: '',
            monto: '',
            moneda: 'ARS',
            estado: '',
            fecha_operacion: new Date().toISOString().split('T')[0],
            observaciones: ''
        })
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setError('')

            let response
            if (editingOperacion) {
                response = await operacionesService.updateOperacion(editingOperacion.id, formData)
            } else {
                response = await operacionesService.createOperacion(formData)
            }

            if (response.success) {
                await loadData()
                handleCloseModal()
            } else {
                setError(response.message || 'Error al guardar operación')
            }
        } catch (error) {
            console.error('Error saving operacion:', error)
            setError('Error al guardar operación')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (operacionId) => {
        if (!confirm('¿Está seguro de que desea eliminar esta operación?')) {
            return
        }

        try {
            setLoading(true)
            setError('')
            const response = await operacionesService.deleteOperacion(operacionId)

            if (response.success) {
                await loadData()
            } else {
                setError('Error al eliminar operación')
            }
        } catch (error) {
            console.error('Error deleting operacion:', error)
            setError('Error al eliminar operación')
        } finally {
            setLoading(false)
        }
    }

    const getChipColor = (tipo) => {
        switch (tipo?.toLowerCase()) {
            case 'compra': return 'info'
            case 'venta': return 'success'
            case 'seña': return 'warning'
            case 'transferencia': return 'secondary'
            default: return 'default'
        }
    }

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente': return 'warning'
            case 'completado': return 'success'
            case 'cancelado': return 'error'
            default: return 'default'
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Gestión de Operaciones
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Nueva Operación
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Vehículo</TableCell>
                            <TableCell>Persona</TableCell>
                            <TableCell>Monto</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operaciones.map((operacion) => (
                            <TableRow key={operacion.id}>
                                <TableCell>
                                    <Chip
                                        label={operacion.tipo}
                                        color={getChipColor(operacion.tipo)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CarIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {operacion.vehiculo?.marca || 'N/A'} {operacion.vehiculo?.modelo || ''}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {operacion.persona?.nombre || 'N/A'} {operacion.persona?.apellido || ''}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {operacionesService.formatearMonto(operacion.monto, operacion.moneda)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={operacion.estado}
                                        color={getEstadoColor(operacion.estado)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarIcon fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {new Date(operacion.fecha_operacion).toLocaleDateString('es-AR')}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Editar operación">
                                        <IconButton
                                            onClick={() => handleOpenModal(operacion)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar operación">
                                        <IconButton
                                            onClick={() => handleDelete(operacion.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {operaciones.length === 0 && !loading && (
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No hay operaciones registradas
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Modal de creación/edición */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingOperacion ? 'Editar Operación' : 'Nueva Operación'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo de Operación</InputLabel>
                                <Select
                                    value={formData.tipo}
                                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                                    label="Tipo de Operación"
                                    required
                                >
                                    {tiposOperacion.map((tipo) => (
                                        <MenuItem key={tipo.id || tipo} value={tipo.codigo || tipo}>
                                            {tipo.nombre || tipo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={formData.estado}
                                    onChange={(e) => handleInputChange('estado', e.target.value)}
                                    label="Estado"
                                    required
                                >
                                    {estadosOperacion.map((estado) => (
                                        <MenuItem key={estado.id || estado} value={estado.codigo || estado}>
                                            {estado.nombre || estado}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Vehículo ID"
                                value={formData.vehiculo_id}
                                onChange={(e) => handleInputChange('vehiculo_id', e.target.value)}
                                fullWidth
                                type="number"
                                helperText="ID del vehículo relacionado"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Persona ID"
                                value={formData.persona_id}
                                onChange={(e) => handleInputChange('persona_id', e.target.value)}
                                fullWidth
                                type="number"
                                helperText="ID de la persona relacionada"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Monto"
                                type="number"
                                value={formData.monto}
                                onChange={(e) => handleInputChange('monto', e.target.value)}
                                fullWidth
                                inputProps={{ min: 0, step: 0.01 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Moneda</InputLabel>
                                <Select
                                    value={formData.moneda}
                                    onChange={(e) => handleInputChange('moneda', e.target.value)}
                                    label="Moneda"
                                >
                                    <MenuItem value="ARS">Pesos Argentinos (ARS)</MenuItem>
                                    <MenuItem value="USD">Dólares (USD)</MenuItem>
                                    <MenuItem value="EUR">Euros (EUR)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha de Operación"
                                type="date"
                                value={formData.fecha_operacion}
                                onChange={(e) => handleInputChange('fecha_operacion', e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Observaciones"
                                value={formData.observaciones}
                                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Observaciones adicionales sobre la operación..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loading || !formData.tipo || !formData.estado}
                    >
                        {editingOperacion ? 'Guardar Cambios' : 'Crear Operación'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default OperacionesManager