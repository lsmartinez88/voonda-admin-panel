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
    Chip,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Autocomplete,
    Alert,
    CircularProgress,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    estadosService,
    publicacionesService,
    vendedoresService,
    compradoresService,
    imagenesService
} from '@/services/api';

const VehicleModalClean = ({ vehicle, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        modelo_id: "",
        vehiculo_ano: new Date().getFullYear(),
        patente: "",
        kilometros: 0,
        valor: "",
        moneda: "ARS",
        estado_codigo: "salon",
        observaciones: "",
        comentarios: "",
        pendientes_preparacion: [],
        vendedor_id: "",
        comprador_id: ""
    });

    const [loading, setLoading] = useState(true);
    const [estadosDisponibles, setEstadosDisponibles] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const estadosResponse = await estadosService.getEstados();
                if (estadosResponse.success) {
                    setEstadosDisponibles(estadosResponse.estados);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (loading) {
        return (
            <Dialog open={true} maxWidth="sm">
                <DialogContent sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {vehicle ? 'Editar' : 'Nuevo'} Vehículo
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Año"
                                type="number"
                                value={formData.vehiculo_ano}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    vehiculo_ano: e.target.value
                                }))}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={formData.estado_codigo}
                                    label="Estado"
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        estado_codigo: e.target.value
                                    }))}
                                >
                                    {estadosDisponibles.map((estado) => (
                                        <MenuItem key={estado.id} value={estado.codigo}>
                                            {estado.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observaciones"
                                multiline
                                rows={3}
                                value={formData.observaciones}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    observaciones: e.target.value
                                }))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default VehicleModalClean;