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
    ShoppingCart as ShoppingCartIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon
} from '@mui/icons-material'
import { compradoresService } from '../../services/api'

const CompradoresManager = () => {
    const [compradores, setCompradores] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingComprador, setEditingComprador] = useState(null)
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
        loadCompradores()
    }, [])

    const loadCompradores = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await compradoresService.getCompradores()

            if (response.success) {
                setCompradores(response.compradores || [])
            } else {
                setError('Error al cargar compradores')
            }
        } catch (error) {
            console.error('Error loading compradores:', error)
            setError('Error al cargar compradores')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (comprador = null) => {
        setEditingComprador(comprador)
        if (comprador) {
            setFormData({
                nombre: comprador.nombre || '',
                apellido: comprador.apellido || '',
                email: comprador.email || '',
                telefono: comprador.telefono || '',
                direccion: comprador.direccion || '',
                documento: comprador.documento || '',
                observaciones: comprador.observaciones || ''
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
        setEditingComprador(null)
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
            if (editingComprador) {
                response = await compradoresService.updateComprador(editingComprador.id, formData)
            } else {
                response = await compradoresService.createComprador(formData)
            }

            if (response.success) {
                await loadCompradores()
                handleCloseModal()
            } else {
                setError(response.message || 'Error al guardar comprador')
            }
        } catch (error) {
            console.error('Error saving comprador:', error)
            setError('Error al guardar comprador')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (compradorId) => {
        if (!confirm('¿Está seguro de que desea eliminar este comprador?')) {
            return
        }

        try {
            setLoading(true)
            setError('')
            const response = await compradoresService.deleteComprador(compradorId)

            if (response.success) {
                await loadCompradores()
            } else {
                setError('Error al eliminar comprador')
            }
        } catch (error) {
            console.error('Error deleting comprador:', error)
            setError('Error al eliminar comprador')
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
                    Gestión de Compradores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Nuevo Comprador
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {compradores.map((comprador) => (
                    <Grid item xs={12} md={6} lg={4} key={comprador.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                                        {getInitials(comprador.nombre, comprador.apellido)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            {comprador.nombre} {comprador.apellido}
                                        </Typography>
                                        <Chip
                                            label="Comprador"
                                            size="small"
                                            color="success"
                                            icon={<ShoppingCartIcon />}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {comprador.email && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {comprador.email}
                                            </Typography>
                                        </Box>
                                    )}

                                    {comprador.telefono && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {comprador.telefono}
                                            </Typography>
                                        </Box>
                                    )}

                                    {comprador.direccion && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HomeIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {comprador.direccion}
                                            </Typography>
                                        </Box>
                                    )}

                                    {comprador.documento && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Documento: {comprador.documento}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {comprador.observaciones && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {comprador.observaciones}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>

                            <CardActions>
                                <Tooltip title="Editar comprador">
                                    <IconButton
                                        onClick={() => handleOpenModal(comprador)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Eliminar comprador">
                                    <IconButton
                                        onClick={() => handleDelete(comprador.id)}
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

            {compradores.length === 0 && !loading && (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No hay compradores registrados
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Modal de creación/edición */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingComprador ? 'Editar Comprador' : 'Nuevo Comprador'}
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
                        {editingComprador ? 'Guardar Cambios' : 'Crear Comprador'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CompradoresManager