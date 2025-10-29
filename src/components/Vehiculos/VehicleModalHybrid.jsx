import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    Divider,
    Tabs,
    Tab,
    Checkbox,
    FormControlLabel,
    Chip,
    Switch,
    FormGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import PublishIcon from '@mui/icons-material/Publish';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const VehicleModalHybrid = ({ vehicle, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        // Campos existentes (compatibilidad)
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        color: "",
        combustible: "Nafta",
        motor: "",
        cilindrada: "",
        potencia: "",
        transmision: "Manual",
        traccion: "Delantera",
        precio: "",
        kilometraje: 0,
        estado: "Disponible",
        ubicacion: "",
        descripcion: "",
        equipamiento: [],
        imagenes: [],
        vin: "",
        patente: "",
        contacto_nombre: "",
        contacto_telefono: "",
        contacto_email: "",

        // Campos nuevos consolidados
        version: "",
        vehiculo_ano: new Date().getFullYear(),
        modelo_ano: "",
        valor: "",
        moneda: "ARS",
        condicion: "Usado",
        vendedor: "",
        dominio: "",

        // Fechas
        fecha_ingreso: "",
        fecha_reserva: "",
        fecha_entrega: "",

        // Publicaciones
        publicacion_web: false,
        publicacion_api_call: false,
        publi_insta: false,
        publi_face: false,
        publi_mer_lib: false,
        publi_mark_p: false,

        // Información técnica extendida
        motorizacion: "",
        caja: "Manual",
        puertas: "",
        segmento_modelo: "",
        potencia_hp: "",
        torque_nm: "",
        velocidad_max: "",

        // Seguridad
        airbags: "",
        abs: false,
        control_estabilidad: false,

        // Confort
        climatizador: "",
        multimedia: "",
        asistencia_manejo: [],

        // Información técnica adicional
        frenos: "",
        neumaticos: "",
        llantas: "",
        rendimiento_mixto: "",
        capacidad_baul: "",
        capacidad_combustible: "",

        // Dimensiones
        largo: "",
        ancho: "",
        alto: "",

        // URLs y documentación
        url_ficha: "",
        modelo_rag: "",
        titulo_legible: "",
        ficha_breve: "",

        // Gestión
        pendientes_preparacion: ""
    });

    const [errors, setErrors] = useState({});
    const [newEquipamiento, setNewEquipamiento] = useState("");
    const [newImagen, setNewImagen] = useState("");
    const [newAsistencia, setNewAsistencia] = useState("");
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (vehicle) {
            console.log('=== DEBUG MODAL ===')
            console.log('Vehículo recibido:', vehicle)
            console.log('¿Tiene modelo_autos?:', !!vehicle.modelo_autos)
            if (vehicle.modelo_autos) {
                console.log('Datos del modelo:', vehicle.modelo_autos)
            }
            console.log('==================')

            // Usar datos del modelo asociado si existen, sino usar los del vehículo
            const marcaReal = vehicle.modelo_autos?.marca || vehicle.marca
            const modeloReal = vehicle.modelo_autos?.modelo || vehicle.modelo
            const añoReal = vehicle.modelo_autos?.año || vehicle.vehiculo_ano || vehicle.año
            const versionReal = vehicle.modelo_autos?.versión || vehicle.version
            const combustibleReal = vehicle.modelo_autos?.combustible || vehicle.combustible
            const cajaReal = vehicle.modelo_autos?.caja || vehicle.caja || vehicle.transmision

            // Mapear campos existentes a nuevos y viceversa para compatibilidad total
            const mappedVehicle = {
                ...vehicle,
                equipamiento: vehicle.equipamiento || [],
                imagenes: vehicle.imagenes || [],
                asistencia_manejo: vehicle.asistencia_manejo || [],

                // Usar datos del modelo asociado con prioridad
                marca: marcaReal,
                modelo: modeloReal,
                año: añoReal,
                vehiculo_ano: añoReal,
                version: versionReal,
                combustible: combustibleReal,
                caja: cajaReal,
                transmision: cajaReal,

                // Sincronización de campos duplicados
                valor: vehicle.valor || vehicle.precio,
                precio: vehicle.precio || vehicle.valor,
                motorizacion: vehicle.modelo_autos?.motorización || vehicle.motorizacion || vehicle.motor,
                motor: vehicle.modelo_autos?.motorización || vehicle.motor || vehicle.motorizacion,
                dominio: vehicle.dominio || vehicle.patente,
                vendedor: vehicle.vendedor || vehicle.contacto_nombre,
                contacto_nombre: vehicle.contacto_nombre || vehicle.vendedor,
                traccion: vehicle.modelo_autos?.tracción || vehicle.traccion,
                puertas: vehicle.modelo_autos?.puertas || vehicle.puertas
            }

            setFormData((prev) => ({ ...prev, ...mappedVehicle }))
        }
    }, [vehicle])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === "checkbox" ? checked : value

        setFormData((prev) => {
            const updated = { ...prev, [name]: newValue }

            // Sincronización automática de campos relacionados
            if (name === "año") updated.vehiculo_ano = newValue
            if (name === "vehiculo_ano") updated.año = newValue
            if (name === "precio") updated.valor = newValue
            if (name === "valor") updated.precio = newValue
            if (name === "motor") updated.motorizacion = newValue
            if (name === "motorizacion") updated.motor = newValue
            if (name === "transmision") updated.caja = newValue
            if (name === "caja") updated.transmision = newValue
            if (name === "patente") updated.dominio = newValue
            if (name === "dominio") updated.patente = newValue
            if (name === "contacto_nombre") updated.vendedor = newValue
            if (name === "vendedor") updated.contacto_nombre = newValue

            return updated
        })

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const addEquipamiento = () => {
        if (newEquipamiento.trim()) {
            setFormData((prev) => ({
                ...prev,
                equipamiento: [...prev.equipamiento, newEquipamiento.trim()]
            }))
            setNewEquipamiento("")
        }
    }

    const removeEquipamiento = (index) => {
        setFormData((prev) => ({
            ...prev,
            equipamiento: prev.equipamiento.filter((_, i) => i !== index)
        }))
    }

    const addImagen = () => {
        if (newImagen.trim()) {
            setFormData((prev) => ({
                ...prev,
                imagenes: [...prev.imagenes, newImagen.trim()]
            }))
            setNewImagen("")
        }
    }

    const removeImagen = (index) => {
        setFormData((prev) => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }))
    }

    const addAsistencia = () => {
        if (newAsistencia.trim()) {
            setFormData((prev) => ({
                ...prev,
                asistencia_manejo: [...prev.asistencia_manejo, newAsistencia.trim()]
            }))
            setNewAsistencia("")
        }
    }

    const removeAsistencia = (index) => {
        setFormData((prev) => ({
            ...prev,
            asistencia_manejo: prev.asistencia_manejo.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.marca.trim()) newErrors.marca = "La marca es requerida"
        if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido"

        const año = formData.vehiculo_ano || formData.año
        if (!año || año < 1900 || año > new Date().getFullYear() + 2) {
            newErrors.año = "Año inválido"
            newErrors.vehiculo_ano = "Año inválido"
        }

        if (formData.contacto_email && !/\S+@\S+\.\S+/.test(formData.contacto_email)) {
            newErrors.contacto_email = "Email inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            // Limpiar y convertir datos
            const cleanData = {
                ...formData,
                // Asegurar sincronización de campos críticos
                año: parseInt(formData.vehiculo_ano || formData.año),
                vehiculo_ano: parseInt(formData.vehiculo_ano || formData.año),
                precio: formData.valor ? parseFloat(formData.valor) : formData.precio ? parseFloat(formData.precio) : null,
                valor: formData.valor ? parseFloat(formData.valor) : formData.precio ? parseFloat(formData.precio) : null,
                kilometraje: parseInt(formData.kilometraje) || 0,
                kilometros: parseInt(formData.kilometraje) || 0,
                motor: formData.motorizacion || formData.motor,
                motorizacion: formData.motorizacion || formData.motor,
                transmision: formData.caja || formData.transmision,
                caja: formData.caja || formData.transmision,
                dominio: formData.dominio || formData.patente,
                contacto_nombre: formData.vendedor || formData.contacto_nombre,
                vendedor: formData.vendedor || formData.contacto_nombre,

                // Convertir campos numéricos opcionales
                modelo_ano: formData.modelo_ano ? parseInt(formData.modelo_ano) : null,
                potencia_hp: formData.potencia_hp ? parseInt(formData.potencia_hp) : null,
                torque_nm: formData.torque_nm ? parseInt(formData.torque_nm) : null,
                puertas: formData.puertas ? parseInt(formData.puertas) : null,
                airbags: formData.airbags ? parseInt(formData.airbags) : null,
                velocidad_max: formData.velocidad_max ? parseInt(formData.velocidad_max) : null,
                largo: formData.largo ? parseFloat(formData.largo) : null,
                ancho: formData.ancho ? parseFloat(formData.ancho) : null,
                alto: formData.alto ? parseFloat(formData.alto) : null,
                rendimiento_mixto: formData.rendimiento_mixto ? parseFloat(formData.rendimiento_mixto) : null,
                capacidad_baul: formData.capacidad_baul ? parseInt(formData.capacidad_baul) : null,
                capacidad_combustible: formData.capacidad_combustible ? parseInt(formData.capacidad_combustible) : null
            }

            onSave(cleanData)
        }
    }

    const tabs = [
        { id: "basica", label: "Información Básica" },
        { id: "comercial", label: "Comercial & Fechas" },
        { id: "tecnica", label: "Técnica" },
        { id: "publicaciones", label: "Publicaciones" },
        { id: "adicional", label: "Adicional" }
    ]


    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 64,
                            fontWeight: 500
                        }
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.id}
                            label={tab.label}
                            sx={{ minHeight: 64 }}
                        />
                    ))}
                </Tabs>
            </Box>

            <DialogContent sx={{ py: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Tab: Información Básica */}
                    {activeTab === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Básica del Vehículo
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Marca"
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleChange}
                                        error={!!errors.marca}
                                        helperText={errors.marca}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Modelo"
                                        name="modelo"
                                        value={formData.modelo}
                                        onChange={handleChange}
                                        error={!!errors.modelo}
                                        helperText={errors.modelo}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Versión"
                                        name="version"
                                        value={formData.version}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Año"
                                        name="año"
                                        type="number"
                                        value={formData.año}
                                        onChange={handleChange}
                                        error={!!errors.año}
                                        helperText={errors.año}
                                        inputProps={{
                                            min: 1900,
                                            max: new Date().getFullYear() + 2
                                        }}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Combustible</InputLabel>
                                        <Select
                                            name="combustible"
                                            value={formData.combustible}
                                            label="Combustible"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Nafta">Nafta</MenuItem>
                                            <MenuItem value="Diesel">Diesel</MenuItem>
                                            <MenuItem value="GNC">GNC</MenuItem>
                                            <MenuItem value="Eléctrico">Eléctrico</MenuItem>
                                            <MenuItem value="Híbrido">Híbrido</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Patente"
                                        name="patente"
                                        value={formData.patente}
                                        onChange={handleChange}
                                        placeholder="ABC123"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Kilometraje"
                                        name="kilometraje"
                                        type="number"
                                        value={formData.kilometraje}
                                        onChange={handleChange}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            name="estado"
                                            value={formData.estado}
                                            label="Estado"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Disponible">Disponible</MenuItem>
                                            <MenuItem value="Reservado">Reservado</MenuItem>
                                            <MenuItem value="Vendido">Vendido</MenuItem>
                                            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Equipamiento */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Equipamiento
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        value={newEquipamiento}
                                        onChange={(e) => setNewEquipamiento(e.target.value)}
                                        placeholder="ej: Aire acondicionado"
                                        size="small"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={addEquipamiento}
                                        startIcon={<AddIcon />}
                                        sx={{ minWidth: 'auto' }}
                                    >
                                        Agregar
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.equipamiento.map((item, index) => (
                                        <Chip
                                            key={index}
                                            label={item}
                                            onDelete={() => removeEquipamiento(index)}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Imágenes */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    URLs de Imágenes
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="url"
                                        value={newImagen}
                                        onChange={(e) => setNewImagen(e.target.value)}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        size="small"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={addImagen}
                                        startIcon={<AddIcon />}
                                        sx={{ minWidth: 'auto' }}
                                    >
                                        Agregar
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {formData.imagenes.map((url, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 1,
                                            bgcolor: 'grey.50',
                                            borderRadius: 1
                                        }}>
                                            <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {url}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => removeImagen(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Tab: Información Comercial */}
                    {activeTab === 1 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Comercial y Fechas
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Precio"
                                        name="precio"
                                        type="number"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        inputProps={{ step: '0.01' }}
                                        placeholder="0.00"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Moneda</InputLabel>
                                        <Select
                                            name="moneda"
                                            value={formData.moneda}
                                            label="Moneda"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="ARS">ARS (Pesos)</MenuItem>
                                            <MenuItem value="USD">USD (Dólares)</MenuItem>
                                            <MenuItem value="EUR">EUR (Euros)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Condición</InputLabel>
                                        <Select
                                            name="condicion"
                                            value={formData.condicion}
                                            label="Condición"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Nuevo">Nuevo</MenuItem>
                                            <MenuItem value="0km">0km</MenuItem>
                                            <MenuItem value="Usado">Usado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Vendedor"
                                        name="vendedor"
                                        value={formData.vendedor}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Ubicación"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Ingreso"
                                        name="fecha_ingreso"
                                        type="date"
                                        value={formData.fecha_ingreso}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Reserva"
                                        name="fecha_reserva"
                                        type="date"
                                        value={formData.fecha_reserva}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Fecha de Entrega"
                                        name="fecha_entrega"
                                        type="date"
                                        value={formData.fecha_entrega}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Pendientes de Preparación"
                                        name="pendientes_preparacion"
                                        multiline
                                        rows={3}
                                        value={formData.pendientes_preparacion}
                                        onChange={handleChange}
                                        placeholder="Tareas pendientes para el vehículo..."
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        name="descripcion"
                                        multiline
                                        rows={3}
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Descripción detallada del vehículo..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab: Información Técnica */}
                    {activeTab === 2 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Técnica
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Motor"
                                        name="motor"
                                        value={formData.motor}
                                        onChange={handleChange}
                                        placeholder="ej: 1.6 16V Turbo"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Cilindrada"
                                        name="cilindrada"
                                        value={formData.cilindrada}
                                        onChange={handleChange}
                                        placeholder="ej: 1600cc"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Potencia"
                                        name="potencia"
                                        value={formData.potencia}
                                        onChange={handleChange}
                                        placeholder="ej: 110 HP"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Transmisión</InputLabel>
                                        <Select
                                            name="transmision"
                                            value={formData.transmision}
                                            label="Transmisión"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Manual">Manual</MenuItem>
                                            <MenuItem value="Automática">Automática</MenuItem>
                                            <MenuItem value="CVT">CVT</MenuItem>
                                            <MenuItem value="Secuencial">Secuencial</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Tracción</InputLabel>
                                        <Select
                                            name="traccion"
                                            value={formData.traccion}
                                            label="Tracción"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Delantera">Delantera</MenuItem>
                                            <MenuItem value="Trasera">Trasera</MenuItem>
                                            <MenuItem value="4x4">4x4</MenuItem>
                                            <MenuItem value="AWD">AWD</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Puertas</InputLabel>
                                        <Select
                                            name="puertas"
                                            value={formData.puertas}
                                            label="Puertas"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">Seleccionar</MenuItem>
                                            <MenuItem value="2">2 puertas</MenuItem>
                                            <MenuItem value="3">3 puertas</MenuItem>
                                            <MenuItem value="4">4 puertas</MenuItem>
                                            <MenuItem value="5">5 puertas</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Asistencias de Manejo */}
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: 'text.primary' }}>
                                    Asistencias de Manejo
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        value={newAsistencia}
                                        onChange={(e) => setNewAsistencia(e.target.value)}
                                        placeholder="ej: Control de crucero adaptativo"
                                        size="small"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={addAsistencia}
                                        sx={{ minWidth: 'auto', px: 2 }}
                                    >
                                        <AddIcon />
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.asistencia_manejo.map((item, index) => (
                                        <Chip
                                            key={index}
                                            label={item}
                                            color="success"
                                            variant="outlined"
                                            onDelete={() => removeAsistencia(index)}
                                            deleteIcon={<DeleteIcon />}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Tab: Publicaciones */}
                    {activeTab === 3 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Estado de Publicaciones
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publicacion_web"
                                                checked={formData.publicacion_web}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Publicación Web"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publi_insta"
                                                checked={formData.publi_insta}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Instagram"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publi_face"
                                                checked={formData.publi_face}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Facebook"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publi_mer_lib"
                                                checked={formData.publi_mer_lib}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Mercado Libre"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publi_mark_p"
                                                checked={formData.publi_mark_p}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Marketing Publicitario"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="publicacion_api_call"
                                                checked={formData.publicacion_api_call}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="API Call"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab: Información Adicional */}
                    {activeTab === 4 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                                Información Adicional
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="VIN"
                                        name="vin"
                                        value={formData.vin}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 17 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="URL Ficha Técnica"
                                        name="url_ficha"
                                        type="url"
                                        value={formData.url_ficha}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/ficha-tecnica"
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Contacto Nombre"
                                        name="contacto_nombre"
                                        value={formData.contacto_nombre}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Contacto Teléfono"
                                        name="contacto_telefono"
                                        type="tel"
                                        value={formData.contacto_telefono}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Contacto Email"
                                        name="contacto_email"
                                        type="email"
                                        value={formData.contacto_email}
                                        onChange={handleChange}
                                        error={!!errors.contacto_email}
                                        helperText={errors.contacto_email}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Título Legible"
                                        name="titulo_legible"
                                        value={formData.titulo_legible}
                                        onChange={handleChange}
                                        placeholder="ej: Ford Focus 1.6 Titanium 2020"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ficha Breve"
                                        name="ficha_breve"
                                        multiline
                                        rows={4}
                                        value={formData.ficha_breve}
                                        onChange={handleChange}
                                        placeholder="Resumen breve del vehículo con sus características principales..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ minWidth: 120 }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ minWidth: 120 }}
                >
                    {vehicle ? "Actualizar" : "Crear"} Vehículo
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default VehicleModalHybrid;