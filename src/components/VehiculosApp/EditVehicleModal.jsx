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
        pendientes_preparacion: [], // ✅ Array de strings
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
            // 🔒 VALIDACIÓN: Verificar que el vehículo no sea null/undefined
            if (!vehicle || typeof vehicle !== 'object') {
                console.error('❌ ERROR: Vehicle es null, undefined o no es un objeto:', vehicle)
                return
            }

            // 🔧 CORRECCIÓN: Extraer el vehículo real de la respuesta de la API
            let vehicleToProcess = vehicle

            // Si viene en formato de respuesta de API, extraer el vehículo
            if (vehicle.success && vehicle.vehiculo) {
                vehicleToProcess = vehicle.vehiculo
            } else if (vehicle.data) {
                vehicleToProcess = vehicle.data
            }

            console.log('📝 Inicializando edición vehículo:', {
                id: vehicleToProcess.id,
                marca: vehicleToProcess.marca,
                modelo: vehicleToProcess.modelo,
                patente: vehicleToProcess.patente
            })

            // 🔒 VALIDACIÓN: Verificar que el vehículo procesado no sea null
            if (!vehicleToProcess || typeof vehicleToProcess !== 'object') {
                console.error('❌ ERROR: Vehicle procesado es null, undefined o no es un objeto:', vehicleToProcess)
                return
            }

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
                    marca: safeExtract(vehicleToProcess.modelo?.marca) ||
                        safeExtract(vehicleToProcess.marca) ||
                        safeExtract(vehicleToProcess.modelo_autos?.marca) ||
                        safeExtract(vehicleToProcess.modeloAuto?.marca) ||
                        safeExtract(vehicleToProcess.marca_nombre) ||
                        safeExtract(vehicleToProcess.brand) || '',

                    modelo: safeExtract(vehicleToProcess.modelo?.modelo) ||
                        safeExtract(vehicleToProcess.modelo) ||
                        safeExtract(vehicleToProcess.modelo_autos?.modelo) ||
                        safeExtract(vehicleToProcess.modeloAuto?.modelo) ||
                        safeExtract(vehicleToProcess.modelo_nombre) ||
                        safeExtract(vehicleToProcess.model) || '',

                    version: safeExtract(vehicleToProcess.modelo?.version) ||
                        safeExtract(vehicleToProcess.version) ||
                        safeExtract(vehicleToProcess.modelo_autos?.versión) ||
                        safeExtract(vehicleToProcess.modeloAuto?.versión) ||
                        safeExtract(vehicleToProcess.version_nombre) ||
                        safeExtract(vehicleToProcess.trim) ||
                        safeExtract(vehicleToProcess.variant) || '',

                    vehiculo_ano: parseInt(safeExtract(vehicleToProcess.vehiculo_ano) || safeExtract(vehicleToProcess.año) || safeExtract(vehicleToProcess.year)) || new Date().getFullYear(),
                    patente: safeExtract(vehicleToProcess.patente) || safeExtract(vehicleToProcess.dominio) || safeExtract(vehicleToProcess.plate) || '',
                    kilometros: parseInt(safeExtract(vehicleToProcess.kilometros) || safeExtract(vehicleToProcess.kilometraje) || safeExtract(vehicleToProcess.mileage)) || 0,
                    valor: parseFloat(safeExtract(vehicleToProcess.valor) || safeExtract(vehicleToProcess.precio) || safeExtract(vehicleToProcess.price)) || 0,
                    moneda: safeExtract(vehicleToProcess.moneda) || safeExtract(vehicleToProcess.currency) || 'ARS',
                    fecha_ingreso: vehicleToProcess.fecha_ingreso ? vehicleToProcess.fecha_ingreso.split('T')[0] : new Date().toISOString().split('T')[0],
                    estado_codigo: safeExtract(vehicleToProcess.estado?.codigo) ||
                        safeExtract(vehicleToProcess.estado_codigo) ||
                        safeExtract(vehicleToProcess.estado) ||
                        safeExtract(vehicleToProcess.status) || '',

                    // Datos del vendedor - usar la estructura correcta de la API
                    vendedor_nombre: safeExtract(vehicleToProcess.vendedor?.nombre) ||
                        safeExtract(vehicleToProcess.vendedor_nombre) ||
                        safeExtract(vehicleToProcess.contacto_nombre) ||
                        safeExtract(vehicleToProcess.vendedor) || '',
                    vendedor_apellido: safeExtract(vehicleToProcess.vendedor?.apellido) ||
                        safeExtract(vehicleToProcess.vendedor_apellido) || '',
                    vendedor_telefono: safeExtract(vehicleToProcess.vendedor?.telefono) ||
                        safeExtract(vehicleToProcess.vendedor_telefono) ||
                        safeExtract(vehicleToProcess.contacto_telefono) || '',
                    vendedor_email: safeExtract(vehicleToProcess.vendedor?.email) ||
                        safeExtract(vehicleToProcess.vendedor_email) ||
                        safeExtract(vehicleToProcess.contacto_email) || '',
                    vendedor_direccion: safeExtract(vehicleToProcess.vendedor?.direccion) ||
                        safeExtract(vehicleToProcess.vendedor_direccion) ||
                        safeExtract(vehicleToProcess.direccion) || '',

                    // Notas - mapear todos los campos de comentarios/notas
                    pendientes_preparacion: (() => {
                        // El campo puede venir como array o string desde el backend
                        const pendientes = vehicleToProcess.pendientes_preparacion ||
                            vehicleToProcess.pendientes ||
                            vehicleToProcess.notas_preparacion ||
                            vehicleToProcess.preparacion_pendiente ||
                            vehicleToProcess.pendiente_preparacion ||
                            vehicleToProcess.pendientes_de_preparacion ||
                            vehicleToProcess.notas_pendientes ||
                            vehicleToProcess.preparacion ||
                            vehicleToProcess.pendientes_prep ||
                            vehicleToProcess.prep_pendientes;

                        console.log('🔍 PENDIENTES RAW desde backend:', pendientes);

                        // Si es un array, revisar si contiene strings con \n
                        if (Array.isArray(pendientes)) {
                            // Procesar cada elemento del array para dividir por \n si es necesario
                            const processedItems = [];
                            pendientes.forEach(item => {
                                if (typeof item === 'string' && item.includes('\n')) {
                                    // Dividir el string por \n y agregar cada línea como elemento separado
                                    const splitItems = item.split('\n')
                                        .map(subItem => subItem.trim())
                                        .filter(subItem => subItem.length > 0);
                                    processedItems.push(...splitItems);
                                } else if (typeof item === 'string' && item.trim()) {
                                    processedItems.push(item.trim());
                                }
                            });
                            console.log('🔄 Array procesado:', processedItems);
                            return processedItems;
                        } else if (typeof pendientes === 'string' && pendientes.trim()) {
                            // Si viene como string, dividir por \n
                            const splitItems = pendientes.split('\n')
                                .map(item => item.trim())
                                .filter(item => item.length > 0);
                            console.log('🔄 String dividido:', splitItems);
                            return splitItems;
                        }
                        console.log('🔄 Devolviendo array vacío');
                        return [];
                    })(),
                    comentarios: safeExtract(vehicleToProcess.comentarios) || safeExtract(vehicleToProcess.descripcion) || safeExtract(vehicleToProcess.notas) || '',
                    notas_generales: safeExtract(vehicleToProcess.notas_generales) || '',
                    notas_mecánicas: safeExtract(vehicleToProcess.notas_mecánicas) || '',
                    notas_vendedor: safeExtract(vehicleToProcess.notas_vendedor) || '',

                    // Publicaciones
                    publicar_ml: Boolean(vehicleToProcess.publi_mer_lib || vehicleToProcess.publicacion_ml || vehicleToProcess.publicar_ml),
                    publicar_autoscout: Boolean(vehicleToProcess.publicar_autoscout),
                    publicar_karvi: Boolean(vehicleToProcess.publicar_karvi),
                    publicar_autocosmos: Boolean(vehicleToProcess.publicar_autocosmos),
                    publicaciones: Array.isArray(vehicleToProcess.publicaciones) ? vehicleToProcess.publicaciones : []
                }

                console.log('📋 Vehículo mapeado:', {
                    id: vehicleToProcess.id,
                    marca: mappedData.marca,
                    modelo: mappedData.modelo,
                    version: mappedData.version,
                    estado: mappedData.estado_codigo,
                    pendientes_count: mappedData.pendientes_preparacion?.length || 0
                })

                // Guardar el vehículo procesado para uso posterior
                setActualVehicle(vehicleToProcess)
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
        // Versión es opcional - si se proporciona, debe ser válida
        // if (!formData.version?.trim()) newErrors.version = 'Versión es requerida' // ❌ REMOVIDO - es opcional
        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1970 || formData.vehiculo_ano > new Date().getFullYear() + 1) {
            newErrors.vehiculo_ano = `Año debe estar entre 1970 y ${new Date().getFullYear() + 1}`
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

                // ✅ INCLUIR TODO: No excluir ningún campo específico
                console.log('✅ Todos los campos se incluirán en la actualización:')
                console.log('  - pendientes_preparacion (array):', Array.isArray(formData.pendientes_preparacion) ? formData.pendientes_preparacion.length : 0, 'elementos')
                console.log('  - Tipo de pendientes_preparacion:', typeof formData.pendientes_preparacion)
                console.log('  - Contenido pendientes_preparacion:', formData.pendientes_preparacion)
                console.log('  - publicaciones:', formData.publicaciones?.length || 0, 'publicaciones')

                // 🔧 PROCESAMIENTO: pendientes_preparacion mantener como array para backend
                const processedPendientes = Array.isArray(formData.pendientes_preparacion)
                    ? formData.pendientes_preparacion.filter(item =>
                        item &&
                        typeof item === 'string' &&
                        item.trim().length > 0
                    ).map(item => item.trim()) // Limpiar espacios
                    : (formData.pendientes_preparacion && typeof formData.pendientes_preparacion === 'string'
                        ? formData.pendientes_preparacion.split('\n').filter(item => item.trim()).map(item => item.trim())
                        : [])

                console.log('💾 Guardando vehículo ID:', vehicleId);
                console.log('📋 Pendientes procesados (array):', processedPendientes.length, 'elementos:', processedPendientes);

                // 🔧 VERSIÓN: Incluir solo si tiene valor válido
                const dataToSave = {
                    ...formData, // ✅ Incluir todos los campos base
                    pendientes_preparacion: processedPendientes, // ✅ Array de strings para backend
                    publicaciones: processedPublications, // ✅ Publicaciones procesadas
                    id: vehicleId // ✅ ID verificado
                }

                // Remover version si está vacía
                if (!formData.version || formData.version.trim() === '') {
                    delete dataToSave.version
                } else {
                    dataToSave.version = formData.version.trim()
                }

                console.log('📤 Enviando actualización...');

                await onSave(dataToSave);
                console.log('✅ Vehículo actualizado exitosamente');

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