import React from 'react'
import {
    Grid,
    TextField,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Divider,
    Chip
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Language as WebIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    ShoppingCart as MercadoLibreIcon,
    MoreHoriz as OtroIcon
} from '@mui/icons-material'

const VehiclePublicationsTab = ({ data, errors, onChange }) => {

    const plataformaOptions = [
        { value: 'web', label: 'Web', icon: <WebIcon sx={{ fontSize: 16 }} /> },
        { value: 'facebook', label: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 16 }} /> },
        { value: 'instagram', label: 'Instagram', icon: <InstagramIcon sx={{ fontSize: 16 }} /> },
        { value: 'mercadolibre', label: 'MercadoLibre', icon: <MercadoLibreIcon sx={{ fontSize: 16 }} /> },
        { value: 'otro', label: 'Otro', icon: <OtroIcon sx={{ fontSize: 16 }} /> }
    ]

    const handleAddPublication = () => {
        const newPublication = {
            id: Date.now(), // ID temporal para React keys (no se envía al backend)
            plataforma: 'web',
            titulo: '',
            url_publicacion: '',
            id_publicacion: '',
            ficha_breve: '',
            activo: true,
            plataforma_custom: '' // Solo para UI, no se envía al backend
        }

        const updatedPublications = [...(data.publicaciones || []), newPublication]
        onChange({ publicaciones: updatedPublications })
    }

    const handleRemovePublication = (index) => {
        const updatedPublications = (data.publicaciones || []).filter((_, i) => i !== index)
        onChange({ publicaciones: updatedPublications })
    }

    const handlePublicationChange = (index, field, value) => {
        const updatedPublications = [...(data.publicaciones || [])]
        updatedPublications[index] = {
            ...updatedPublications[index],
            [field]: value
        }
        onChange({ publicaciones: updatedPublications })
    }

    const getPlataformaDisplay = (publicacion) => {
        if (publicacion.plataforma === 'otro' && publicacion.plataforma_custom) {
            return publicacion.plataforma_custom
        }
        const option = plataformaOptions.find(opt => opt.value === publicacion.plataforma)
        return option?.label || publicacion.plataforma
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" color="primary.main">
                    Publicaciones
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddPublication}
                    size="small"
                >
                    Agregar Publicación
                </Button>
            </Box>

            {(!data.publicaciones || data.publicaciones.length === 0) && (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.300'
                    }}
                >
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        No hay publicaciones agregadas
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddPublication}
                    >
                        Agregar Primera Publicación
                    </Button>
                </Box>
            )}

            <Grid container spacing={3}>
                {(data.publicaciones || []).map((publicacion, index) => (
                    <Grid item xs={12} key={publicacion.id || index}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={`Publicación #${index + 1}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={getPlataformaDisplay(publicacion)}
                                            size="small"
                                            color={publicacion.activo ? 'success' : 'default'}
                                        />
                                    </Box>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemovePublication(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={2}>
                                    {/* Plataforma */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Plataforma</InputLabel>
                                            <Select
                                                value={publicacion.plataforma || 'web'}
                                                onChange={(e) => handlePublicationChange(index, 'plataforma', e.target.value)}
                                                label="Plataforma"
                                            >
                                                {plataformaOptions.map(option => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {option.icon}
                                                            {option.label}
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Estado */}
                                    <Grid item xs={12} md={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={publicacion.activo || false}
                                                    onChange={(e) => handlePublicationChange(index, 'activo', e.target.checked)}
                                                    color="success"
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2">
                                                        {publicacion.activo ? 'Activa' : 'Inactiva'}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </Grid>

                                    {/* Plataforma Custom (solo si es "otro") */}
                                    {publicacion.plataforma === 'otro' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Nombre de Plataforma"
                                                value={publicacion.plataforma_custom || ''}
                                                onChange={(e) => handlePublicationChange(index, 'plataforma_custom', e.target.value)}
                                                placeholder="Ej: AutoScout24, Napsix, etc."
                                            />
                                        </Grid>
                                    )}

                                    {/* Título */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Título de la Publicación *"
                                            value={publicacion.titulo || ''}
                                            onChange={(e) => handlePublicationChange(index, 'titulo', e.target.value)}
                                            error={!!errors[`publicacion_titulo_${index}`]}
                                            helperText={errors[`publicacion_titulo_${index}`]}
                                            placeholder="Ej: Toyota Corolla XEI 2023 - Excelente Estado"
                                        />
                                    </Grid>

                                    {/* URL */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="URL de la Publicación"
                                            type="url"
                                            value={publicacion.url_publicacion || ''}
                                            onChange={(e) => handlePublicationChange(index, 'url_publicacion', e.target.value)}
                                            error={!!errors[`publicacion_url_${index}`]}
                                            helperText={errors[`publicacion_url_${index}`]}
                                            placeholder="https://..."
                                        />
                                    </Grid>

                                    {/* ID de Publicación */}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="ID de la Publicación"
                                            value={publicacion.id_publicacion || ''}
                                            onChange={(e) => handlePublicationChange(index, 'id_publicacion', e.target.value)}
                                            placeholder="ID interno de la plataforma"
                                        />
                                    </Grid>

                                    {/* Ficha Breve */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            size="small"
                                            label="Ficha Breve"
                                            value={publicacion.ficha_breve || ''}
                                            onChange={(e) => handlePublicationChange(index, 'ficha_breve', e.target.value)}
                                            placeholder="Descripción breve del vehículo para esta publicación..."
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Información adicional */}
            {data.publicaciones && data.publicaciones.length > 0 && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • <strong>Plataforma:</strong> Selecciona donde se publicará el vehículo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • <strong>Estado:</strong> Activa/Inactiva para controlar la visibilidad
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • <strong>URL e ID:</strong> Para vincular con publicaciones existentes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Las publicaciones pueden agregarse, editarse o eliminarse en cualquier momento
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default VehiclePublicationsTab