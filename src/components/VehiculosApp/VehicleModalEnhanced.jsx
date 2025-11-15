import React, { useState, useEffect } from 'react'; import React, { useState, useEffect } from 'react'import React, { useState, useEffect } from 'react'; import React, { useState, useEffect } from 'react'; import React, { useState, useEffect } from 'react';

import {

    Dialog,import {

        DialogTitle,

        DialogContent, Dialog, import {

            DialogActions,

            Button, DialogTitle,

            TextField,

            Grid, DialogContent, Dialog, import {

                Box, import {

                    Typography,

                    IconButton, DialogActions,

                    Tabs,

                    Tab, TextField, DialogTitle,

                    Divider,

                    FormControl, Button,

                    InputLabel,

                    Select, Grid, DialogContent, Dialog, Dialog,

                    MenuItem

                } from '@mui/material'; Select,

                import CloseIcon from '@mui/icons-material/Close';

                import SaveIcon from '@mui/icons-material/Save'; MenuItem, DialogActions,



                const VehicleModalEnhanced = ({ FormControl,

                    open,

                    onClose, InputLabel, TextField, DialogTitle, DialogTitle,

                    vehicle,

                    onSave, Box,

                    mode = 'view' // 'view', 'edit', 'add'

                }) => {
                    Typography, Button,

    const [tabValue, setTabValue] = useState(0);

                    const [formData, setFormData] = useState({
                        IconButton,

                        marca: '',

                        modelo: '', Divider, Grid, DialogContent, DialogContent,

                        año: '',

                        version: '', Tabs,

                        color: '',

                        precio: '', Tab, Select,

                        km: '',

                        combustible: '', Checkbox,

                        transmision: '',

                        estado: '', FormControlLabel, MenuItem, DialogActions, DialogActions,

                        descripcion: '',

                        vendedor: '', Chip,

                        telefono: '',

                        email: ''                Switch, FormControl,

                    });

                    FormGroup

                    useEffect(() => {

                        if (vehicle) { } from '@mui/material'    InputLabel, Button, Button,

                            setFormData(vehicle);

                    } else {
                        import CloseIcon from '@mui/icons-material/Close'

            // Reset form for new vehicle

            setFormData({
                            import SaveIcon from '@mui/icons-material/Save'    Box,

                            marca: '',

                            modelo: '', import AddIcon from '@mui/icons-material/Add'

                año: '',

                            version: '', import DeleteIcon from '@mui/icons-material/Delete'    Typography, TextField, TextField,

                            color: '',

                            precio: '', import EditIcon from '@mui/icons-material/Edit'

                km: '',

                            combustible: '', import InfoIcon from '@mui/icons-material/Info'    IconButton,

                            transmision: '',

                            estado: '', import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

                descripcion: '',

                            vendedor: '', import BuildIcon from '@mui/icons-material/Build'    Divider, Grid, Grid,

                            telefono: '',

                            email: ''            import PublishIcon from '@mui/icons-material/Publish'

            });

                    }import MoreHorizIcon from '@mui/icons-material/MoreHoriz'    Tabs,

            }, [vehicle, open]);

            import apiClient from '../../services/apiClient'

    const handleChange = (field) => (event) => {

                setFormData(prev => ({
                    Tab, Typography, Typography,

                    ...prev,

                    [field]: event.target.value            const VehicleModalEnhanced = ({ vehicle, onSave, onClose }) => {

                    }));

            }; const [formData, setFormData] = useState({

                Checkbox,

                const handleSave = () => {

                    onSave(formData);                    // Campos principales del vehículo según la nueva API

                    onClose();

                }; modelo_id: "", FormControlLabel, Box, Box,



                const handleTabChange = (event, newValue) => {
                    vehiculo_ano: new Date().getFullYear(),

                        setTabValue(newValue);

                }; patente: "", Chip,



                const isReadOnly = mode === 'view'; kilometros: 0,



                return(valor: "", Switch, IconButton, IconButton,

        <Dialog 

            open = { open }                     moneda: "ARS",

                    onClose = { onClose } 

            maxWidth = "md"                     estado_codigo: "salon", FormGroup

            fullWidth

            PaperProps = {{ estado_id: "",

                        sx: { minHeight: '600px' }

                    }}                    tipo_operacion: "",

        >                } from '@mui/material'; Alert, Alert,

            < DialogTitle >

    <Box display="flex" justifyContent="space-between" alignItems="center">                    fecha_ingreso: "",

        <Typography variant="h6">

            {mode === 'add' ? 'Agregar Vehículo' : observaciones: "",import CloseIcon from '@mui/icons-material/Close';

                         mode === 'edit' ? 'Editar Vehículo' : 'Ver Vehículo'}

        </Typography>

        <IconButton onClick={onClose} size="small">

            <CloseIcon />                // Campos heredados para compatibilidad (se mapean desde modelo)import SaveIcon from '@mui/icons-material/Save';    Divider, Divider,

        </IconButton>

    </Box>                marca: "",

            </DialogTitle >

    modelo: "",import AddIcon from '@mui/icons-material/Add';

            <DialogContent>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>                version: "",

                    <Tabs value={tabValue} onChange={handleTabChange}>

                        <Tab label="Información General" />                    combustible: "",import DeleteIcon from '@mui/icons-material/Delete'; Tabs, Tabs,

                        <Tab label="Detalles Técnicos" />

                        <Tab label="Contacto" />                        caja: "",

                    </Tabs>

                </Box>                            motorizacion: "",import EditIcon from '@mui/icons-material/Edit';



                {/* Tab 0: Información General */}                traccion: "",

                {tabValue === 0 && (

                    <Grid container spacing={2}>                    puertas: "",import InfoIcon from '@mui/icons-material/Info'; Tab, Tab,

                        <Grid item xs={12} sm={6}>

                            <TextField                        segmento_modelo: "",

                                fullWidth

                                label="Marca"                            cilindrada: "",import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

                                value={formData.marca || ''}

                                onChange={handleChange('marca')}                potencia_hp: "",

                                disabled={isReadOnly}

                            />                    torque_nm: ""import BuildIcon from '@mui/icons-material/Build'; FormControl, FormControl,

                        </Grid>

                        <Grid item xs={12} sm={6}>    })

                            <TextField

                                fullWidth            import PublishIcon from '@mui/icons-material/Publish';

                                label="Modelo"

                                value={formData.modelo || ''}            const [errors, setErrors] = useState({})

                                onChange={handleChange('modelo')}

                                disabled={isReadOnly}    const [activeTab, setActiveTab] = useState(0)import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; InputLabel, InputLabel,

                            />

                        </Grid>            const [publicaciones, setPublicaciones] = useState([])

                        <Grid item xs={12} sm={4}>

                            <TextField    const [estadosDisponibles, setEstadosDisponibles] = useState([])import apiClient from '../../services/apiClient';

                                fullWidth

                                label="Año"            const [loadingEstados, setLoadingEstados] = useState(true)

                                type="number"

                                value={formData.año || ''}    Select, Select,

                                onChange={handleChange('año')}

                                disabled={isReadOnly}            // Cargar estados disponibles

                            />

                        </Grid>            useEffect(() => {

                        <Grid item xs={12} sm={8}>                const VehicleModalEnhanced = ({ vehicle, onSave, onClose }) => {

                            <TextField

                                fullWidth                    const loadEstados = async () => {

                                label="Versión"

                                value={formData.version || ''}                        try {

                                onChange={handleChange('version')}                            const [formData, setFormData] = useState({

                                disabled={isReadOnly}                                MenuItem, MenuItem,

                            />

                        </Grid>                                setLoadingEstados(true)

                        <Grid item xs={12} sm={6}>

                            <TextField                const response = await apiClient.get('/api/estados')        // Campos principales del vehículo según la nueva API

                                fullWidth

                                label="Color"                if(response.success) {

                                value={formData.color || ''}

                                onChange={handleChange('color')}                                setEstadosDisponibles(response.estados || [])        modelo_id: "", InputAdornment, InputAdornment,

                                disabled={isReadOnly}

                            />                } else {

                        </Grid>

                        <Grid item xs={12} sm={6}>                            setEstadosDisponibles([vehiculo_ano: new Date().getFullYear(),

                            <TextField

                                fullWidth                                { codigo: 'salon', nombre: 'En Salón' },

                                label="Precio"

                                type="number"                                { codigo: 'consignacion', nombre: 'En Consignación' }, patente: "", Card, Card,

                                value={formData.precio || ''}

                                onChange={handleChange('precio')}                                { codigo: 'pyc', nombre: 'PYC' },

                                disabled={isReadOnly}

                            />                                { codigo: 'preparacion', nombre: 'En Preparación' }, kilometros: 0,

                        </Grid>

                        <Grid item xs={12}>                                { codigo: 'vendido', nombre: 'Vendido' },

                            <TextField

                                fullWidth                                { codigo: 'entregado', nombre: 'Entregado' }        valor: "", CardContent, CardContent,

                                label="Descripción"

                                multiline                            ])

                                rows={3}

                                value={formData.descripcion || ''}                        } moneda: "ARS",

                                onChange={handleChange('descripcion')}

                                disabled={isReadOnly}            } catch (error) {

                            />

                        </Grid>                        console.error('Error al cargar estados:', error)        estado_codigo: "salon", Chip, Chip,

                    </Grid>

                )}                            setEstadosDisponibles([



                {/* Tab 1: Detalles Técnicos */}                                { codigo: 'salon', nombre: 'En Salón' }, estado_id: "",

                {tabValue === 1 && (

                    <Grid container spacing={2}>                                { codigo: 'consignacion', nombre: 'En Consignación' },

                        <Grid item xs={12} sm={6}>

                            <TextField                                { codigo: 'pyc', nombre: 'PYC' }, tipo_operacion: "", FormControlLabel, FormControlLabel,

                                fullWidth

                                label="Kilómetros"                                { codigo: 'preparacion', nombre: 'En Preparación' },

                                type="number"

                                value={formData.km || ''}                                { codigo: 'vendido', nombre: 'Vendido' }, fecha_ingreso: "",

                                onChange={handleChange('km')}

                                disabled={isReadOnly}                                { codigo: 'entregado', nombre: 'Entregado' }

                            />

                        </Grid>                            ])        observaciones: "", Switch    Switch

                        <Grid item xs={12} sm={6}>

                            <FormControl fullWidth>                    } finally {

                                <InputLabel>Combustible</InputLabel>

                                <Select                        setLoadingEstados(false)

                                    value={formData.combustible || ''}

                                    onChange={handleChange('combustible')}                    }

                                    disabled={isReadOnly}

                                >                }        // Campos heredados para compatibilidad (se mapean desde modelo)} from '@mui/material';} from '@mui/material';

                                    <MenuItem value="Nafta">Nafta</MenuItem>

                                    <MenuItem value="Gasoil">Gasoil</MenuItem>

                                    <MenuItem value="GNC">GNC</MenuItem>

                                    <MenuItem value="Híbrido">Híbrido</MenuItem>    loadEstados()        marca: "",

                                    <MenuItem value="Eléctrico">Eléctrico</MenuItem>

                                </Select>    }, [])

                            </FormControl>

                        </Grid>modelo: "",import {import {

                        <Grid item xs={12} sm={6}>

                            <FormControl fullWidth>    // Mapear datos del vehículo cuando se recibe

                                <InputLabel>Transmisión</InputLabel>

                                <Select    useEffect(() => {

                                    value={formData.transmision || ''}        version: "",

                                    onChange={handleChange('transmision')}

                                    disabled={isReadOnly}        if (vehicle) {

                                >

                                    <MenuItem value="Manual">Manual</MenuItem>        console.log('=== DEBUG MODAL ===')        combustible: "", Close as CloseIcon, Close as CloseIcon,

                                    <MenuItem value="Automática">Automática</MenuItem>

                                    <MenuItem value="CVT">CVT</MenuItem>            console.log('Vehículo recibido:', vehicle)

                                </Select>

                            </FormControl>        caja: "",

                        </Grid>

                        <Grid item xs={12} sm={6}>            const mappedVehicle = {

                            <FormControl fullWidth>

                                <InputLabel>Estado</InputLabel>            modelo_id: vehicle.modelo_id || "", motorizacion: "", Save as SaveIcon, Save as SaveIcon,

                                <Select

                                    value={formData.estado || ''}            vehiculo_ano: vehicle.vehiculo_ano || new Date().getFullYear(),

                                    onChange={handleChange('estado')}

                                    disabled={isReadOnly}            patente: vehicle.patente || "", traccion: "",

                                >

                                    <MenuItem value="Nuevo">Nuevo</MenuItem>            kilometros: vehicle.kilometros || 0,

                                    <MenuItem value="Usado">Usado</MenuItem>

                                    <MenuItem value="Semi-nuevo">Semi-nuevo</MenuItem>            valor: vehicle.valor || "", puertas: "", Info as InfoIcon, Info as InfoIcon,

                                </Select>

                            </FormControl>            moneda: vehicle.moneda || "ARS",

                        </Grid >

                    </Grid > estado_codigo: vehicle.estado?.codigo || "salon", segmento_modelo: "",

                )}

estado_id: vehicle.estado?.id || "",

    {/* Tab 2: Contacto */ }

{
    tabValue === 2 && (tipo_operacion: vehicle.tipo_operacion || "", cilindrada: "", Build as BuildIcon, Build as BuildIcon,

        <Grid container spacing={2}>

            <Grid item xs={12}>            fecha_ingreso: vehicle.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : "",

                <TextField

                    fullWidth observaciones:vehicle.observaciones || "", potencia_hp: "",

                label="Vendedor"

                value={formData.vendedor || ''}

                onChange={handleChange('vendedor')}

                disabled={isReadOnly}            marca: vehicle.modelo?.marca || "", torque_nm: ""    AttachMoney as AttachMoneyIcon, AttachMoney as AttachMoneyIcon,

                            />

            </Grid>            modelo: vehicle.modelo?.modelo || "",

            <Grid item xs={12} sm={6}>

                <TextField version:vehicle.modelo?.version || "",

                                fullWidth        });

                label="Teléfono"

                value={formData.telefono || ''}        combustible: vehicle.modelo?.combustible || "",

                onChange={handleChange('telefono')}

                disabled={isReadOnly}            caja: vehicle.modelo?.caja || "", Publish as PublishIcon, Publish as PublishIcon,

                            />

            </Grid>                motorizacion: vehicle.modelo?.motorizacion || "",

            <Grid item xs={12} sm={6}>

                <TextField traccion:vehicle.modelo?.traccion || "",    const [errors, setErrors] = useState({ });

                fullWidth

                label="Email"        puertas: vehicle.modelo?.puertas || "",

                type="email"

                value={formData.email || ''}            segmento_modelo: vehicle.modelo?.segmento_modelo || "",    const [activeTab, setActiveTab] = useState(0); Add as AddIcon, Add as AddIcon,

                onChange={handleChange('email')}

                disabled={isReadOnly}                cilindrada: vehicle.modelo?.cilindrada || "",

                            />

            </Grid>                    potencia_hp: vehicle.modelo?.potencia_hp || "",

        </Grid>

                )
} torque_nm: vehicle.modelo?.torque_nm || ""

            </DialogContent >

    }    // Estados para las publicaciones    Delete as DeleteIcon    Delete as DeleteIcon

{
    !isReadOnly && (

        <DialogActions sx={{ p: 2 }}>

            <Button onClick={onClose}>

                Cancelar    setFormData(mappedVehicle)    const [publicaciones, setPublicaciones] = useState([]);

            </Button>

            <Button setPublicaciones(vehicle.publicaciones || [])

            onClick={handleSave}

                        variant="contained"} const [editingPublicacion, setEditingPublicacion] = useState(null);} from '@mui/icons-material';} from '@mui/icons-material';

            startIcon={<SaveIcon />}

                    >    }, [vehicle])

            Guardar

        </Button>const [showPublicacionForm, setShowPublicacionForm] = useState(false);

                </DialogActions >

            )
} const handleChange = (e) => {

        </Dialog >

    ); const { name, value, type, checked } = e.targetimport { useForm, Controller } from 'react-hook-form'; import { useForm, Controller } from 'react-hook-form';

};

const newValue = type === "checkbox" ? checked : value

export default VehicleModalEnhanced;
// Estados dinámicos

setFormData((prev) => ({

    ...prev, const [estadosDisponibles, setEstadosDisponibles] = useState([]); import { yupResolver } from '@hookform/resolvers/yup'; import { yupResolver } from '@hookform/resolvers/yup';

    [name]: newValue

}))    const [loadingEstados, setLoadingEstados] = useState(true);



if (errors[name]) {
    import * as yup from 'yup'; import * as yup from 'yup';

    setErrors((prev) => ({ ...prev, [name]: "" }))

}    // Cargar estados disponibles al montar el componente



if (name === "estado_codigo" && newValue) {
    useEffect(() => {
        import apiClient from '../../services/apiClient'; import apiClient from '../../services/apiClient';

        const estado = estadosDisponibles.find(e => e.codigo === newValue)

        if (estado) {
            const loadEstados = async () => {

                setFormData((prev) => ({

                    ...prev, try {

                        estado_id: estado.id

                    }))                setLoadingEstados(true);

            }

        } const response = await apiClient.get('/api/estados');// Esquema de validación// Esquema de validación

    }

                if (response.success) {

        const validateForm = () => {

            const newErrors = {}                    setEstadosDisponibles(response.estados || []); const validationSchema = yup.object({



                if(!formData.modelo_id) { } else { const validationSchema = yup.object({

                    newErrors.modelo_id = "El modelo es requerido"

                }                    // Estados por defecto en caso de error



        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1950 || formData.vehiculo_ano > new Date().getFullYear() + 1) {
                setEstadosDisponibles([modelo_id: yup.string().required('El ID del modelo es requerido'), modelo_id: yup.string().required('El ID del modelo es requerido'),

                    newErrors.vehiculo_ano = "Año inválido (1950 - " + (new Date().getFullYear() + 1) + ")"

        } { codigo: 'salon', nombre: 'En Salón' },



            if (formData.kilometros && formData.kilometros < 0) {
                { codigo: 'consignacion', nombre: 'En Consignación' }, vehiculo_ano: yup    vehiculo_ano: yup

                newErrors.kilometros = "Los kilómetros no pueden ser negativos"

            } { codigo: 'pyc', nombre: 'PYC' },



            if (formData.valor && formData.valor < 0) {
                { codigo: 'preparacion', nombre: 'En Preparación' },            .number().number()

                newErrors.valor = "El valor no puede ser negativo"

            } { codigo: 'vendido', nombre: 'Vendido' },



            if (formData.patente && formData.patente.length > 15) {
                { codigo: 'entregado', nombre: 'Entregado' }            .min(1950, 'Año mínimo 1950').min(1950, 'Año mínimo 1950')

                newErrors.patente = "La patente no puede tener más de 15 caracteres"

            }                    ]);



            setErrors(newErrors)
        }            .max(new Date().getFullYear() + 1, 'Año máximo ' + (new Date().getFullYear() + 1)).max(new Date().getFullYear() + 1, 'Año máximo ' + (new Date().getFullYear() + 1))

        return Object.keys(newErrors).length === 0

    }
} catch (error) {



    const handleSubmit = (e) => {
        console.error('Error al cargar estados:', error);            .required('El año es requerido'),        .required('El año es requerido'),

            e.preventDefault()

        // Estados por defecto en caso de error

        if (validateForm()) {

            const dataToSend = {
                setEstadosDisponibles([patente: yup.string(), patente: yup.string(),

                modelo_id: formData.modelo_id,

                vehiculo_ano: parseInt(formData.vehiculo_ano),                    { codigo: 'salon', nombre: 'En Salón' },

                patente: formData.patente || null,

                    kilometros: parseInt(formData.kilometros) || 0, { codigo: 'consignacion', nombre: 'En Consignación' }, kilometros: yup.number().min(0, 'Los kilómetros no pueden ser negativos'), kilometros: yup.number().min(0, 'Los kilómetros no pueden ser negativos'),

                        valor: formData.valor ? parseFloat(formData.valor) : null,

                            moneda: formData.moneda || "ARS", { codigo: 'pyc', nombre: 'PYC' },

                                estado_codigo: formData.estado_codigo || "salon",

                                    tipo_operacion: formData.tipo_operacion || null, { codigo: 'preparacion', nombre: 'En Preparación' }, valor: yup.number().min(0, 'El valor no puede ser negativo'), valor: yup.number().min(0, 'El valor no puede ser negativo'),

                                        fecha_ingreso: formData.fecha_ingreso || null,

                                            observaciones: formData.observaciones || null                    { codigo: 'vendido', nombre: 'Vendido' },

        }

        { codigo: 'entregado', nombre: 'Entregado' } moneda: yup.string().required('La moneda es requerida'), moneda: yup.string().required('La moneda es requerida'),

            if (vehicle?.id) {

            dataToSend.id = vehicle.id                ]);

        }

    } finally {
        estado_codigo: yup.string().required('El estado es requerido'), estado_codigo: yup.string().required('El estado es requerido'),

            console.log('Datos a enviar:', dataToSend)

        onSave(dataToSend, publicaciones)                setLoadingEstados(false);

    }

}
}        tipo_operacion: yup.string(), tipo_operacion: yup.string(),



    const tabs = [        };

{ id: "basica", label: "Información Básica" },

{ id: "publicaciones", label: "Publicaciones" } fecha_ingreso: yup.date(), fecha_ingreso: yup.date(),

    ]

loadEstados();

return (

    <Dialog    }, []); observaciones: yup.string()    observaciones: yup.string()

open = { true}

onClose = { onClose }

maxWidth = "lg"

fullWidth    // Mapear datos del vehículo cuando se recibe    });

PaperProps = {{

    sx: {
        useEffect(() => { });

        borderRadius: '12px',

            maxHeight: '90vh'        if (vehicle) {

            }

    }
} console.log('=== DEBUG MODAL ===');

        >

    <DialogTitle sx={{ pb: 2 }}>            console.log('Vehículo recibido:', vehicle);

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>            console.log('¿Tiene modelo?:', !!vehicle.modelo);function TabPanel({children, value, index}) {

                { vehicle? "Editar Vehículo": "Nuevo Vehículo" }

                    </Typography>            if (vehicle.modelo) {function TabPanel({ children, value, index }) {

                <IconButton onClick={onClose} size="small">

                    <CloseIcon />                console.log('Datos del modelo:', vehicle.modelo);

                </IconButton>

                </Box>            }        return (    return (

    </DialogTitle>

console.log('==================');

            <Divider />

            <div hidden={value !== index}>        <div hidden={value !== index}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>

                <Tabs            // Mapear datos según nueva estructura de la API

                    value={activeTab}

                    onChange={(event, newValue) => setActiveTab(newValue)}            const mappedVehicle = {                {value === index && <Box sx={{ py: 3 }}>{children}</Box>}            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}

                    variant="scrollable"

                    scrollButtons="auto"                // Campos principales del vehículo

                    sx={{

                        '& .MuiTab-root': {                modelo_id: vehicle.modelo_id || "",            </div>        </div>

minHeight: 64,

    fontWeight: 500                vehiculo_ano: vehicle.vehiculo_ano || new Date().getFullYear(),

                        }

                    }}                patente: vehicle.patente || "",        );    );

                >

{
    tabs.map((tab, index) => (kilometros: vehicle.kilometros || 0,

        <Tab

            key={tab.id} valor:vehicle.valor || "",
}

label = { tab.label }

sx = {{ minHeight: 64 }}                moneda: vehicle.moneda || "ARS",}

                        />

                    ))}                estado_codigo: vehicle.estado?.codigo || "salon",

                </Tabs >

            </Box > estado_id: vehicle.estado?.id || "",



    <DialogContent sx={{ py: 3 }}>                tipo_operacion: vehicle.tipo_operacion || "",

        <Box component="form" onSubmit={handleSubmit}>

            {activeTab === 0 && (fecha_ingreso: vehicle.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : "",const VehicleModalEnhanced = ({open, onClose, vehicle, onSave}) => {

                <Box sx={{ mt: 2 }}>

                    <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>                observaciones: vehicle.observaciones || "",    const VehicleModalEnhanced = ({open, onClose, vehicle, onSave}) => {

                        Información del Vehículo

                    </Typography>



                    <Grid container spacing={3}>                // Datos del modelo (solo lectura, para mostrar)        const [loading, setLoading] = useState(false); const [loading, setLoading] = useState(false);

                        <Grid item xs={12} sm={6}>

                            <TextField marca:vehicle.modelo?.marca || "",

                            fullWidth

                            label="Modelo ID"                modelo: vehicle.modelo?.modelo || "",        const [error, setError] = useState(null); const [error, setError] = useState(null);

                            name="modelo_id"

                            value={formData.modelo_id}                version: vehicle.modelo?.version || "",

                            onChange={handleChange}

                            error={!!errors.modelo_id}                combustible: vehicle.modelo?.combustible || "",        const [activeTab, setActiveTab] = useState(0); const [activeTab, setActiveTab] = useState(0);

                            helperText={errors.modelo_id || "ID del modelo del vehículo"}

                            required                caja: vehicle.modelo?.caja || "",

                                    />

                        </Grid>                motorizacion: vehicle.modelo?.motorizacion || "",



                        <Grid item xs={12} sm={6}>                traccion: vehicle.modelo?.traccion || "",

                            <TextField

                                fullWidth puertas:vehicle.modelo?.puertas || "",        // Estados para datos dinámicos    // Estados para datos dinámicos

                            label="Año del Vehículo"

                            name="vehiculo_ano"                segmento_modelo: vehicle.modelo?.segmento_modelo || "",

                            type="number"

                            value={formData.vehiculo_ano}                cilindrada: vehicle.modelo?.cilindrada || "",        const [estados, setEstados] = useState([]); const [estados, setEstados] = useState([]);

                            onChange={handleChange}

                            error={!!errors.vehiculo_ano}                potencia_hp: vehicle.modelo?.potencia_hp || "",

                            helperText={errors.vehiculo_ano}

                            required                torque_nm: vehicle.modelo?.torque_nm || ""        const [publicaciones, setPublicaciones] = useState([]); const [publicaciones, setPublicaciones] = useState([]);

                            inputProps={{ min: 1950, max: new Date().getFullYear() + 1 }}

                                    />            };

                        </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField setFormData(mappedVehicle);

                            fullWidth

                            label="Patente"        // Información del vehículo (solo lectura)    // Información del vehículo (solo lectura)

                            name="patente"

                            value={formData.patente}            // Inicializar publicaciones desde el vehículo

                            onChange={handleChange}

                            error={!!errors.patente}            setPublicaciones(vehicle.publicaciones || []);        const [vehicleInfo, setVehicleInfo] = useState({

                                helperText = { errors.patente }

                                        inputProps={{ maxLength: 15 }}        }            const [vehicleInfo, setVehicleInfo] = useState({

                                placeholder = "ABC123"

                                />    }, [vehicle]);

                        </Grid>

                        marca: '', marca: '',

                        <Grid item xs={12} sm={6}>

                            <TextField const handleChange= (e) => {

                                fullWidth

                                        label="Kilómetros"        const {name, value, type, checked} = e.target;                modelo: '', modelo: '',

                            name="kilometros"

                            type="number"        const newValue = type === "checkbox" ? checked : value;

                            value={formData.kilometros}

                            onChange={handleChange}                version: '', version: '',

                            error={!!errors.kilometros}

                            helperText={errors.kilometros}        setFormData((prev) => ({

                                inputProps = {{min: 0 }}

                                    />            ...prev,                combustible: '', combustible: '',

                        </Grid>

                        [name]: newValue

                        <Grid item xs={12} sm={6}>

                            <FormControl fullWidth error={!!errors.estado_codigo}>        }));                caja: '', caja: '',

                                <InputLabel>Estado</InputLabel>

                                <Select

                                    name="estado_codigo"

                                    value={formData.estado_codigo}        // Limpiar error del campo                motorizacion: '', motorizacion: '',

                                    label="Estado"

                                    onChange={handleChange} if (errors[name]) {

                                    disabled = { loadingEstados }

                                    > setErrors((prev) => ({ ...prev, [name]: "" }));                traccion: '', traccion: '',

                                {estadosDisponibles.map((estado) => (

                                    <MenuItem key={estado.codigo} value={estado.codigo}>        }

                                        {estado.nombre}

                                    </MenuItem>                puertas: '', puertas: '',

                                            ))}

                            </Select>        // Si cambió el estado_codigo, buscar el estado_id correspondiente

                        </FormControl>

                    </Grid>        if (name === "estado_codigo" && newValue) {segmento_modelo: '', segmento_modelo: '',



                    <Grid item xs={12} sm={6}>            const estado = estadosDisponibles.find(e => e.codigo === newValue);

                        <TextField

                            fullWidth if (estado) {cilindrada: '', cilindrada: '',

                        label="Valor"

                                        name="valor"                setFormData((prev) => ({

                            type = "number"

                                        value={formData.valor}                    ...prev,                potencia_hp: '', potencia_hp: '',

                        onChange={handleChange}

                        error={!!errors.valor}                    estado_id: estado.id

                        helperText={errors.valor}

                        inputProps={{ min: 0, step: "0.01" }}                }));                torque_nm: ''        torque_nm: ''

                                    />

                    </Grid>            }



                    <Grid item xs={12} sm={6}>        }            });

                        <FormControl fullWidth>

                            <InputLabel>Moneda</InputLabel>    };        });

                            <Select

                                name="moneda"

                                value={formData.moneda}

                                label="Moneda"    // Funciones para manejo de publicaciones

                                onChange={handleChange}

                            >    const addPublicacion = () => {

                                            <MenuItem value="ARS">ARS (Pesos Argentinos)</MenuItem>

                                            <MenuItem value="USD">USD (Dólares)</MenuItem>        const newPublicacion = {        // Opciones para selects    // Opciones para selects

                                        </Select>

                        </FormControl>            id: `temp_${Date.now()}`, // ID temporal para gestión local

                    </Grid>

                    plataforma: 'mercadolibre',        const monedasOptions = [    const monedasOptions = [

                    <Grid item xs={12} sm={6}>

                        <TextField url_publicacion: '',

                        fullWidth

                        label="Tipo de Operación"            id_publicacion: '',            {value: 'ARS', label: 'Peso Argentino' }, {value: 'ARS', label: 'Peso Argentino' },

                        name="tipo_operacion"

                        value={formData.tipo_operacion}            titulo: `${formData.marca} ${formData.modelo} ${formData.vehiculo_ano}`,

                        onChange={handleChange}

                        placeholder="ej: Venta, Consignación"            ficha_breve: formData.observaciones || '',            {value: 'USD', label: 'Dólar' }, {value: 'USD', label: 'Dólar' },

                                    />

                    </Grid>            activo: true



                    <Grid item xs={12} sm={6}>        };            {value: 'EUR', label: 'Euro' }, {value: 'EUR', label: 'Euro' },

                        <TextField

                            fullWidth setPublicaciones(prev => [...prev, newPublicacion]);

                        label="Fecha de Ingreso"

                        name="fecha_ingreso"        setEditingPublicacion(newPublicacion);            {value: 'BRL', label: 'Real Brasileño' }        {value: 'BRL', label: 'Real Brasileño' }

                        type="date"

                        value={formData.fecha_ingreso}        setShowPublicacionForm(true);

                        onChange={handleChange}

                        InputLabelProps={{ shrink: true }}    };        ];    ];

                                    />

                    </Grid>



                    <Grid item xs={12}>    const editPublicacion = (publicacion) => {

                        <TextField

                            fullWidth setEditingPublicacion(publicacion);

                        label="Observaciones"

                        name="observaciones"        setShowPublicacionForm(true);        // Valores por defecto del formulario    // Valores por defecto del formulario

                        multiline

                        rows={4}    };

                        value={formData.observaciones}

                        onChange={handleChange}        const defaultValues = {

                            error = {!!errors.observaciones}

                        helperText={errors.observaciones}    const savePublicacion = (publicacionData) => {            const defaultValues = {

                            inputProps = {{maxLength: 1000 }}

                        placeholder="Descripción, estado del vehículo, características especiales..."        if (editingPublicacion) {

                                    />

                                </Grid>            // Actualizar la publicación en la lista local                modelo_id: vehicle?.modelo_id || '', modelo_id: vehicle?.modelo_id || '',

                </Grid>

            setPublicaciones(prev => prev.map(pub =>

            {formData.marca && (

                <Box sx={{ mt: 4 }}>                pub.id === editingPublicacion.id                vehiculo_ano: vehicle?.vehiculo_ano || new Date().getFullYear(), vehiculo_ano: vehicle?.vehiculo_ano || new Date().getFullYear(),

                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>

                        Información del Modelo                    ? {...pub, ...publicacionData }

                    </Typography>

                    <Grid container spacing={2}>                    : pub                patente: vehicle?.patente || '', patente: vehicle?.patente || '',

                        <Grid item xs={12} sm={6} md={4}>

                            <TextField            ));

                            fullWidth

                                                label="Marca"        }                kilometros: vehicle?.kilometros || 0, kilometros: vehicle?.kilometros || 0,

                            value={formData.marca}

                            disabled        setEditingPublicacion(null);

                            size="small"

                                            />        setShowPublicacionForm(false);                valor: vehicle?.valor || '', valor: vehicle?.valor || '',

                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>    };

                            <TextField

                                fullWidth moneda:vehicle?.moneda || 'ARS', moneda: vehicle?.moneda || 'ARS',

                            label="Modelo"

                            value={formData.modelo}    const deletePublicacion = (publicacionId) => {

                                disabled

                                                size="small"        setPublicaciones(prev => prev.filter(pub => pub.id !== publicacionId));                estado_codigo: vehicle?.estado?.codigo || 'salon', estado_codigo: vehicle?.estado?.codigo || 'salon',

                                            />

                        </Grid>    };

                        {formData.version && (

                            <Grid item xs={12} sm={6} md={4}>                tipo_operacion: vehicle?.tipo_operacion || '', tipo_operacion: vehicle?.tipo_operacion || '',

                                <TextField

                                    fullWidth const validateForm= () => {

                                    label = "Versión"

                                                    value={formData.version}        const newErrors = { };                fecha_ingreso: vehicle?.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : '', fecha_ingreso: vehicle?.fecha_ingreso ? vehicle.fecha_ingreso.split('T')[0] : '',

                                disabled

                                size="small"

                                                />

                            </Grid>        // Validaciones según la nueva API                observaciones: vehicle?.observaciones || ''        observaciones: vehicle?.observaciones || ''

                        )}

                    </Grid>        if (!formData.modelo_id) {

                                </Box>

            )}            newErrors.modelo_id = "El modelo es requerido";            };

        </Box>

                    )}        }        };



        {activeTab === 1 && (

            <Box sx={{ mt: 2 }}>

                <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1950 || formData.vehiculo_ano > new Date().getFullYear() + 1) {

                    Gestión de Publicaciones

                </Typography>            newErrors.vehiculo_ano = "Año inválido (1950 - " + (new Date().getFullYear() + 1) + ")";



                <Box sx={{}        // Hook form    // Hook form

                                p: 3,

                textAlign: 'center',

                border: '2px dashed',

                borderColor: 'divider',        if (formData.kilometros && formData.kilometros < 0) {        const {control, handleSubmit, formState: {errors}, reset } = useForm({

                    borderRadius: 2,

                color: 'text.secondary'            newErrors.kilometros = "Los kilómetros no pueden ser negativos";            const {control, handleSubmit, formState: {errors}, reset } = useForm({

                }}>

                <PublishIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />        }

                <Typography variant="body1">

                    No hay publicaciones registradas                resolver: yupResolver(validationSchema), resolver: yupResolver(validationSchema),

                </Typography>

                <Typography variant="body2">        if (formData.valor && formData.valor < 0) {

                    Funcionalidad de publicaciones próximamente

                </Typography>            newErrors.valor = "El valor no puede ser negativo";                defaultValues        defaultValues

            </Box>

                        </Box>        }

                    )}

                </Box >            });

            </DialogContent >

        if (formData.patente && formData.patente.length > 15) { });

<Divider />

newErrors.patente = "La patente no puede tener más de 15 caracteres";

<DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50' }}>

    <Button        }

    onClick={onClose}

    variant="outlined"

    sx={{ minWidth: 120 }}

                >        if (formData.observaciones && formData.observaciones.length > 1000) {        // Cargar datos dinámicos al abrir el modal    // Cargar datos dinámicos al abrir el modal

        Cancelar

                </Button>            newErrors.observaciones = "Las observaciones no pueden tener más de 1000 caracteres";

<Button

    onClick={handleSubmit}        } useEffect(() => {

        variant = "contained"

        startIcon = {< SaveIcon />}            useEffect(() => {

            sx = {{ minWidth: 120 }
        }

                > setErrors(newErrors);

{ vehicle ? "Actualizar" : "Crear" } Vehículo

                </Button >        return Object.keys(newErrors).length === 0; const loadInitialData = async () => {

            </DialogActions >

        </Dialog >    }; const loadInitialData = async () => {

    )

}



export default VehicleModalEnhanced    const handleSubmit = (e) => {
    try {

        e.preventDefault(); try {



            if (validateForm()) {                                // Cargar estados                // Cargar estados

                // Preparar datos según la nueva estructura de la API

                const dataToSend = {
                    const estadosResponse = await apiClient.get('/api/estados'); const estadosResponse = await apiClient.get('/api/estados');

                    modelo_id: formData.modelo_id,

                    vehiculo_ano: parseInt(formData.vehiculo_ano), if(estadosResponse.success) {

                        patente: formData.patente || null,                                    if (estadosResponse.success) {

                            kilometros: parseInt(formData.kilometros) || 0,

                                valor: formData.valor ? parseFloat(formData.valor) : null, setEstados(estadosResponse.estados || []); setEstados(estadosResponse.estados || []);

                            moneda: formData.moneda || "ARS",

                                estado_codigo: formData.estado_codigo || "salon",                                    } else { } else {

                    tipo_operacion: formData.tipo_operacion || null,

                        fecha_ingreso: formData.fecha_ingreso || null,                                        // Fallback con estados estáticos                    // Fallback con estados estáticos

                            observaciones: formData.observaciones || null

                }; setEstados([setEstados([



            // Agregar ID del vehículo si es una edición                                            { codigo: 'salon', nombre: 'En Salón' }, { codigo: 'salon', nombre: 'En Salón' },

            if (vehicle?.id) {

                    dataToSend.id = vehicle.id; { codigo: 'consignacion', nombre: 'En Consignación' }, { codigo: 'consignacion', nombre: 'En Consignación' },

                }

                { codigo: 'pyc', nombre: 'PYC' }, { codigo: 'pyc', nombre: 'PYC' },

                console.log('Datos a enviar:', dataToSend);

                onSave(dataToSend, publicaciones); // Enviar también las publicaciones                                            { codigo: 'preparacion', nombre: 'En Preparación' }, { codigo: 'preparacion', nombre: 'En Preparación' },

            }

        }; { codigo: 'vendido', nombre: 'Vendido' }, { codigo: 'vendido', nombre: 'Vendido' },



        const tabs = [{ codigo: 'entregado', nombre: 'Entregado' }                        { codigo: 'entregado', nombre: 'Entregado' }

        { id: "basica", label: "Información Básica" },

        { id: "publicaciones", label: "Publicaciones" }]);                    ]);

    ];

        }                }

return (

    <Dialog} catch (err) { } catch (err) {

        open = { true}

        onClose = { onClose }    console.error('Error cargando datos iniciales:', err); console.error('Error cargando datos iniciales:', err);

        maxWidth = "lg"

        fullWidth
    }            }

PaperProps = {{

    sx: { };
};

borderRadius: '12px',

    maxHeight: '90vh'

                }

            }}if (open) {

        >    if (open) {

            <DialogTitle sx={{ pb: 2 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>        loadInitialData(); loadInitialData();

                    <Typography variant="h5" sx={{ fontWeight: 600 }}>

                        {vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}    }

                    </Typography>}

                    <IconButton onClick={onClose} size="small">

                        <CloseIcon />    }, [open]);    }, [open]);

                    </IconButton>

                </Box>

            </DialogTitle>

// Inicializar información del vehículo    // Inicializar información del vehículo

            <Divider />

        useEffect(() => {

            {/* Tabs */ } useEffect(() => {

                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>

                    <Tabs if (open && vehicle) {

                        value = { activeTab }            if (open && vehicle) {

                        onChange = {(event, newValue) => setActiveTab(newValue)}

                    variant="scrollable"                console.log('🔄 Cargando vehículo para edición:', vehicle); console.log('🔄 Cargando vehículo para edición:', vehicle);

                    scrollButtons="auto"

                    sx={{

                        '& .MuiTab-root': {

                            minHeight: 64, setVehicleInfo({

                                fontWeight: 500                    setVehicleInfo({

                                }

                    }}                        marca: vehicle.modelo?.marca || '', marca: vehicle.modelo?.marca || '',

                >

                    {tabs.map((tab, index) => (modelo: vehicle.modelo?.modelo || '', modelo: vehicle.modelo?.modelo || '',

                    <Tab

                        key={tab.id} version:vehicle.modelo?.version || '', version: vehicle.modelo?.version || '',

                    label={tab.label}

                    sx={{ minHeight: 64 }}                    combustible: vehicle.modelo?.combustible || '', combustible: vehicle.modelo?.combustible || '',

                        />

                    ))}                    caja: vehicle.modelo?.caja || '', caja: vehicle.modelo?.caja || '',

                </Tabs>

            </Box > motorizacion: vehicle.modelo?.motorizacion || '', motorizacion: vehicle.modelo?.motorizacion || '',



                    <DialogContent sx={{ py: 3 }}>                    traccion: vehicle.modelo?.traccion || '', traccion: vehicle.modelo?.traccion || '',

                        <Box component="form" onSubmit={handleSubmit}>

                            {/* Tab: Información Básica */}                    puertas: vehicle.modelo?.puertas || '', puertas: vehicle.modelo?.puertas || '',

                            {activeTab === 0 && (

                                <Box sx={{ mt: 2 }}>                    segmento_modelo: vehicle.modelo?.segmento_modelo || '', segmento_modelo: vehicle.modelo?.segmento_modelo || '',

                                    <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>

                                        Información del Vehículo                    cilindrada: vehicle.modelo?.cilindrada || '', cilindrada: vehicle.modelo?.cilindrada || '',

                                    </Typography>

                                    potencia_hp: vehicle.modelo?.potencia_hp || '', potencia_hp: vehicle.modelo?.potencia_hp || '',

                                    <Grid container spacing={3}>

                                        <Grid item xs={12} sm={6}>                    torque_nm: vehicle.modelo?.torque_nm || ''                torque_nm: vehicle.modelo?.torque_nm || ''

                                            <TextField

                                                fullWidth                });

                                        label="Modelo ID"            });

                                            name="modelo_id"

                                            value={formData.modelo_id}

                                            onChange={handleChange}

                                            error={!!errors.modelo_id}    setPublicaciones(vehicle.publicaciones || []); setPublicaciones(vehicle.publicaciones || []);

                                            helperText={errors.modelo_id || "ID del modelo del vehículo"}

                                            required    reset(defaultValues); reset(defaultValues);

                                    />

                                        </Grid>} else { } else {



                                            <Grid item xs={12} sm={6}>    setVehicleInfo({setVehicleInfo({

                                    < TextField

                                        fullWidth        marca: '', modelo: '', version: '', combustible: '', marca: '', modelo: '', version: '', combustible: '',

                                                label="Año del Vehículo"

                                                name="vehiculo_ano"        caja: '', motorizacion: '', traccion: '', puertas: '', caja: '', motorizacion: '', traccion: '', puertas: '',

                                                type="number"

                                                value={formData.vehiculo_ano}        segmento_modelo: '', cilindrada: '', potencia_hp: '', torque_nm: ''                segmento_modelo: '', cilindrada: '', potencia_hp: '', torque_nm: ''

                                                onChange={handleChange}

                                                error={!!errors.vehiculo_ano}    });            });

                                                helperText={errors.vehiculo_ano}

                                                requiredsetPublicaciones([]); setPublicaciones([]);

                                                inputProps={{ min: 1950, max: new Date().getFullYear() + 1 }}

                                    />reset(defaultValues); reset(defaultValues);

                                            </Grid>

                                        }        }

                                        <Grid item xs={12} sm={6}>

                                            <TextField

                                                fullWidth

                                                label="Patente" if (open) {

                                                name = "patente"    if (open) {

                                                value = { formData.patente }

                                        onChange={handleChange}        setError(null); setError(null);

                                            error={!!errors.patente}

                                            helperText={errors.patente}        setActiveTab(0); setActiveTab(0);

                                            inputProps={{ maxLength: 15 }}

                                        placeholder="ABC123"    }

                                    />}

                                        </Grid>

    }, [open, vehicle, reset]);    }, [open, vehicle, reset]);

                                        <Grid item xs={12} sm={6}>

                                            <TextField

                                                fullWidth

                                                label="Kilómetros" const onSubmit= async (formData) => {

                                                name = "kilometros"    const onSubmit = async (formData) => {

                                                type = "number"

                                        value={formData.kilometros}        try {

                                                onChange = { handleChange }            try {

                                                error = {!!errors.kilometros}

                                            helperText={errors.kilometros}                setLoading(true); setLoading(true);

                                            inputProps={{ min: 0 }}

                                    />                setError(null); setError(null);

                                        </Grid>



                                        <Grid item xs={12} sm={6}>

                                            <FormControl fullWidth error={!!errors.estado_codigo}>                // Preparar datos para envío            // Preparar datos para envío

                                                <InputLabel>Estado</InputLabel>

                                                <Select const dataToSend={

                                                    name = "estado_codigo"                    const dataToSend={

                                                        value = { formData.estado_codigo }

                                            label="Estado" modelo_id:formData.modelo_id, modelo_id: formData.modelo_id,

                                                onChange={handleChange}

                                                disabled={loadingEstados}                        vehiculo_ano: parseInt(formData.vehiculo_ano), vehiculo_ano: parseInt(formData.vehiculo_ano),

                                        >

                                                {estadosDisponibles.map((estado) => (patente: formData.patente || null, patente: formData.patente || null,

                                                <MenuItem key={estado.codigo} value={estado.codigo}>

                                                    {estado.nombre}                        kilometros: parseInt(formData.kilometros || 0), kilometros: parseInt(formData.kilometros || 0),

                                                </MenuItem>

                                            ))}                        valor: parseFloat(formData.valor || 0) || null, valor: parseFloat(formData.valor || 0) || null,

                                            </Select>

                                            {errors.estado_codigo && (moneda: formData.moneda, moneda: formData.moneda,

                                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>

                                                {errors.estado_codigo}                        estado_codigo: formData.estado_codigo, estado_codigo: formData.estado_codigo,

                                            </Typography>

                                        )}                        tipo_operacion: formData.tipo_operacion || null, tipo_operacion: formData.tipo_operacion || null,

                                        </FormControl>

                                    </Grid>                        fecha_ingreso: formData.fecha_ingreso || null, fecha_ingreso: formData.fecha_ingreso || null,



                                    <Grid item xs={12} sm={6}>                        observaciones: formData.observaciones || null                observaciones: formData.observaciones || null

                                        <TextField

                                            fullWidth                    };

                                        label="Valor"                };

                                        name="valor"

                                        type="number"

                                        value={formData.valor}

                                        onChange={handleChange}                // Limpiar campos nulos/vacíos            // Limpiar campos nulos/vacíos

                                        error={!!errors.valor}

                                        helperText={errors.valor}                Object.keys(dataToSend).forEach(key => {

                                            inputProps = {{min: 0, step: "0.01" }}                    Object.keys(dataToSend).forEach(key => {

                                    />

                                </Grid>                        if (dataToSend[key] === '' || dataToSend[key] === null || dataToSend[key] === 0) {

                            if (dataToSend[key] === '' || dataToSend[key] === null || dataToSend[key] === 0) {

                                        <Grid item xs={12} sm={6}>

                                            <FormControl fullWidth>                                if (['modelo_id', 'vehiculo_ano', 'moneda', 'estado_codigo'].includes(key)) {

                                                <InputLabel>Moneda</InputLabel>                                    if (['modelo_id', 'vehiculo_ano', 'moneda', 'estado_codigo'].includes(key)) {

                                                    <Select

                                                        name="moneda" return; // Campos requeridos                        return; // Campos requeridos

                                                value={formData.moneda}

                                            label="Moneda"                                    }

                                                onChange={handleChange}                                }

                                        >

                                                <MenuItem value="ARS">ARS (Pesos Argentinos)</MenuItem>                                delete dataToSend[key]; delete dataToSend[key];

                                                <MenuItem value="USD">USD (Dólares)</MenuItem>

                                            </Select>                            }

                                        </FormControl>}

                                </Grid>

                    });

                            <Grid item xs={12} sm={6}>                });

                                <TextField

                                    fullWidth

                                    label="Tipo de Operación"

                                    name="tipo_operacion" await onSave(dataToSend, publicaciones); await onSave(dataToSend, publicaciones);

                                value={formData.tipo_operacion}

                                onChange={handleChange}

                                placeholder="ej: Venta, Consignación"

                                    />            } catch (err) { } catch (err) {

                                </Grid>

                            console.error('Error guardando vehículo:', err); console.error('Error guardando vehículo:', err);

                            <Grid item xs={12} sm={6}>

                                <TextField setError(err.response?.data?.error || err.message || 'Error guardando vehículo'); setError(err.response?.data?.error || err.message || 'Error guardando vehículo');

                                fullWidth

                                        label="Fecha de Ingreso"            } finally { } finally {

                                    name = "fecha_ingreso"

                                        type="date"                setLoading(false); setLoading(false);

                                value={formData.fecha_ingreso}

                                onChange={handleChange}            }

                                InputLabelProps={{ shrink: true }}        }

                                    />

                            </Grid>    };

};

                            <Grid item xs={12}>

                                <TextField

                                    fullWidth

                                    label="Observaciones"// Funciones para manejo de publicaciones    // Funciones para manejo de publicaciones

                                    name="observaciones"

                                    multilineconst addPublicacion= () => {

                                    rows = { 4}    const addPublicacion = () => {

                                    value = { formData.observaciones }

                                        onChange={handleChange}        const newPublicacion = {

                                    error = {!!errors.observaciones}            const newPublicacion = {

                                    helperText = { errors.observaciones }

                                        inputProps={{ maxLength: 1000 }}                id: `temp_${Date.now()}`, id: `temp_${Date.now()}`,

                                placeholder="Descripción, estado del vehículo, características especiales..."

                                    />                plataforma: 'mercadolibre', plataforma: 'mercadolibre',

                            </Grid>

                        </Grid>                url_publicacion: '', url_publicacion: '',



                        {/* Información del modelo (solo lectura) */}                titulo: `${vehicleInfo.marca} ${vehicleInfo.modelo} ${defaultValues.vehiculo_ano}`, titulo: `${vehicleInfo.marca} ${vehicleInfo.modelo} ${defaultValues.vehiculo_ano}`,

                        {formData.marca && (

                            <Box sx={{ mt: 4 }}>                activo: true            activo: true

                                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>

                                        Información del Modelo            };

                                </Typography>        };

                                <Grid container spacing={2}>

                                    <Grid item xs={12} sm={6} md={4}>        setPublicaciones(prev => [...prev, newPublicacion]); setPublicaciones(prev => [...prev, newPublicacion]);

                                        <TextField

                                            fullWidth    };

                                                label="Marca"};

                                        value={formData.marca}

                                        disabled

                                        size="small"

                                            />const deletePublicacion = (id) => {

                                        </Grid>    const deletePublicacion = (id) => {

                                        <Grid item xs={12} sm={6} md={4}>

                                            <TextField setPublicaciones(prev => prev.filter(pub => pub.id !== id)); setPublicaciones(prev => prev.filter(pub => pub.id !== id));

                                            fullWidth

                                                label="Modelo"    };

                                            value={formData.modelo}};

                                            disabled

                                            size="small"

                                            />

                                        </Grid>if (!open) return null; if (!open) return null;

                                    {formData.version && (

                                        <Grid item xs={12} sm={6} md={4}>

                                            <TextField

                                                fullWidthreturn (    return (

                                            label="Versión"

                                            value={formData.version}        <Dialog         <Dialog

                                                disabled

                                                size="small" open={open} open={open}

                                            />

                                        </Grid>            onClose={onClose}             onClose={onClose} 

                                        )}

                                    {formData.combustible && (maxWidth = "lg"             maxWidth="lg"

                                    <Grid item xs={12} sm={6} md={4}>

                                        <TextField fullWidth fullWidth

                                            fullWidth

                                            label="Combustible" PaperProps={{ PaperProps={{

                                                    value = { formData.combustible }

                                                    disabled sx: {                 sx: {

                                            size = "small"

                                            /> borderRadius: 2, borderRadius: 2,

                                    </Grid>

                                        )}    maxHeight: '90vh'                    maxHeight: '90vh'

                                    {formData.caja && (

                                        <Grid item xs={12} sm={6} md={4}>                }                }

                                            <TextField

                                                fullWidth            }}            }}

                                            label="Caja"

                                            value={formData.caja}        >        >

                                            disabled

                                            size="small"            <DialogTitle sx={{ pb: 2 }}>            <DialogTitle sx={{ pb: 2 }}>

                                                />

                                            </Grid>                <Box display="flex" justifyContent="space-between" alignItems="center">                <Box display="flex" justifyContent="space-between" alignItems="center">

                                        )}

                                                {formData.motorizacion && (<Typography variant="h5" sx={{ fontWeight: 600 }}>                    <Typography variant="h5" sx={{ fontWeight: 600 }}>

                                                    <Grid item xs={12} sm={6} md={4}>

                                                        <TextField                        {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}                        {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}

                                                            fullWidth

                                                            label="Motorización"                    </Typography>                    </Typography>

                                                    value={formData.motorizacion}

                                                disabled                    <IconButton onClick={onClose} size="small">                    <IconButton onClick={onClose} size="small">

                                                    size="small"

                                                />                        <CloseIcon />                        <CloseIcon />

                                                </Grid>

                                        )}                    </IconButton>                    </IconButton>

                                                </Grid>

                                            </Box>                </Box>                </Box>

                        )}

                    </Box>            </DialogTitle >            </DialogTitle >

                    )
        }



                    {/* Tab: Publicaciones */ }

                    { activeTab === 1 && (            <Divider />            <Divider />

                        <Box sx={{ mt: 2 }}>

                            <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>

                                Gestión de Publicaciones

                            </Typography>            <DialogContent sx={{ py: 0 }}>            <DialogContent sx={{ py: 0 }}>



                            {/* Botón para agregar nueva publicación */}                {error && (                {error && (

                            <Box sx={{ mb: 3 }}>

                                <Button                    <Alert severity="error" sx={{ m: 3 }}>                    <Alert severity="error" sx={{ m: 3 }}>

                                    variant="contained"

                                    startIcon={<AddIcon />}                        {error}                        {error}

                                    onClick={addPublicacion}

                                    sx={{ mb: 2 }}                    </Alert>                    </Alert>

                                >

                                    Agregar Publicación                )}                )}

                                </Button>

                            </Box>



                            {/* Lista de publicaciones */}                {/* Tabs */}                {/* Tabs */}

                            {publicaciones.length > 0 ? (

                                <Grid container spacing={2}>                <Box sx={{ borderBottom: 1, borderColor: 'divider', m: 3, mb: 0 }}>                <Box sx={{ borderBottom: 1, borderColor: 'divider', m: 3, mb: 0 }}>

                                    {publicaciones.map((publicacion) => (

                                        <Grid item xs={12} key={publicacion.id}>                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>

                                            <Box sx={{

                                                p: 2,                        <Tab icon={<InfoIcon />} label="Información Básica" />                        <Tab icon={<InfoIcon />} label="Información Básica" />

                                                border: 1,

                                                borderColor: 'divider',                        <Tab icon={<BuildIcon />} label="Datos Técnicos" />                        <Tab icon={<BuildIcon />} label="Datos Técnicos" />

                                                borderRadius: 2,

                                                bgcolor: publicacion.activo ? 'background.paper' : 'action.hover'                        <Tab icon={<AttachMoneyIcon />} label="Info. Comercial" />                        <Tab icon={<AttachMoneyIcon />} label="Info. Comercial" />

                                            }}>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>                        <Tab icon={<PublishIcon />} label="Publicaciones" />                        <Tab icon={<PublishIcon />} label="Publicaciones" />

                                                    <Box sx={{ flexGrow: 1 }}>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>                    </Tabs>                    </Tabs>

                                                            <Chip

                                                                label={publicacion.plataforma}                </Box>                </Box>

                                                                color={publicacion.plataforma === 'mercadolibre' ? 'warning' :

                                                                    publicacion.plataforma === 'facebook' ? 'primary' : 'default'}

                                                                size="small"

                                                            />                <form onSubmit={handleSubmit(onSubmit)}>                <form onSubmit={handleSubmit(onSubmit)}>

                                                            <Chip

                                                                label={publicacion.activo ? 'Activo' : 'Inactivo'}                    {/* Tab: Información Básica */}                    {/* Tab: Información Básica */}

                                                                color={publicacion.activo ? 'success' : 'error'}

                                                                size="small"                    <TabPanel value={activeTab} index={0}>                    <TabPanel value={activeTab} index={0}>

                                                            />

                                                        </Box>                        <Card>                        <Card>

                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>

                                                            {publicacion.titulo || 'Sin título'}                            <CardContent>                            <CardContent>

                                                        </Typography>

                                                        {publicacion.id_publicacion && (                                <Typography variant="h6" gutterBottom>                                <Typography variant="h6" gutterBottom>

                                                            <Typography variant="body2" color="text.secondary">

                                                                ID Externa: {publicacion.id_publicacion}                                    Información del Vehículo                                    Información del Vehículo

                                                            </Typography>

                                                        )}                                </Typography>                                </Typography>

                                                        {publicacion.url_publicacion && (

                                                            <Typography variant="body2" color="text.secondary">                                <Grid container spacing={3}>                                <Grid container spacing={3}>

                                                                URL: {publicacion.url_publicacion}

                                                            </Typography>                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

                                                        )}

                                                        {publicacion.ficha_breve && (                                        <Controller                                        <Controller

                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>

                                                                {publicacion.ficha_breve.length > 150                                            name="vehiculo_ano"                                            name="vehiculo_ano"

                                                                    ? `${publicacion.ficha_breve.substring(0, 150)}...`

                                                                    : publicacion.ficha_breve}                                            control={control}                                            control={control}

                                                            </Typography>

                                                        )}                                            render={({ field }) => (                                            render={({ field }) => (

                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>                                                <TextField                                                <TextField

                                                        <IconButton

                                                            size="small"                                                    {...field}                                                    {...field}

                                                            color="primary"

                                                            onClick={() => editPublicacion(publicacion)}                                                    fullWidth                                                    fullWidth

                                                        >

                                                            <EditIcon />                                                    label="Año del Vehículo"                                                    label="Año del Vehículo"

                                                        </IconButton>

                                                        <IconButton                                                    type="number"                                                    type="number"

                                                            size="small"

                                                            color="error"                                                    inputProps={{ min: 1950, max: new Date().getFullYear() + 1 }}                                                    inputProps={{ min: 1950, max: new Date().getFullYear() + 1 }}

                                                            onClick={() => deletePublicacion(publicacion.id)}

                                                        >                                                    error={!!errors.vehiculo_ano}                                                    error={!!errors.vehiculo_ano}

                                                            <DeleteIcon />

                                                        </IconButton>                                                    helperText={errors.vehiculo_ano?.message}                                                    helperText={errors.vehiculo_ano?.message}

                                                    </Box>

                                                </Box>                                                />                                                />

                                            </Box>

                                        </Grid>                                            )}                                            )}

                                    ))}

                                </Grid>                                        />                                        />

                            ) : (

                                <Box sx={{                                    </Grid>                                    </Grid>

                                    p: 3,

                                    textAlign: 'center',

                                    border: '2px dashed',

                                    borderColor: 'divider',                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

                                    borderRadius: 2,

                                    color: 'text.secondary'                                        <Controller                                        <Controller

                                }}>

                                    <PublishIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />                                            name="patente"                                            name="patente"

                                    <Typography variant="body1">

                                        No hay publicaciones registradas                                            control={control}                                            control={control}

                                    </Typography>

                                    <Typography variant="body2">                                            render={({ field }) => (                                            render={({ field }) => (

                                        Haz clic en "Agregar Publicación" para comenzar

                                    </Typography>                                                <TextField                                                <TextField

                                </Box>

                            )}                                                    {...field}                                                    {...field}



                            {/* Modal de edición de publicación */}                                                    fullWidth                                                    fullWidth

                            {showPublicacionForm && editingPublicacion && (

                                <PublicacionForm                                                    label="Patente"                                                    label="Patente"

                                    publicacion={editingPublicacion}

                                    onSave={savePublicacion}                                                    placeholder="ABC123"                                                    placeholder="ABC123"

                                    onCancel={() => {

                                        setShowPublicacionForm(false);                                                    error={!!errors.patente}                                                    error={!!errors.patente}

                                        setEditingPublicacion(null);

                                    }}                                                    helperText={errors.patente?.message}                                                    helperText={errors.patente?.message}

                                />

                            )}                                                />                                                />

                        </Box>

                    )}                                            )}                                            )}

                </Box>

            </DialogContent>                                        />                                        />



            <Divider />                                    </Grid>                                    </Grid>



            <DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50' }}>

                <Button

                    onClick={onClose}                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

                    variant="outlined"

                    sx={{ minWidth: 120 }}                                        <Controller                                        <Controller

                >

                    Cancelar                                            name="modelo_id"                                            name="modelo_id"

                </Button>

                <Button                                            control={control}                                            control={control}

                    onClick={handleSubmit}

                    variant="contained"                                            render={({ field }) => (                                            render={({ field }) => (

                    startIcon={<SaveIcon />}

                    sx={{ minWidth: 120 }}                                                <TextField                                                <TextField

                >

                    {vehicle ? "Actualizar" : "Crear"} Vehículo                                                    {...field}                                                    {...field}

                </Button>

            </DialogActions>                                                    fullWidth                                                    fullWidth

        </Dialog>

    );                                                    label="Modelo ID"                                                    label="Modelo ID"

};

                                                    helperText={errors.modelo_id?.message || "ID del modelo del vehículo"}                                                    helperText={errors.modelo_id?.message || "ID del modelo del vehículo"}

// Componente para formulario de publicación

const PublicacionForm = ({ publicacion, onSave, onCancel }) => {                                                    error={!!errors.modelo_id}                                                    error={!!errors.modelo_id}

    const [formData, setFormData] = useState({

        plataforma: publicacion.plataforma || 'mercadolibre',                                                />                                                />

        url_publicacion: publicacion.url_publicacion || '',

        id_publicacion: publicacion.id_publicacion || '',                                            )}                                            )}

        ficha_breve: publicacion.ficha_breve || '',

        activo: publicacion.activo !== undefined ? publicacion.activo : true,                                        />                                        />

        titulo: publicacion.titulo || ''

    });                                    </Grid>                                    </Grid>



    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData(prev => ({                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

            ...prev,

            [name]: type === 'checkbox' ? checked : value                                        <Controller                                        <Controller

        }));

    };                                            name="estado_codigo"                                            name="estado_codigo"



    const handleSubmit = (e) => {                                            control={control}                                            control={control}

        e.preventDefault();

        onSave(formData);                                            render={({ field }) => (                                            render={({ field }) => (

    };

                                                <FormControl fullWidth error={!!errors.estado_codigo}>                                                <FormControl fullWidth error={!!errors.estado_codigo}>

    return (

        <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>                                                    <InputLabel>Estado</InputLabel>                                                    <InputLabel>Estado</InputLabel>

            <DialogTitle>

                <Typography variant="h6">                                                    <Select {...field} label="Estado">                                                    <Select {...field} label="Estado">

                    {publicacion.id && !publicacion.id.toString().startsWith('temp_') ? 'Editar Publicación' : 'Nueva Publicación'}

                </Typography>                                                        {estados.map(estado => (                                                        {estados.map(estado => (

            </DialogTitle>

            <form onSubmit={handleSubmit}>                                                            <MenuItem key={estado.codigo} value={estado.codigo}>                                                            <MenuItem key={estado.codigo} value={estado.codigo}>

                <DialogContent>

                    <Grid container spacing={3} sx={{ mt: 1 }}>                                                                {estado.nombre}                                                                {estado.nombre}

                        <Grid item xs={12} sm={6}>

                            <FormControl fullWidth>                                                            </MenuItem>                                                            </MenuItem>

                                <InputLabel>Plataforma</InputLabel>

                                <Select                                                        ))}                                                        ))}

                                    name="plataforma"

                                    value={formData.plataforma}                                                    </Select>                                                    </Select>

                                    label="Plataforma"

                                    onChange={handleChange}                                                </FormControl>                                                </FormControl>

                                    required

                                >                                            )}                                            )}

                                    <MenuItem value="mercadolibre">Mercado Libre</MenuItem>

                                    <MenuItem value="facebook">Facebook</MenuItem>                                        />                                        />

                                    <MenuItem value="web">Web</MenuItem>

                                </Select>                                    </Grid>                                    </Grid>

                            </FormControl>

                        </Grid>



                        <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>

                                <FormControlLabel                                        <Controller                                        <Controller

                                    control={

                                        <Switch                                            name="kilometros"                                            name="kilometros"

                                            name="activo"

                                            checked={formData.activo}                                            control={control}                                            control={control}

                                            onChange={handleChange}

                                            color="success"                                            render={({ field }) => (                                            render={({ field }) => (

                                        />

                                    }                                                <TextField                                                <TextField

                                    label="Activo"

                                />                                                    {...field}                                                    {...field}

                            </Box>

                        </Grid>                                                    fullWidth                                                    fullWidth



                        <Grid item xs={12}>                                                    label="Kilometraje"                                                    label="Kilometraje"

                            <TextField

                                fullWidth                                                    type="number"                                                    type="number"

                                label="Título de la Publicación"

                                name="titulo"                                                    inputProps={{ min: 0 }}                                                    inputProps={{ min: 0 }}

                                value={formData.titulo}

                                onChange={handleChange}                                                    InputProps={{                                                    InputProps={{

                                required

                                placeholder="ej: Ford Focus 1.6 Titanium 2020 - Impecable estado"                                                        endAdornment: <InputAdornment position="end">km</InputAdornment>                                                        endAdornment: <InputAdornment position="end">km</InputAdornment>

                            />

                        </Grid>                                                    }}                                                    }}



                        <Grid item xs={12} sm={6}>                                                    error={!!errors.kilometros}                                                    error={!!errors.kilometros}

                            <TextField

                                fullWidth                                                    helperText={errors.kilometros?.message}                                                    helperText={errors.kilometros?.message}

                                label="URL de la Publicación"

                                name="url_publicacion"                                                />                                                />

                                type="url"

                                value={formData.url_publicacion}                                            )}                                            )}

                                onChange={handleChange}

                                placeholder="https://ejemplo.com/publicacion"                                        />                                        />

                            />

                        </Grid>                                    </Grid>                                    </Grid>



                        <Grid item xs={12} sm={6}>

                            <TextField

                                fullWidth                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

                                label="ID Publicación Externa"

                                name="id_publicacion"                                        <Controller                                        <Controller

                                value={formData.id_publicacion}

                                onChange={handleChange}                                            name="tipo_operacion"                                            name="tipo_operacion"

                                placeholder="ej: MLA123456789"

                            />                                            control={control}                                            control={control}

                        </Grid>

                                            render={({ field }) => (                                            render={({ field }) => (

                        <Grid item xs={12}>

                            <TextField                                                <TextField                                                <TextField

                                fullWidth

                                label="Descripción (Ficha Breve)"                                                    {...field}                                                    {...field}

                                name="ficha_breve"

                                multiline                                                    fullWidth                                                    fullWidth

                                rows={4}

                                value={formData.ficha_breve}                                                    label="Tipo de operación"                                                    label="Tipo de operación"

                                onChange={handleChange}

                                placeholder="Descripción detallada del vehículo para la publicación..."                                                    placeholder="Compra, Venta, Consignación, etc."                                                    placeholder="Compra, Venta, Consignación, etc."

                            />

                        </Grid>                                                />                                                />

                    </Grid>

                </DialogContent>                                            )}                                            )}

                <DialogActions sx={{ p: 3, gap: 2 }}>

                    <Button onClick={onCancel} variant="outlined">                                        />                                        />

                        Cancelar

                    </Button>                                    </Grid>                                    </Grid>

                    <Button type="submit" variant="contained" startIcon={<SaveIcon />}>

                        Guardar Publicación

                    </Button>

                </DialogActions>                                    <Grid item xs={12} sm={6}>                                    <Grid item xs={12} sm={6}>

            </form>

        </Dialog>                                        <Controller                                        <Controller

    );

};                                            name="fecha_ingreso"                                            name="fecha_ingreso"



export default VehicleModalEnhanced;                                            control={control}                                            control={control}

                                            render={({ field }) => (                                            render={({ field }) => (

                                                <TextField                                                <TextField

                                                    {...field}                                                    {...field}

                                                    fullWidth                                                    fullWidth

                                                    label="Fecha de ingreso"                                                    label="Fecha de ingreso"

                                                    type="date"                                                    type="date"

                                                    InputLabelProps={{ shrink: true }}                                                    InputLabelProps={{ shrink: true }}

                                                />                                                />

                                            )}                                            )}

                                        />                                        />

                                    </Grid>                                    </Grid>



                                    <Grid item xs={12}>                                    <Grid item xs={12}>

                                        <Controller                                        <Controller

                                            name="observaciones"                                            name="observaciones"

                                            control={control}                                            control={control}

                                            render={({ field }) => (                                            render={({ field }) => (

                                                <TextField                                                <TextField

                                                    {...field}                                                    {...field}

                                                    fullWidth                                                    fullWidth

                                                    label="Observaciones"                                                    label="Observaciones"

                                                    multiline                                                    multiline

                                                    rows={4}                                                    rows={4}

                                                    placeholder="Comentarios adicionales sobre el vehículo..."                                                    placeholder="Comentarios adicionales sobre el vehículo..."

                                                />                                                />

                                            )}                                            )}

                                        />                                        />

                                    </Grid>                                    </Grid>

                                </Grid>                                </Grid >

                            </CardContent >                            </CardContent >

                        </Card >                        </Card >

                    </TabPanel >                    </TabPanel >



        {/* Tab: Información Técnica */ }                    {/* Tab: Información Técnica */ }

        < TabPanel value = { activeTab } index = { 1} > <TabPanel value={activeTab} index={1}>

            <Card>                        <Card>

                <CardContent>                            <CardContent>

                    <Typography variant="h6" gutterBottom>                                <Typography variant="h6" gutterBottom>

                        Especificaciones Técnicas                                    Especificaciones Técnicas

                    </Typography>                                </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>                                <Alert severity="info" sx={{ mb: 3 }}>

                        Los datos técnicos se obtienen automáticamente del modelo seleccionado                                    Los datos técnicos se obtienen automáticamente del modelo seleccionado

                    </Alert>                                </Alert>



                    <Grid container spacing={3}>                                <Grid container spacing={3}>

                        {Object.entries({                                    {
                            Object.entries({

                                'Marca': vehicleInfo.marca, 'Marca': vehicleInfo.marca,

                                'Modelo': vehicleInfo.modelo, 'Modelo': vehicleInfo.modelo,

                                'Versión': vehicleInfo.version, 'Versión': vehicleInfo.version,

                                'Combustible': vehicleInfo.combustible, 'Combustible': vehicleInfo.combustible,

                                'Caja': vehicleInfo.caja, 'Caja': vehicleInfo.caja,

                                'Motorización': vehicleInfo.motorizacion, 'Motorización': vehicleInfo.motorizacion,

                                'Tracción': vehicleInfo.traccion, 'Tracción': vehicleInfo.traccion,

                                'Puertas': vehicleInfo.puertas, 'Puertas': vehicleInfo.puertas,

                                'Segmento': vehicleInfo.segmento_modelo, 'Segmento': vehicleInfo.segmento_modelo,

                                'Cilindrada': vehicleInfo.cilindrada ? `${vehicleInfo.cilindrada} cc` : '', 'Cilindrada': vehicleInfo.cilindrada ? `${vehicleInfo.cilindrada} cc` : '',

                                'Potencia': vehicleInfo.potencia_hp ? `${vehicleInfo.potencia_hp} HP` : '', 'Potencia': vehicleInfo.potencia_hp ? `${vehicleInfo.potencia_hp} HP` : '',

                                'Torque': vehicleInfo.torque_nm ? `${vehicleInfo.torque_nm} Nm` : ''                                        'Torque': vehicleInfo.torque_nm ? `${vehicleInfo.torque_nm} Nm` : ''

                            }).map(([label, value], index) => (                                    }).map(([label, value], index) => (

                                <Grid item xs={12} sm={6} md={4} key={index}>                                        <Grid item xs={12} sm={6} md={4} key={index}>

                                    <Box sx={{                                             < Box sx={{

                                        p: 2, p: 2,

                                        border: 1, border: 1,

                                        borderColor: 'grey.300', borderColor: 'grey.300',

                                        borderRadius: 1, borderRadius: 1,

                                        bgcolor: 'grey.50'                                                bgcolor: 'grey.50'

                                    }}>                                            }}>

                                        <Typography variant="caption" color="text.secondary">                                                <Typography variant="caption" color="text.secondary">

                                            {label}                                                    {label}

                                        </Typography>                                                </Typography>

                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>

                                            {value || 'No disponible'}                                                    {value || 'No disponible'}

                                        </Typography>                                                </Typography>

                                    </Box>                                            </Box>

                                </Grid>                                        </Grid>

                                    ))}                                    ))}

                    </Grid>                                </Grid>

                </CardContent>                            </CardContent>

            </Card>                        </Card>

                    </TabPanel >                    </TabPanel >



        {/* Tab: Información Comercial */ }                    {/* Tab: Información Comercial */ }

        < TabPanel value = { activeTab } index = { 2} > <TabPanel value={activeTab} index={2}>

            <Card>                        <Card>

                <CardContent>                            <CardContent>

                    <Typography variant="h6" gutterBottom>                                <Typography variant="h6" gutterBottom>

                        Información Comercial                                    Información Comercial

                    </Typography>                                </Typography>

                    <Grid container spacing={3}>                                <Grid container spacing={3}>

                        <Grid item xs={12} sm={8}>                                    <Grid item xs={12} sm={8}>

                            <Controller                                        <Controller

                                name="valor" name="valor"

                                control={control} control={control}

                                render={({ field }) => (render = {({ field }) => (

                            <TextField                                                <TextField

                                {...field}                                                    {...field}

                                fullWidth fullWidth

                                label="Precio" label="Precio"

                                type="number" type="number"

                                inputProps={{ min: 0, step: 0.01 }} inputProps={{ min: 0, step: 0.01 }}

                                InputProps={{ InputProps={{

                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>

                                                    }}                                                    }}

                            error={!!errors.valor}                                                    error={!!errors.valor}

                            helperText={errors.valor?.message}                                                    helperText={errors.valor?.message}

                                                />                                                />

                                            )}                                            )}

                                        />                                        />

                        </Grid>                                    </Grid>



                        <Grid item xs={12} sm={4}>                                    <Grid item xs={12} sm={4}>

                            <Controller                                        <Controller

                                name="moneda" name="moneda"

                                control={control} control={control}

                                render={({ field }) => (render = {({ field }) => (

                            <FormControl fullWidth>                                                <FormControl fullWidth>

                                <InputLabel>Moneda</InputLabel>                                                    <InputLabel>Moneda</InputLabel>

                                <Select {...field} label="Moneda">                                                    <Select {...field} label="Moneda">

                                    {monedasOptions.map(moneda => ({
                                        monedasOptions.map(moneda => (

                                            <MenuItem key={moneda.value} value={moneda.value}>                                                            <MenuItem key={moneda.value} value={moneda.value}>

                                                {moneda.label}                                                                {moneda.label}

                                            </MenuItem>                                                            </MenuItem>

                                        ))
                                    }))}

                                </Select>                                                    </Select>

                            </FormControl>                                                </FormControl>

                                            )}                                            )}

                                        />                                        />

                        </Grid>                                    </Grid>



                        <Grid item xs={12}>                                    <Grid item xs={12}>

                            <Card sx={{ mt: 2 }}>                                        <Card sx={{ mt: 2 }}>

                                <CardContent>                                            <CardContent>

                                    <Typography variant="h6" gutterBottom>                                                <Typography variant="h6" gutterBottom>

                                        Resumen Comercial                                                    Resumen Comercial

                                    </Typography>                                                </Typography>

                                    <Box display="flex" flexWrap="wrap" gap={1}>                                                <Box display="flex" flexWrap="wrap" gap={1}>

                                        <Chip                                                     <Chip

                                            label={`Año: ${defaultValues.vehiculo_ano}`} label={`Año: ${defaultValues.vehiculo_ano}`}

                                            color="primary" color="primary"

                                            variant="outlined" variant="outlined"

                                        />                                                    />

                                        <Chip                                                     <Chip

                                            label={`${defaultValues.kilometros.toLocaleString()} km`} label={`${defaultValues.kilometros.toLocaleString()} km`}

                                            color="secondary" color="secondary"

                                            variant="outlined" variant="outlined"

                                        />                                                    />

                                        {defaultValues.valor && ({
                                            defaultValues.valor && (

                                                        <Chip                                                         <Chip 

                                                            label={`${defaultValues.moneda} ${parseFloat(defaultValues.valor).toLocaleString()}`}                                                             label={`${defaultValues.moneda} ${parseFloat(defaultValues.valor).toLocaleString()}`} 

                                                            color="success"                                                             color="success" 

                                                            variant="outlined"                                                             variant="outlined" 

                                                        /> />

                                                    )
                                        })}

                                        {defaultValues.estado_codigo && ({
                                            defaultValues.estado_codigo && (

                                                        <Chip                                                         <Chip 

                                                            label={estados.find(e => e.codigo === defaultValues.estado_codigo)?.nombre || defaultValues.estado_codigo}                                                            label={estados.find(e => e.codigo === defaultValues.estado_codigo)?.nombre || defaultValues.estado_codigo}

                                                            color="info"                                                             color="info" 

                                                            variant="outlined"                                                             variant="outlined" 

                                                        /> />

                                                    )
                                        })}

                                    </Box>                                                </Box>

                                </CardContent>                                            </CardContent>

                            </Card>                                        </Card>

                        </Grid>                                    </Grid>

                    </Grid>                                </Grid>

                </CardContent>                            </CardContent>

            </Card>                        </Card>

        </TabPanel>                    </TabPanel >



        {/* Tab: Publicaciones */ }                    {/* Tab: Publicaciones */ }

        < TabPanel value = { activeTab } index = { 3} > <TabPanel value={activeTab} index={3}>

            <Card>                        <Card>

                <CardContent>                            <CardContent>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

                        <Typography variant="h6">                                    <Typography variant="h6">

                            Publicaciones                                        Publicaciones

                        </Typography>                                    </Typography>

                        <Button                                    <Button

                            startIcon={<AddIcon />} startIcon={<AddIcon />}

                            variant="contained" variant="contained"

                            size="small" size="small"

                            onClick={addPublicacion} onClick={addPublicacion}

                        >                                    >

                            Nueva                                        Nueva

                        </Button>                                    </Button>

                    </Box>                                </Box>



                    {publicaciones.length === 0 ? ({
                        publicaciones.length === 0 ? (

                            <Box sx={{ textAlign: 'center', py: 4 }}>                                    <Box sx={{ textAlign: 'center', py: 4 }}>

                                <PublishIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />                                        <PublishIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />

                                <Typography variant="h6" color="text.secondary">                                        <Typography variant="h6" color="text.secondary">

                                    No hay publicaciones                                            No hay publicaciones

                                </Typography>                                        </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>

                                    Agrega publicaciones para promocionar este vehículo                                            Agrega publicaciones para promocionar este vehículo

                                </Typography>                                        </Typography>

                            </Box>                                    </Box>

                        ) : (): (

                            <Grid container spacing = { 2 }>                                    <Grid container spacing = { 2 }>

                                        {publicaciones.map((publicacion) => ({
                                publicaciones.map((publicacion) => (

                                    <Grid item xs={12} key={publicacion.id}>                                            <Grid item xs={12} key={publicacion.id}>

                                        <Card>                                                <Card>

                                            <CardContent>                                                    <CardContent>

                                                <Box display="flex" justifyContent="space-between" alignItems="start">                                                        <Box display="flex" justifyContent="space-between" alignItems="start">

                                                    <Box>                                                            <Box>

                                                        <Typography variant="h6" gutterBottom>                                                                <Typography variant="h6" gutterBottom>

                                                            {publicacion.titulo || 'Sin título'}                                                                    {publicacion.titulo || 'Sin título'}

                                                        </Typography>                                                                </Typography>

                                                        <Typography variant="body2" color="text.secondary">                                                                <Typography variant="body2" color="text.secondary">

                                                            Plataforma: {publicacion.plataforma}                                                                    Plataforma: {publicacion.plataforma}

                                                        </Typography>                                                                </Typography>

                                                        {publicacion.url_publicacion && ({
                                                            publicacion.url_publicacion && (

                                                                <Typography variant="body2" color="primary">                                                                    <Typography variant="body2" color="primary">

                                                                    {publicacion.url_publicacion}                                                                        {publicacion.url_publicacion}

                                                                </Typography>                                                                    </Typography>

                                                            )
                                                        })}

                                                    </Box>                                                            </Box>

                                                    <Box display="flex" alignItems="center" gap={1}>                                                            <Box display="flex" alignItems="center" gap={1}>

                                                        <FormControlLabel                                                                <FormControlLabel

                                                            control={control = {

                                                                        < Switch < Switch

                                                                            checked={publicacion.activo} checked={publicacion.activo}

                                                            size="small" size="small"

                                                        />                                                                        />

                                                                    }                                                                    }

                                                        label="Activa"                                                                    label="Activa"

                                                                />                                                                />

                                                        <IconButton                                                                <IconButton

                                                            size="small" size="small"

                                                            onClick={() => deletePublicacion(publicacion.id)} onClick={() => deletePublicacion(publicacion.id)}

                                                            color="error" color="error"

                                                        >                                                                >

                                                            <DeleteIcon />                                                                    <DeleteIcon />

                                                        </IconButton>                                                                </IconButton>

                                                    </Box>                                                            </Box>

                                                </Box>                                                        </Box>

                                            </CardContent>                                                    </CardContent>

                                        </Card>                                                </Card>

                                    </Grid>                                            </Grid>

                                        ))}                                        ))}

            </Grid>                                    </Grid>

                                )}                                )}

        </CardContent>                            </CardContent >

                        </Card >                        </Card >

                    </TabPanel >                    </TabPanel >



        {/* Acciones del formulario */ }                    {/* Acciones del formulario */ }

        < Divider />                    <Divider />

                    <DialogActions sx={{ px: 3, py: 2 }}>                    <DialogActions sx={{ px: 3, py: 2 }}>

                        <Button onClick={onClose} color="inherit">                        <Button onClick={onClose} color="inherit">

                            Cancelar                            Cancelar

                        </Button>                        </Button>

                        <Button                         <Button 

                            type="submit"                             type="submit" 

                            variant="contained"                            variant="contained"

                            disabled={loading}                            disabled={loading}

                            startIcon={<SaveIcon />}                            startIcon={<SaveIcon />}

                        >                        >

                            {loading ? 'Guardando...' : (vehicle ? 'Actualizar' : 'Crear')}                            {loading ? 'Guardando...' : (vehicle ? 'Actualizar' : 'Crear')}

                        </Button>                        </Button>

                    </DialogActions>                    </DialogActions >

                </form >                </form >

            </DialogContent >            </DialogContent >

        </Dialog >        </Dialog >

    );    );

    };
};



export default VehicleModalEnhanced; export default VehicleModalEnhanced;