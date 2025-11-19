import React, { useState, useEffect } from 'react'
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
import { useAuth } from '../../contexts/AuthContext'
import { useSnackbar } from 'notistack'
import estadosService from '../../services/api/estadosService'
import vehiculosService from '../../services/api/vehiculosService'
import VehicleBasicDataTab from './AddVehicleModal/VehicleBasicDataTab'
import VehicleSellerTab from './AddVehicleModal/VehicleSellerTab'
import VehicleNotesTab from './AddVehicleModal/VehicleNotesTab'
import VehiclePublicationsTab from './AddVehicleModal/VehiclePublicationsTab'

const EditVehicleModal = ({ open, onClose, onSave, vehicle }) => {
    const { user } = useAuth()
    const { enqueueSnackbar } = useSnackbar()
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
        estado_codigo: '',

        // Datos del vendedor
        vendedor_nombre: '',
        vendedor_apellido: '',
        vendedor_telefono: '',
        vendedor_email: '',
        vendedor_direccion: '',

        // Notas
        pendientes_preparacion: '',
        comentarios: '',
        notas_generales: '',
        notas_mecánicas: '',
        notas_vendedor: '',

        // Publicaciones
        publicar_ml: false,
        publicar_autoscout: false,
        publicar_karvi: false,
        publicar_autocosmos: false,
        publicaciones: []
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    // Cargar datos del vehículo cuando se abra el modal
    useEffect(() => {
        if (vehicle && open) {
            console.log('📝 Cargando vehículo COMPLETO para edición:', vehicle)
            console.log('📝 Campos específicos del vehículo:')
            console.log('  - vehicle.marca:', vehicle.marca)
            console.log('  - vehicle.modelo:', vehicle.modelo)
            console.log('  - vehicle.version:', vehicle.version)
            console.log('  - vehicle.estado_codigo:', vehicle.estado_codigo)
            console.log('  - vehicle.modelo_autos:', vehicle.modelo_autos)
            console.log('📝 Campos específicos del vendedor:')
            console.log('  - vehicle.vendedor_nombre:', vehicle.vendedor_nombre)
            console.log('  - vehicle.vendedor_apellido:', vehicle.vendedor_apellido)
            console.log('  - vehicle.vendedor_telefono:', vehicle.vendedor_telefono)
            console.log('  - vehicle.vendedor_email:', vehicle.vendedor_email)
            console.log('  - vehicle.contacto_nombre:', vehicle.contacto_nombre)
            console.log('  - vehicle.contacto_telefono:', vehicle.contacto_telefono)
            console.log('  - vehicle.contacto_email:', vehicle.contacto_email)
            if (vehicle.modelo_autos) {
                console.log('  - vehicle.modelo_autos.marca:', vehicle.modelo_autos.marca)
                console.log('  - vehicle.modelo_autos.modelo:', vehicle.modelo_autos.modelo)
                console.log('  - vehicle.modelo_autos.versión:', vehicle.modelo_autos.versión)
            }
            
            // Mapear datos del vehículo completo obtenido de la API
            const mappedData = {
                // Datos básicos - priorizar datos directos del vehículo
                marca: vehicle.marca || vehicle.modelo_autos?.marca || '',
                modelo: vehicle.modelo || vehicle.modelo_autos?.modelo || '',
                version: vehicle.version || vehicle.modelo_autos?.versión || '',
                vehiculo_ano: parseInt(vehicle.vehiculo_ano || vehicle.año) || new Date().getFullYear(),
                patente: vehicle.patente || vehicle.dominio || '',
                kilometros: parseInt(vehicle.kilometros || vehicle.kilometraje) || 0,
                valor: parseFloat(vehicle.valor || vehicle.precio) || 0,
                moneda: vehicle.moneda || 'ARS',
                fecha_ingreso: vehicle.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : new Date().toISOString().split('T')[0],
                estado_codigo: vehicle.estado_codigo || vehicle.estado || '',

                // Datos del vendedor - usar todos los campos posibles
                vendedor_nombre: vehicle.vendedor_nombre || vehicle.contacto_nombre || vehicle.vendedor || '',
                vendedor_apellido: vehicle.vendedor_apellido || '',
                vendedor_telefono: vehicle.vendedor_telefono || vehicle.contacto_telefono || '',
                vendedor_email: vehicle.vendedor_email || vehicle.contacto_email || '',
                vendedor_direccion: vehicle.vendedor_direccion || vehicle.direccion || '',

                // Notas - mapear todos los campos de comentarios/notas
                pendientes_preparacion: vehicle.pendientes_preparacion || '',
                comentarios: vehicle.comentarios || vehicle.descripcion || vehicle.notas || '',
                notas_generales: vehicle.notas_generales || '',
                notas_mecánicas: vehicle.notas_mecánicas || '',
                notas_vendedor: vehicle.notas_vendedor || '',

                // Publicaciones - mapear desde campos booleanos y arrays
                publicar_ml: Boolean(vehicle.publi_mer_lib || vehicle.publicacion_ml || vehicle.publicar_ml),
                publicar_autoscout: Boolean(vehicle.publicar_autoscout),
                publicar_karvi: Boolean(vehicle.publicar_karvi),
                publicar_autocosmos: Boolean(vehicle.publicar_autocosmos),
                publicaciones: Array.isArray(vehicle.publicaciones) ? vehicle.publicaciones : []
            }

            console.log('📋 Datos mapeados para edición:', mappedData)
            console.log('📋 Marca mapeada:', mappedData.marca, '| Tipo:', typeof mappedData.marca)
            console.log('📋 Modelo mapeado:', mappedData.modelo, '| Tipo:', typeof mappedData.modelo)
            console.log('📋 Versión mapeada:', mappedData.version, '| Tipo:', typeof mappedData.version)
            console.log('📋 Estado mapeado:', mappedData.estado_codigo, '| Tipo:', typeof mappedData.estado_codigo)
            console.log('📋 Vendedor mapeado:')
            console.log('  - vendedor_nombre:', mappedData.vendedor_nombre, '| Tipo:', typeof mappedData.vendedor_nombre)
            console.log('  - vendedor_apellido:', mappedData.vendedor_apellido, '| Tipo:', typeof mappedData.vendedor_apellido)
            console.log('  - vendedor_telefono:', mappedData.vendedor_telefono, '| Tipo:', typeof mappedData.vendedor_telefono)
            console.log('  - vendedor_email:', mappedData.vendedor_email, '| Tipo:', typeof mappedData.vendedor_email)
            
            setFormData(mappedData)
            setErrors({})
        }
    }, [vehicle, open])

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const updateFormData = (section, data) => {
        console.log(`📝 Actualizando formulario - sección: ${section}`, data)
        setFormData(prev => {
            const newFormData = {
                ...prev,
                ...data
            }
            console.log(`📝 Datos del formulario después de actualizar:`, newFormData)
            return newFormData
        })
    }

    const validateForm = () => {
        const newErrors = {}

        // Validaciones básicas
        if (!formData.marca?.trim()) newErrors.marca = 'Marca es requerida'
        if (!formData.modelo?.trim()) newErrors.modelo = 'Modelo es requerido'
        if (!formData.version?.trim()) newErrors.version = 'Versión es requerida'
        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1970 || formData.vehiculo_ano > 2026) {
            newErrors.vehiculo_ano = 'Año debe estar entre 1970 y 2026'
        }
        if (!formData.patente?.trim()) newErrors.patente = 'Patente es requerida'
        if (formData.patente && formData.patente.length > 15) {
            newErrors.patente = 'Patente no puede exceder 15 caracteres'
        }
        if (formData.kilometros < 0) newErrors.kilometros = 'Kilómetros debe ser positivo'
        if (!formData.valor || formData.valor <= 0) newErrors.valor = 'Valor debe ser mayor a 0'
        if (!formData.estado_codigo?.trim()) newErrors.estado_codigo = 'Estado es requerido'

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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        console.log('🔄 Iniciando handleSave para edición con datos:', formData)

        if (!validateForm()) {
            console.log('❌ Validación fallida, errores:', errors)
            return
        }

        console.log('✅ Validación exitosa, continuando con actualización')
        setLoading(true)

        // Procesar publicaciones
        const processedPublications = (formData.publicaciones || []).map(pub => {
            const cleanedPublication = {
                plataforma: pub.plataforma,
                titulo: pub.titulo?.trim() || `${formData.marca} ${formData.modelo} ${formData.version || ''} ${formData.vehiculo_ano}`.trim(),
                url_publicacion: pub.url_publicacion || '',
                id_publicacion: pub.id_publicacion || '',
                ficha_breve: pub.ficha_breve || '',
                activo: pub.activo || false
            }

            if (pub.plataforma === 'otro' && pub.plataforma_custom?.trim()) {
                cleanedPublication.plataforma = pub.plataforma_custom.trim()
            }

            return cleanedPublication
        })

        try {
            if (onSave) {
                const dataToSave = {
                    ...formData,
                    publicaciones: processedPublications,
                    id: vehicle.id // Incluir ID para la actualización
                }

                console.log('📤 Enviando datos de actualización al padre:', dataToSave)

                await onSave(dataToSave)

                console.log('✅ onSave ejecutado correctamente')

                // Cerrar modal tras éxito
                setActiveTab(0)
                onClose()
            }
        } catch (error) {
            console.error('❌ Error en handleSave del modal de edición:', error)

            // Manejo de errores similar al AddVehicleModal
            let errorData = null
            let errorMessage = 'Error al actualizar el vehículo'

            if (error.response?.data) {
                errorData = error.response.data
            } else if (error.message?.includes('{')) {
                try {
                    const jsonStart = error.message.indexOf('{')
                    const jsonStr = error.message.substring(jsonStart)
                    errorData = JSON.parse(jsonStr)
                } catch (parseError) {
                    console.log('❌ No se pudo parsear error como JSON')
                }
            }

            if (errorData?.message) {
                errorMessage = errorData.message
            } else if (error.message) {
                errorMessage = error.message
            }

            const newErrors = {}

            if (errorData?.details && Array.isArray(errorData.details)) {
                errorData.details.forEach(detail => {
                    if (detail.field && detail.message) {
                        console.log(`🎯 Mapeando error: ${detail.field} -> ${detail.message}`)
                        newErrors[detail.field] = detail.message
                    }
                })
            } else {
                // Fallback: mapeo por contenido del mensaje
                if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                    newErrors.vendedor_email = 'Formato de email inválido'
                }
                if (errorMessage.includes('teléfono') || errorMessage.includes('telefono')) {
                    newErrors.vendedor_telefono = 'Formato de teléfono inválido'
                }
                if (errorMessage.includes('patente')) {
                    newErrors.patente = 'Formato de patente inválido'
                }
            }

            if (Object.keys(newErrors).length > 0) {
                console.log('✅ Aplicando errores específicos a campos:', newErrors)
                setErrors(prev => ({
                    ...prev,
                    ...newErrors
                }))
            } else {
                console.log('⚠️ Mostrando error general:', errorMessage)
                setErrors(prev => ({
                    ...prev,
                    general: errorMessage
                }))
            }
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
                    ✏️ Editar Vehículo
                    {formData.marca && formData.modelo && ` - ${formData.marca} ${formData.modelo}`}
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

            <DialogContent dividers sx={{ p: 0 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    {tabLabels.map((label, index) => (
                        <Tab key={index} label={label} />
                    ))}
                </Tabs>

                {/* Mostrar errores generales */}
                {errors.general && (
                    <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                        ⚠️ {errors.general}
                    </Box>
                )}

                <Box sx={{ p: 3 }}>
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
                    {loading ? 'Actualizando...' : 'Actualizar Vehículo'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditVehicleModal