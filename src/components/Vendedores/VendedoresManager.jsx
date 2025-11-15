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
    Avatar,
    Divider,
    Tooltip
} from '@mui/material'
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon
} from '@mui/icons-material'
import { vendedoresService } from '../../services/api'

const VendedoresManager = () => {
    const [vendedores, setVendedores] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingVendedor, setEditingVendedor] = useState(null)
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        documento: '',
        observaciones: ''
    })

    useEffect(() => {
        loadVendedores()
    }, [])

    const loadVendedores = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await vendedoresService.getVendedores()

            if (response.success) {
                setVendedores(response.vendedores || [])
            } else {
                setError('Error al cargar vendedores')
            }
        } catch (error) {
            console.error('Error loading vendedores:', error)
            setError('Error al cargar vendedores')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (vendedor = null) => {
        setEditingVendedor(vendedor)
        if (vendedor) {
            setFormData({
                nombre: vendedor.nombre || '',
                apellido: vendedor.apellido || '',
                email: vendedor.email || '',
                telefono: vendedor.telefono || '',
                direccion: vendedor.direccion || '',
                documento: vendedor.documento || '',
                observaciones: vendedor.observaciones || ''
            })
        } else {
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                direccion: '',
                documento: '',
                observaciones: ''
            })
        }
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingVendedor(null)
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            direccion: '',
            documento: '',
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
            if (editingVendedor) {
                response = await vendedoresService.updateVendedor(editingVendedor.id, formData)
            } else {
                response = await vendedoresService.createVendedor(formData)
            }

            if (response.success) {
                await loadVendedores()
                handleCloseModal()
            } else {
                setError(response.message || 'Error al guardar vendedor')
            }
        } catch (error) {
            console.error('Error saving vendedor:', error)
            setError('Error al guardar vendedor')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (vendedorId) => {
        if (!confirm('¿Está seguro de que desea eliminar este vendedor?')) {
            return
        }

        try {
            setLoading(true)
            setError('')
            const response = await vendedoresService.deleteVendedor(vendedorId)

            if (response.success) {
                await loadVendedores()
            } else {
                setError('Error al eliminar vendedor')
            }
        } catch (error) {
            console.error('Error deleting vendedor:', error)
            setError('Error al eliminar vendedor')
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (nombre, apellido) => {
        return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase()
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Gestión de Vendedores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Nuevo Vendedor
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {vendedores.map((vendedor) => (
                    <Grid item xs={12} md={6} lg={4} key={vendedor.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {getInitials(vendedor.nombre, vendedor.apellido)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            {vendedor.nombre} {vendedor.apellido}
                                        </Typography>
                                        <Chip
                                            label="Vendedor"
                                            size="small"
                                            color="info"
                                            icon={<PersonIcon />}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {vendedor.email && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {vendedor.email}
                                            </Typography>
                                        </Box>
                                    )}

                                    {vendedor.telefono && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {vendedor.telefono}
                                            </Typography>
                                        </Box>
                                    )}

                                    {vendedor.direccion && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HomeIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {vendedor.direccion}
                                            </Typography>
                                        </Box>
                                    )}

                                    {vendedor.documento && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Documento: {vendedor.documento}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {vendedor.observaciones && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {vendedor.observaciones}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>

                            <CardActions>
                                <Tooltip title="Editar vendedor">
                                    <IconButton
                                        onClick={() => handleOpenModal(vendedor)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar vendedor">
                                    <IconButton
                                        onClick={() => handleDelete(vendedor.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {vendedores.length === 0 && !loading && (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No hay vendedores registrados
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Modal de creación/edición */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingVendedor ? 'Editar Vendedor' : 'Nuevo Vendedor'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Apellido"
                                value={formData.apellido}
                                onChange={(e) => handleInputChange('apellido', e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Teléfono"
                                value={formData.telefono}
                                onChange={(e) => handleInputChange('telefono', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Dirección"
                                value={formData.direccion}
                                onChange={(e) => handleInputChange('direccion', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Documento"
                                value={formData.documento}
                                onChange={(e) => handleInputChange('documento', e.target.value)}
                                fullWidth
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
                        disabled={loading || !formData.nombre || !formData.apellido}
                    >
                        {editingVendedor ? 'Guardar Cambios' : 'Crear Vendedor'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default VendedoresManager