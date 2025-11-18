import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    IconButton,
    Typography
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import VehicleBasicDataTab from './AddVehicleModal/VehicleBasicDataTab'
import VehicleSellerTab from './AddVehicleModal/VehicleSellerTab'
import VehicleNotesTab from './AddVehicleModal/VehicleNotesTab'
import VehiclePublicationsTab from './AddVehicleModal/VehiclePublicationsTab'

const AddVehicleModal = ({ open, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState(0)
    const [formData, setFormData] = useState({
        // Datos básicos del vehículo
        marca: '',
        modelo: '',
        version: '',
        vehiculo_ano: new Date().getFullYear(),
        patente: '',
        kilometros: 0,
        valor: '',
        moneda: 'ARS',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        
        // Datos del vendedor
        vendedor_nombre: '',
        vendedor_apellido: '',
        vendedor_telefono: '',
        vendedor_email: '',
        
        // Notas y comentarios
        pendientes_preparacion: '',
        comentarios: '',
        
        // Publicaciones
        publicaciones: []
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            ...data
        }))
    }

    const validateForm = () => {
        const newErrors = {}
        
        // Validaciones básicas
        if (!formData.marca?.trim()) newErrors.marca = 'Marca es requerida'
        if (!formData.modelo?.trim()) newErrors.modelo = 'Modelo es requerido'
        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1970 || formData.vehiculo_ano > 2026) {
            newErrors.vehiculo_ano = 'Año debe estar entre 1970 y 2026'
        }
        if (!formData.patente?.trim()) newErrors.patente = 'Patente es requerida'
        if (formData.patente && formData.patente.length > 15) {
            newErrors.patente = 'Patente no puede exceder 15 caracteres'
        }
        if (formData.kilometros < 0) newErrors.kilometros = 'Kilómetros debe ser positivo'
        if (!formData.valor || formData.valor <= 0) newErrors.valor = 'Valor debe ser mayor a 0'
        
        // Validaciones del vendedor
        if (!formData.vendedor_nombre?.trim()) newErrors.vendedor_nombre = 'Nombre es requerido'
        if (!formData.vendedor_apellido?.trim()) newErrors.vendedor_apellido = 'Apellido es requerido'
        if (!formData.vendedor_telefono?.trim()) newErrors.vendedor_telefono = 'Teléfono es requerido'
        if (!formData.vendedor_email?.trim()) newErrors.vendedor_email = 'Email es requerido'
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.vendedor_email && !emailRegex.test(formData.vendedor_email)) {
            newErrors.vendedor_email = 'Email inválido'
        }

        // Validaciones de publicaciones
        if (formData.publicaciones && formData.publicaciones.length > 0) {
            formData.publicaciones.forEach((publicacion, index) => {
                // Validar titulo no vacío
                if (!publicacion.titulo?.trim()) {
                    newErrors[`publicacion_titulo_${index}`] = 'El título es requerido'
                }

                // Validar URL si se proporciona
                if (publicacion.url_publicacion?.trim()) {
                    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
                    if (!urlRegex.test(publicacion.url_publicacion)) {
                        newErrors[`publicacion_url_${index}`] = 'URL de publicación inválida'
                    }
                }
            })
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        
        // Procesar publicaciones: auto-generar titulo y limpiar campos
        const processedPublications = (formData.publicaciones || []).map(pub => {
            const cleanedPublication = {
                plataforma: pub.plataforma,
                titulo: pub.titulo?.trim() || `${formData.marca} ${formData.modelo} ${formData.version || ''} ${formData.vehiculo_ano}`.trim(),
                url_publicacion: pub.url_publicacion || '',
                id_publicacion: pub.id_publicacion || '',
                ficha_breve: pub.ficha_breve || '',
                activo: pub.activo || false
            }
            
            // Si es plataforma "otro", agregar el nombre custom a la plataforma
            if (pub.plataforma === 'otro' && pub.plataforma_custom?.trim()) {
                cleanedPublication.plataforma = pub.plataforma_custom.trim()
            }
            
            return cleanedPublication
        })
        
        // Mostrar objeto completo en consola para validación
        console.log('🚗 Datos del vehículo para crear:', {
            vehiculo: {
                marca: formData.marca,
                modelo: formData.modelo,
                version: formData.version,
                vehiculo_ano: formData.vehiculo_ano,
                patente: formData.patente,
                kilometros: formData.kilometros,
                valor: formData.valor,
                moneda: formData.moneda,
                fecha_ingreso: formData.fecha_ingreso,
                estado_codigo: 'DISPONIBLE', // Asignado automáticamente
            },
            vendedor: {
                vendedor_nombre: formData.vendedor_nombre,
                vendedor_apellido: formData.vendedor_apellido,
                vendedor_telefono: formData.vendedor_telefono,
                vendedor_email: formData.vendedor_email,
            },
            notas: {
                pendientes_preparacion: formData.pendientes_preparacion,
                comentarios: formData.comentarios,
            },
            publicaciones: processedPublications
        })

        try {
            if (onSave) {
                const dataToSave = {
                    ...formData,
                    publicaciones: processedPublications
                }
                await onSave(dataToSave)
            }
            
            // Limpiar formulario y cerrar
            setFormData({
                marca: '',
                modelo: '',
                version: '',
                vehiculo_ano: new Date().getFullYear(),
                patente: '',
                kilometros: 0,
                valor: '',
                moneda: 'ARS',
                fecha_ingreso: new Date().toISOString().split('T')[0],
                vendedor_nombre: '',
                vendedor_apellido: '',
                vendedor_telefono: '',
                vendedor_email: '',
                pendientes_preparacion: '',
                comentarios: '',
                publicaciones: []
            })
            setErrors({})
            setActiveTab(0)
            onClose()
        } catch (error) {
            console.error('Error al guardar vehículo:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setActiveTab(0)
        setErrors({})
        onClose()
    }

    const tabLabels = ['Datos del Vehículo', 'Vendedor', 'Notas', 'Publicaciones']

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { 
                    minHeight: '600px',
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
            }}>
                <Typography variant="h6" component="div">
                    Agregar Nuevo Vehículo
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {tabLabels.map((label, index) => (
                            <Tab 
                                key={index} 
                                label={label}
                                sx={{
                                    color: errors && Object.keys(errors).some(key => {
                                        if (index === 0) return ['marca', 'modelo', 'vehiculo_ano', 'patente', 'kilometros', 'valor'].includes(key)
                                        if (index === 1) return ['vendedor_nombre', 'vendedor_apellido', 'vendedor_telefono', 'vendedor_email'].includes(key)
                                        return false
                                    }) ? 'error.main' : 'inherit'
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, minHeight: '400px' }}>
                    {activeTab === 0 && (
                        <VehicleBasicDataTab
                            data={formData}
                            errors={errors}
                            onChange={(data) => updateFormData('basic', data)}
                        />
                    )}
                    {activeTab === 1 && (
                        <VehicleSellerTab
                            data={formData}
                            errors={errors}
                            onChange={(data) => updateFormData('seller', data)}
                        />
                    )}
                    {activeTab === 2 && (
                        <VehicleNotesTab
                            data={formData}
                            errors={errors}
                            onChange={(data) => updateFormData('notes', data)}
                        />
                    )}
                    {activeTab === 3 && (
                        <VehiclePublicationsTab
                            data={formData}
                            errors={errors}
                            onChange={(data) => updateFormData('publications', data)}
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={loading}
                    variant="outlined"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    variant="contained"
                    sx={{ ml: 2 }}
                >
                    {loading ? 'Guardando...' : 'Guardar Vehículo'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddVehicleModal