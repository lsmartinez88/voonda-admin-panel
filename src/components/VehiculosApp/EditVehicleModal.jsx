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
    const [actualVehicle, setActualVehicle] = useState(null) // Estado para el vehículo procesado
    const [isInitialized, setIsInitialized] = useState(false) // Flag para evitar reset de datos
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
    // useEffect para cargar datos del vehículo (solo una vez al abrir)
    useEffect(() => {
        if (vehicle && open && !isInitialized) {
            console.log('📝 Inicializando vehículo para edición (primera vez):', vehicle)
            console.log('📝 Tipo de datos recibidos:', typeof vehicle)
            console.log('📝 ¿Es objeto vehículo?', vehicle && typeof vehicle === 'object')

            // 🔒 VALIDACIÓN: Verificar que el vehículo no sea null/undefined
            if (!vehicle || typeof vehicle !== 'object') {
                console.error('❌ ERROR: Vehicle es null, undefined o no es un objeto:', vehicle)
                return
            }

            // 🚨 NUEVO: Mostrar TODOS los campos del objeto vehículo
            console.log('🔍 TODOS LOS CAMPOS DEL VEHÍCULO:')
            console.log('📊 Object.keys(vehicle):', Object.keys(vehicle))

            // 🔧 CORRECCIÓN: Extraer el vehículo real de la respuesta de la API
            let vehicleToProcess = vehicle

            // Si viene en formato de respuesta de API, extraer el vehículo
            if (vehicle.success && vehicle.vehiculo) {
                console.log('🔧 Detectada respuesta de API, extrayendo vehicle.vehiculo')
                vehicleToProcess = vehicle.vehiculo
            } else if (vehicle.data) {
                console.log('🔧 Detectada estructura con data, extrayendo vehicle.data')
                vehicleToProcess = vehicle.data
            }

            // 🔒 VALIDACIÓN: Verificar que el vehículo procesado no sea null
            if (!vehicleToProcess || typeof vehicleToProcess !== 'object') {
                console.error('❌ ERROR: Vehicle procesado es null, undefined o no es un objeto:', vehicleToProcess)
                return
            }

            // Guardar en el estado para uso posterior
            setActualVehicle(vehicleToProcess)

            console.log('✅ Vehículo final a procesar:', vehicleToProcess)
            console.log('📊 Object.keys(vehicleToProcess):', Object.keys(vehicleToProcess))

            // Verificar si tenemos datos completos o básicos
            const isFullVehicleData = vehicleToProcess.modelo_autos || vehicleToProcess.vendedor_nombre || vehicleToProcess.vendedor_email;
            console.log('📝 ¿Datos completos?', isFullVehicleData ? 'SÍ' : 'NO - Datos básicos de lista');

            console.log('📝 Campos disponibles del vehículo:')
            console.log('  - vehicleToProcess.id:', vehicleToProcess.id)
            console.log('  - vehicleToProcess.marca:', `"${vehicleToProcess.marca}"`, '| tipo:', typeof vehicleToProcess.marca, '| length:', vehicleToProcess.marca?.length)
            console.log('  - vehicleToProcess.modelo:', `"${vehicleToProcess.modelo}"`, '| tipo:', typeof vehicleToProcess.modelo, '| length:', vehicleToProcess.modelo?.length)
            console.log('  - vehicleToProcess.version:', `"${vehicleToProcess.version}"`, '| tipo:', typeof vehicleToProcess.version, '| length:', vehicleToProcess.version?.length)
            console.log('  - vehicleToProcess.estado_codigo:', `"${vehicleToProcess.estado_codigo}"`, '| tipo:', typeof vehicleToProcess.estado_codigo)

            // 🎯 ESTRUCTURA CORRECTA: objeto modelo anidado
            console.log('🎯 actualVehicle?.modelo (objeto anidado):', actualVehicle?.modelo)
            if (actualVehicle?.modelo) {
                console.log('    ✅ actualVehicle.modelo.marca:', `"${actualVehicle.modelo.marca}"`, '| tipo:', typeof actualVehicle.modelo.marca)
                console.log('    ✅ actualVehicle.modelo.modelo:', `"${actualVehicle.modelo.modelo}"`, '| tipo:', typeof actualVehicle.modelo.modelo)
                console.log('    ✅ actualVehicle.modelo.version:', `"${actualVehicle.modelo.version}"`, '| tipo:', typeof actualVehicle.modelo.version)
            }

            // 🎯 ESTRUCTURA CORRECTA: objeto estado anidado  
            console.log('🎯 actualVehicle?.estado (objeto anidado):', actualVehicle?.estado)
            if (actualVehicle?.estado) {
                console.log('    ✅ actualVehicle.estado.codigo:', `"${actualVehicle.estado.codigo}"`, '| tipo:', typeof actualVehicle.estado.codigo)
                console.log('    ✅ actualVehicle.estado.nombre:', `"${actualVehicle.estado.nombre}"`, '| tipo:', typeof actualVehicle.estado.nombre)
            }

            // 🎯 ESTRUCTURA CORRECTA: objeto vendedor anidado
            console.log('🎯 actualVehicle?.vendedor (objeto anidado):', actualVehicle?.vendedor)
            if (actualVehicle?.vendedor) {
                console.log('    ✅ actualVehicle.vendedor.nombre:', `"${actualVehicle.vendedor.nombre}"`, '| tipo:', typeof actualVehicle.vendedor.nombre)
                console.log('    ✅ actualVehicle.vendedor.apellido:', `"${actualVehicle.vendedor.apellido}"`, '| tipo:', typeof actualVehicle.vendedor.apellido)
                console.log('    ✅ actualVehicle.vendedor.telefono:', `"${actualVehicle.vendedor.telefono}"`, '| tipo:', typeof actualVehicle.vendedor.telefono)
                console.log('    ✅ actualVehicle.vendedor.email:', `"${actualVehicle.vendedor.email}"`, '| tipo:', typeof actualVehicle.vendedor.email)
            }

            console.log('📝 Compatibilidad con estructura anterior:')
            console.log('  - actualVehicle?.modelo_autos:', actualVehicle?.modelo_autos)
            console.log('  - actualVehicle?.vendedor_nombre:', actualVehicle?.vendedor_nombre)
            console.log('  - actualVehicle?.vendedor_apellido:', actualVehicle?.vendedor_apellido)
            console.log('  - actualVehicle?.vendedor_telefono:', actualVehicle?.vendedor_telefono)
            console.log('  - actualVehicle?.vendedor_email:', actualVehicle?.vendedor_email)

            try {
                // Función helper para extraer valores de forma segura
                const safeExtract = (value, fallback = '') => {
                    if (value === null || value === undefined) return fallback;
                    if (typeof value === 'string') return value;
                    if (typeof value === 'number') return value;
                    return fallback;
                };

                // Mapear datos del vehículo de manera segura
                const mappedData = {
                    // Datos básicos - usar la estructura correcta de la API
                    marca: safeExtract(actualVehicle.modelo?.marca) ||
                        safeExtract(actualVehicle.marca) ||
                        safeExtract(actualVehicle.modelo_autos?.marca) ||
                        safeExtract(actualVehicle.modeloAuto?.marca) ||
                        safeExtract(actualVehicle.marca_nombre) ||
                        safeExtract(actualVehicle.brand) || '',

                    modelo: safeExtract(actualVehicle.modelo?.modelo) ||
                        safeExtract(actualVehicle.modelo) ||
                        safeExtract(actualVehicle.modelo_autos?.modelo) ||
                        safeExtract(actualVehicle.modeloAuto?.modelo) ||
                        safeExtract(actualVehicle.modelo_nombre) ||
                        safeExtract(actualVehicle.model) || '',

                    version: safeExtract(actualVehicle.modelo?.version) ||
                        safeExtract(actualVehicle.version) ||
                        safeExtract(actualVehicle.modelo_autos?.versión) ||
                        safeExtract(actualVehicle.modeloAuto?.versión) ||
                        safeExtract(actualVehicle.version_nombre) ||
                        safeExtract(actualVehicle.trim) ||
                        safeExtract(actualVehicle.variant) || '',

                    vehiculo_ano: parseInt(safeExtract(actualVehicle.vehiculo_ano) || safeExtract(actualVehicle.año) || safeExtract(actualVehicle.year)) || new Date().getFullYear(),
                    patente: safeExtract(actualVehicle.patente) || safeExtract(actualVehicle.dominio) || safeExtract(actualVehicle.plate) || '',
                    kilometros: parseInt(safeExtract(actualVehicle.kilometros) || safeExtract(actualVehicle.kilometraje) || safeExtract(actualVehicle.mileage)) || 0,
                    valor: parseFloat(safeExtract(actualVehicle.valor) || safeExtract(actualVehicle.precio) || safeExtract(actualVehicle.price)) || 0,
                    moneda: safeExtract(actualVehicle.moneda) || safeExtract(actualVehicle.currency) || 'ARS',
                    fecha_ingreso: actualVehicle.fecha_ingreso ? actualVehicle.fecha_ingreso.split('T')[0] : new Date().toISOString().split('T')[0],
                    estado_codigo: safeExtract(actualVehicle.estado?.codigo) ||
                        safeExtract(actualVehicle.estado_codigo) ||
                        safeExtract(actualVehicle.estado) ||
                        safeExtract(actualVehicle.status) || '',

                    // Datos del vendedor - usar la estructura correcta de la API
                    vendedor_nombre: safeExtract(actualVehicle.vendedor?.nombre) ||
                        safeExtract(actualVehicle.vendedor_nombre) ||
                        safeExtract(actualVehicle.contacto_nombre) ||
                        safeExtract(actualVehicle.vendedor) || '',
                    vendedor_apellido: safeExtract(actualVehicle.vendedor?.apellido) ||
                        safeExtract(actualVehicle.vendedor_apellido) || '',
                    vendedor_telefono: safeExtract(actualVehicle.vendedor?.telefono) ||
                        safeExtract(actualVehicle.vendedor_telefono) ||
                        safeExtract(actualVehicle.contacto_telefono) || '',
                    vendedor_email: safeExtract(actualVehicle.vendedor?.email) ||
                        safeExtract(actualVehicle.vendedor_email) ||
                        safeExtract(actualVehicle.contacto_email) || '',
                    vendedor_direccion: safeExtract(actualVehicle.vendedor?.direccion) ||
                        safeExtract(actualVehicle.vendedor_direccion) ||
                        safeExtract(actualVehicle.direccion) || '',

                    // Notas - mapear todos los campos de comentarios/notas
                    pendientes_preparacion: safeExtract(actualVehicle.pendientes_preparacion) || '',
                    comentarios: safeExtract(actualVehicle.comentarios) || safeExtract(actualVehicle.descripcion) || safeExtract(actualVehicle.notas) || '',
                    notas_generales: safeExtract(actualVehicle.notas_generales) || '',
                    notas_mecánicas: safeExtract(actualVehicle.notas_mecánicas) || '',
                    notas_vendedor: safeExtract(actualVehicle.notas_vendedor) || '',

                    // Publicaciones - mapear desde campos booleanos y arrays
                    publicar_ml: Boolean(actualVehicle.publi_mer_lib || actualVehicle.publicacion_ml || actualVehicle.publicar_ml),
                    publicar_autoscout: Boolean(actualVehicle.publicar_autoscout),
                    publicar_karvi: Boolean(actualVehicle.publicar_karvi),
                    publicar_autocosmos: Boolean(actualVehicle.publicar_autocosmos),
                    publicaciones: Array.isArray(actualVehicle.publicaciones) ? actualVehicle.publicaciones : []
                }

                console.log('📋 Datos mapeados exitosamente:', mappedData)
                console.log('📋 Marca final:', mappedData.marca, '| Tipo:', typeof mappedData.marca)
                console.log('📋 Modelo final:', mappedData.modelo, '| Tipo:', typeof mappedData.modelo)
                console.log('📋 Versión final:', mappedData.version, '| Tipo:', typeof mappedData.version)
                console.log('📋 Estado final:', mappedData.estado_codigo, '| Tipo:', typeof mappedData.estado_codigo)
                console.log('📋 Vendedor final:', {
                    nombre: mappedData.vendedor_nombre,
                    apellido: mappedData.vendedor_apellido,
                    telefono: mappedData.vendedor_telefono,
                    email: mappedData.vendedor_email
                })

                setFormData(mappedData)
                setErrors({})
                setIsInitialized(true) // Marcar como inicializado para evitar resets

            } catch (mappingError) {
                console.error('❌ Error al mapear datos del vehículo:', mappingError);
                setErrors({
                    general: 'Error al procesar los datos del vehículo. Algunos campos pueden no mostrarse correctamente.'
                });
            }
        }
    }, [vehicle, open, isInitialized])

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const updateFormData = (section, data) => {
        console.log(`📝 Actualizando formulario - sección: ${section}`, data)

        // 🔍 DEBUG: Log especial para campo version
        if (data.version !== undefined) {
            console.log('🔍 DEBUG VERSION en updateFormData:')
            console.log('  - Nuevo valor version:', `"${data.version}"`)
            console.log('  - Tipo:', typeof data.version)
            console.log('  - Length:', data.version?.length)
        }

        setFormData(prev => {
            const newFormData = {
                ...prev,
                ...data
            }
            console.log(`📝 Datos del formulario después de actualizar:`, newFormData)

            // 🔍 DEBUG: Log especial del estado final de version
            if (data.version !== undefined) {
                console.log('🔍 DEBUG VERSION en formData final:', `"${newFormData.version}"`)
            }

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
                // 🔍 DEBUGGING: Verificar disponibilidad del ID antes de enviar
                console.log('🆔 DEBUG - Verificación de IDs disponibles:')
                console.log('  - actualVehicle?.id:', actualVehicle?.id)
                console.log('  - formData.id:', formData.id)
                console.log('  - vehicle?.id:', vehicle?.id)
                console.log('  - vehicle?.vehiculo?.id:', vehicle?.vehiculo?.id)

                const vehicleId = actualVehicle?.id || formData.id || vehicle?.id || vehicle?.vehiculo?.id
                console.log('  - ID final seleccionado:', vehicleId)

                if (!vehicleId) {
                    throw new Error('No se pudo determinar el ID del vehículo para la actualización')
                }

                // 🚫 EXCLUSIONES: Preparar datos excluyendo campos específicos
                const { pendientes_preparacion, publicaciones, ...dataWithoutExcludedFields } = formData

                console.log('🚫 Campos excluidos de la actualización:')
                console.log('  - pendientes_preparacion:', pendientes_preparacion)
                console.log('  - publicaciones (cantidad):', publicaciones?.length || 0)

                // 🔧 DEBUG VERSIÓN: Ver valor exacto antes de validar
                console.log('🔍 DEBUG VERSION - formData.version:')
                console.log('  - Valor:', `"${formData.version}"`)
                console.log('  - Tipo:', typeof formData.version)
                console.log('  - Length:', formData.version?.length)
                console.log('  - Trim result:', formData.version ? `"${formData.version.trim()}"` : 'N/A')
                console.log('  - Is empty after trim:', !formData.version || formData.version.trim() === '')

                // 🔧 VERSIÓN: Incluir solo si tiene valor válido
                const dataToSave = {
                    ...dataWithoutExcludedFields,
                    id: vehicleId // Usar el ID verificado
                }

                // Solo incluir versión si tiene un valor válido (no vacío, no null, no undefined)
                if (formData.version && formData.version.trim() !== '') {
                    dataToSave.version = formData.version.trim()
                    console.log('✅ Versión incluida en actualización:', dataToSave.version)
                } else {
                    console.log('🚫 Versión excluida (vacía o inválida):', formData.version)
                }

                console.log('📤 Enviando datos de actualización al padre (sin campos excluidos):', dataToSave)

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
                    console.log('🚨 ERROR PATENTE:', {
                        mensajeCompleto: errorMessage,
                        valorPatente: formData.patente,
                        tipoPatente: typeof formData.patente,
                        longitudPatente: formData.patente?.length,
                        patenteOriginal: vehicle?.patente
                    })
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
        setIsInitialized(false) // Reset del flag al cerrar modal
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