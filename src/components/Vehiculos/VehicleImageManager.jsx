import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Alert,
    Chip,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    MoreVert as MoreVertIcon,
    ZoomIn as ZoomIcon,
    Download as DownloadIcon,
    Edit as EditIcon
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import { imagenesService } from '../../services/api'

const VehicleImageManager = ({ vehicleId, onImagesChange = () => { } }) => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)

    // Cargar imágenes al montar el componente
    useEffect(() => {
        if (vehicleId) {
            loadImages()
        }
    }, [vehicleId])

    const loadImages = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await imagenesService.getImagenesByVehiculo(vehicleId)

            if (response.success) {
                setImages(response.imagenes || [])
                onImagesChange(response.imagenes || [])
            } else {
                setError('Error al cargar las imágenes')
            }
        } catch (error) {
            console.error('Error loading images:', error)
            setError('Error al cargar las imágenes')
        } finally {
            setLoading(false)
        }
    }

    // Configuración de dropzone
    const onDrop = useCallback(async (acceptedFiles) => {
        if (!vehicleId) {
            setError('Debe guardar el vehículo antes de subir imágenes')
            return
        }

        try {
            setUploading(true)
            setError('')
            setUploadProgress(0)

            // Simular progreso mientras se suben las imágenes
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 200)

            // Convertir archivos a URLs de ejemplo (en producción sería una subida real)
            const imagePromises = acceptedFiles.map(async (file, index) => {
                // Simular subida de archivo
                const imageData = {
                    vehiculo_id: vehicleId,
                    url: URL.createObjectURL(file), // En producción sería la URL del servidor
                    descripcion: `Imagen ${images.length + index + 1}`,
                    orden: images.length + index + 1,
                    es_principal: false
                }

                return imagenesService.createImagen(imageData)
            })

            const responses = await Promise.all(imagePromises)
            clearInterval(progressInterval)

            const successful = responses.filter(r => r.success)
            const errors = responses.filter(r => !r.success)

            if (successful.length > 0) {
                await loadImages() // Recargar imágenes
                setUploadProgress(100)
                setTimeout(() => {
                    setUploading(false)
                    setUploadProgress(0)
                }, 1000)
            }

            if (errors.length > 0) {
                setError(`Error al subir ${errors.length} de ${acceptedFiles.length} imágenes`)
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            setError('Error al subir las imágenes')
            setUploading(false)
            setUploadProgress(0)
        }
    }, [vehicleId, images.length])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: true,
        maxSize: 10 * 1024 * 1024 // 10MB
    })

    const handleSetPrincipal = async (imageId) => {
        try {
            setLoading(true)
            const response = await imagenesService.setImagenPrincipal(imageId)

            if (response.success) {
                await loadImages()
            } else {
                setError('Error al establecer imagen principal')
            }
        } catch (error) {
            console.error('Error setting principal image:', error)
            setError('Error al establecer imagen principal')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteImage = async (imageId) => {
        if (!confirm('¿Está seguro de que desea eliminar esta imagen?')) {
            return
        }

        try {
            setLoading(true)
            const response = await imagenesService.deleteImagen(imageId)

            if (response.success) {
                await loadImages()
            } else {
                setError('Error al eliminar la imagen')
            }
        } catch (error) {
            console.error('Error deleting image:', error)
            setError('Error al eliminar la imagen')
        } finally {
            setLoading(false)
        }
    }

    const handleReorderImages = async (newOrder) => {
        try {
            setLoading(true)
            const response = await imagenesService.reordenarImagenes(vehicleId, newOrder)

            if (response.success) {
                await loadImages()
            } else {
                setError('Error al reordenar las imágenes')
            }
        } catch (error) {
            console.error('Error reordering images:', error)
            setError('Error al reordenar las imágenes')
        } finally {
            setLoading(false)
        }
    }

    const handleMenuOpen = (event, index) => {
        setAnchorEl(event.currentTarget)
        setSelectedImageIndex(index)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedImageIndex(null)
    }

    const handlePreview = (image) => {
        setSelectedImage(image)
        setPreviewOpen(true)
        handleMenuClose()
    }

    if (!vehicleId) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        Guarde el vehículo para gestionar las imágenes
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Área de subida de archivos */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed',
                            borderColor: isDragActive ? 'primary.main' : 'grey.300',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            {isDragActive ? 'Suelte las imágenes aquí' : 'Arrastra imágenes o haz clic para seleccionar'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Formatos soportados: JPG, PNG, WebP. Máximo 10MB por imagen
                        </Typography>
                    </Box>

                    {uploading && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Subiendo imágenes... {uploadProgress}%
                            </Typography>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Lista de imágenes */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {images.length > 0 ? (
                <ImageList variant="masonry" cols={3} gap={8}>
                    {images.map((image, index) => (
                        <ImageListItem key={image.id}>
                            <img
                                src={image.url}
                                alt={image.alt || `Imagen ${index + 1}`}
                                loading="lazy"
                                style={{
                                    borderRadius: 8,
                                    cursor: 'pointer'
                                }}
                                onClick={() => handlePreview(image)}
                            />
                            <ImageListItemBar
                                title={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {image.es_principal && (
                                            <Chip
                                                label="Principal"
                                                size="small"
                                                color="primary"
                                                icon={<StarIcon />}
                                            />
                                        )}
                                        <Typography variant="body2">
                                            Orden: {image.orden}
                                        </Typography>
                                    </Box>
                                }
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                        onClick={(e) => handleMenuOpen(e, index)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No hay imágenes cargadas para este vehículo
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Menú contextual */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedImageIndex !== null && (
                    <>
                        <MenuItem onClick={() => handlePreview(images[selectedImageIndex])}>
                            <ListItemIcon>
                                <ZoomIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Ver en grande</ListItemText>
                        </MenuItem>

                        {!images[selectedImageIndex]?.es_principal && (
                            <MenuItem onClick={() => {
                                handleSetPrincipal(images[selectedImageIndex].id)
                                handleMenuClose()
                            }}>
                                <ListItemIcon>
                                    <StarIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Establecer como principal</ListItemText>
                            </MenuItem>
                        )}

                        <MenuItem onClick={() => {
                            window.open(images[selectedImageIndex].url, '_blank')
                            handleMenuClose()
                        }}>
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Descargar</ListItemText>
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                handleDeleteImage(images[selectedImageIndex].id)
                                handleMenuClose()
                            }}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Eliminar</ListItemText>
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* Dialog de preview */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Preview de imagen
                        </Typography>
                        {selectedImage?.es_principal && (
                            <Chip
                                label="Imagen Principal"
                                color="primary"
                                icon={<StarIcon />}
                            />
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedImage && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>
                        Cerrar
                    </Button>
                    {selectedImage && !selectedImage.es_principal && (
                        <Button
                            startIcon={<StarIcon />}
                            onClick={() => {
                                handleSetPrincipal(selectedImage.id)
                                setPreviewOpen(false)
                            }}
                        >
                            Establecer como principal
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default VehicleImageManager