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
import { useAuth } from '../../contexts/AuthContext'
import estadosService from '../../services/api/estadosService'
import VehicleBasicDataTab from './AddVehicleModal/VehicleBasicDataTab'
import VehicleSellerTab from './AddVehicleModal/VehicleSellerTab'
import VehicleNotesTab from './AddVehicleModal/VehicleNotesTab'
import VehiclePublicationsTab from './AddVehicleModal/VehiclePublicationsTab'

const AddVehicleModal = ({ open, onClose, onSave }) => {
    const { user } = useAuth()
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
        estado_codigo: '', // Se establecerá por defecto al cargar los estados

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

    // Datos de prueba para testing
    const generateTestData = () => {
        const marcas = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia', 'Renault', 'Peugeot']
        const modelos = {
            Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Etios'],
            Honda: ['Civic', 'Accord', 'CR-V', 'Fit', 'City'],
            Ford: ['Focus', 'Fiesta', 'EcoSport', 'Ranger', 'Mondeo'],
            Chevrolet: ['Cruze', 'Onix', 'Tracker', 'S10', 'Prisma'],
            Volkswagen: ['Golf', 'Polo', 'Tiguan', 'Amarok', 'Vento'],
            Nissan: ['Sentra', 'Versa', 'X-Trail', 'Frontier', 'March'],
            Hyundai: ['Elantra', 'Tucson', 'i30', 'Creta', 'HB20'],
            Kia: ['Rio', 'Sportage', 'Cerato', 'Picanto', 'Sorento'],
            Renault: ['Logan', 'Sandero', 'Duster', 'Fluence', 'Kangoo'],
            Peugeot: ['208', '308', '2008', '3008', '207']
        }
        const versiones = ['Base', 'LX', 'EX', 'SE', 'SEL', 'XE', 'XEI', 'GLI', 'Sport', 'Limited']
        const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Elena', 'Miguel', 'Sofia', 'Roberto', 'Carmen']
        const apellidos = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Torres']
        const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'test.com']

        const marcaSeleccionada = marcas[Math.floor(Math.random() * marcas.length)]
        const modelosDisponibles = modelos[marcaSeleccionada]
        const modeloSeleccionado = modelosDisponibles[Math.floor(Math.random() * modelosDisponibles.length)]
        const versionSeleccionada = versiones[Math.floor(Math.random() * versiones.length)] // Siempre generar versión
        const añoActual = new Date().getFullYear()
        const año = añoActual - Math.floor(Math.random() * 10) // Entre año actual y 10 años atrás
        const patente = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        const kilometros = Math.floor(Math.random() * 200000)
        const valor = Math.floor(Math.random() * 20000000) + 5000000 // Entre 5M y 25M
        const nombre = nombres[Math.floor(Math.random() * nombres.length)]
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
        const telefono = `+54911${Math.floor(Math.random() * 90000000) + 10000000}`
        const dominio = dominios[Math.floor(Math.random() * dominios.length)]
        const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@${dominio}`

        const datosGenerados = {
            marca: marcaSeleccionada,
            modelo: modeloSeleccionado,
            version: versionSeleccionada,
            vehiculo_ano: año,
            patente: patente,
            kilometros: kilometros,
            valor: valor,
            moneda: Math.random() > 0.8 ? 'USD' : 'ARS',
            fecha_ingreso: new Date().toISOString().split('T')[0],
            estado_codigo: 'DISPONIBLE',
            vendedor_nombre: nombre,
            vendedor_apellido: apellido,
            vendedor_telefono: telefono,
            vendedor_email: email,
            pendientes_preparacion: Math.random() > 0.7 ? 'Revisar documentación y realizar service completo' : '',
            comentarios: Math.random() > 0.6 ? `Vehículo en excelente estado. ${Math.random() > 0.5 ? 'Un solo dueño.' : 'Service al día.'}` : '',
            publicaciones: []
        }

        console.log('🎲 Datos de prueba generados:', datosGenerados)
        setFormData(datosGenerados)
        setErrors({}) // Limpiar errores al generar datos
    }

    // 🧪 FUNCIÓN PARA GENERAR DATOS INVÁLIDOS PARA TESTING
    const generateInvalidTestData = () => {
        const datosInvalidos = {
            marca: 'Toyota',
            modelo: 'Corolla',
            version: '2.0 XEI',
            vehiculo_ano: 2020,
            patente: 'ABC123',
            kilometros: 25000,
            valor: 15000,
            moneda: 'ARS',
            fecha_ingreso: new Date().toISOString().split('T')[0],
            estado_codigo: 'DISPONIBLE',
            
            // 🔴 DATOS INVÁLIDOS DEL VENDEDOR PARA TESTING
            vendedor_nombre: 'Juan',
            vendedor_apellido: 'Pérez',
            vendedor_telefono: '123', // ❌ TELÉFONO MUY CORTO
            vendedor_email: 'email-invalido', // ❌ EMAIL SIN FORMATO VÁLIDO
            
            pendientes_preparacion: '',
            comentarios: 'Datos para probar validación de errores',
            publicaciones: []
        }

        console.log('🔴 Datos inválidos de prueba generados:', datosInvalidos)
        setFormData(datosInvalidos)
        setErrors({}) // Limpiar errores al generar datos
    }

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
        console.log('🔄 Iniciando handleSave con datos:', formData);
        console.log('🎯 Estado específico antes de validar:', formData.estado_codigo);

        if (!validateForm()) {
            console.log('❌ Validación fallida, errores:', errors);
            return
        }

        console.log('✅ Validación exitosa, continuando con guardado');
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

        // Verificar que el usuario tenga empresa asignada
        if (!user?.empresa) {
            console.log('❌ Usuario sin empresa asignada:', user);
            setErrors({ empresa: 'Error: Usuario sin empresa asignada. Contacte al administrador.' })
            setLoading(false)
            return
        }

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
                estado_codigo: formData.estado_codigo, // Usar el estado seleccionado del formulario
            },
            empresa: {
                id: user.empresa.id,
                nombre: user.empresa.nombre || 'Sin nombre'
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

                console.log('📤 Enviando datos al padre:', dataToSave);

                await onSave(dataToSave)

                console.log('✅ onSave ejecutado correctamente, limpiando formulario');

                // Limpiar formulario y cerrar solo si onSave fue exitoso
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
                    estado_codigo: '', // Se restablecerá al cargar los estados
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
            }
        } catch (error) {
            console.error('❌ Error en handleSave del modal:', error);

            // Extraer estructura de error del backend
            let errorData = null;
            let errorMessage = 'Error al guardar el vehículo';

            // Intentar extraer datos del error
            if (error.response?.data) {
                errorData = error.response.data;
            } else if (error.message?.includes('{')) {
                // Intento de parsear si viene como string JSON
                try {
                    const jsonStart = error.message.indexOf('{');
                    const jsonStr = error.message.substring(jsonStart);
                    errorData = JSON.parse(jsonStr);
                } catch (parseError) {
                    console.log('❌ No se pudo parsear error como JSON');
                }
            }

            // Usar mensaje de la estructura de error o el mensaje del error
            if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            console.log('🔍 Estructura de error extraída:', errorData);
            console.log('🔍 Mensaje de error:', errorMessage);

            // Procesar details del backend si existen
            const newErrors = {};

            if (errorData?.details && Array.isArray(errorData.details)) {
                // ✅ USAR ESTRUCTURA DETAILS DEL BACKEND
                errorData.details.forEach(detail => {
                    if (detail.field && detail.message) {
                        console.log(`🎯 Mapeando error: ${detail.field} -> ${detail.message}`);
                        newErrors[detail.field] = detail.message;
                    }
                });
            } else {
                // Fallback: mapeo por contenido del mensaje
                if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                    newErrors.vendedor_email = 'Formato de email inválido';
                }

                if (errorMessage.includes('teléfono') || errorMessage.includes('telefono')) {
                    newErrors.vendedor_telefono = 'Formato de teléfono inválido';
                }

                if (errorMessage.includes('patente')) {
                    newErrors.patente = 'Formato de patente inválido';
                }

                if (errorMessage.includes('marca')) {
                    newErrors.marca = 'Error en la marca';
                }

                if (errorMessage.includes('modelo')) {
                    newErrors.modelo = 'Error en el modelo';
                }

                if (errorMessage.includes('version') || errorMessage.includes('Version')) {
                    newErrors.version = 'La versión es requerida';
                }

                if (errorMessage.includes('estado')) {
                    newErrors.estado_codigo = 'Error en el estado';
                }
            }

            // Aplicar errores específicos o mostrar error general
            if (Object.keys(newErrors).length > 0) {
                console.log('✅ Aplicando errores específicos a campos:', newErrors);
                setErrors(prev => ({
                    ...prev,
                    ...newErrors
                }));
            } else {
                console.log('⚠️ Mostrando error general:', errorMessage);
                setErrors(prev => ({
                    ...prev,
                    general: errorMessage
                }));
            }

            // NO cerrar el modal - permitir correcciones
            console.log('🔄 Modal permanece abierto para correcciones');
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

        {/* Mostrar error general si existe */}
        {errors.general && (
            <Box sx={{ px: 3, py: 1, backgroundColor: '#ffebee' }}>
                <Typography color="error" variant="body2">
                    ⚠️ {errors.general}
                </Typography>
            </Box>
        )}

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
                                    if (index === 0) return ['marca', 'modelo', 'version', 'vehiculo_ano', 'patente', 'kilometros', 'valor', 'estado_codigo'].includes(key)
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
                onClick={generateTestData}
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
            >
                🎲 Datos Válidos
            </Button>
            <Button
                onClick={generateInvalidTestData}
                variant="outlined"
                color="warning"
                sx={{ mr: 'auto' }}
            >
                🔴 Datos Inválidos
            </Button>
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