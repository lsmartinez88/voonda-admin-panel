import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Alert,
    AlertTitle,
    FormControlLabel,
    Checkbox,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import GoogleSheetsWriterService from '../../services/googleSheetsWriterService';
import GoogleMapsService from '../../services/googleMapsService';

const HorariosAtencionPage = () => {
    // Estados
    const [scriptUrl, setScriptUrl] = useState(import.meta.env.VITE_HORARIOS_SCRIPT_URL || '');
    const [googleMapsLink, setGoogleMapsLink] = useState(import.meta.env.VITE_GOOGLE_MAPS_LINK || '');
    const [horarios, setHorarios] = useState([]);
    const [googleMapsHorarios, setGoogleMapsHorarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    // Filtros
    const [showSaturdays, setShowSaturdays] = useState(false); // Ocultar sábados por defecto
    const [showSundays, setShowSundays] = useState(false); // Ocultar domingos por defecto
    const [showPastDates, setShowPastDates] = useState(false); // Ocultar fechas pasadas por defecto

    // Dialog de agregar/editar
    const [openDialog, setOpenDialog] = useState(false);
    const [editingHorario, setEditingHorario] = useState(null);
    const [formData, setFormData] = useState({
        fecha: '',
        horario: '',
        motivo: ''
    });

    // Cargar horarios al inicio
    useEffect(() => {
        if (scriptUrl) {
            loadHorarios();
        }
    }, [scriptUrl]);

    // Cargar horarios de Google Maps
    useEffect(() => {
        if (googleMapsLink) {
            loadGoogleMapsHorarios();
        }
    }, [googleMapsLink]);

    const showSuccess = (msg) => {
        setMessage(msg);
        setMessageType('success');
        setTimeout(() => setMessage(''), 5000);
    };

    const showError = (msg) => {
        setMessage(msg);
        setMessageType('error');
        setTimeout(() => setMessage(''), 5000);
    };

    const showInfo = (msg) => {
        setMessage(msg);
        setMessageType('info');
    };

    // Cargar horarios desde Google Sheets
    const loadHorarios = async () => {
        setLoading(true);
        showInfo('📥 Cargando horarios desde Google Sheets...');

        try {
            const result = await GoogleSheetsWriterService.readHorarios();

            if (result.success) {
                setHorarios(result.data);
                showSuccess(`✅ ${result.data.length} horarios cargados correctamente`);
            } else {
                showError(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            showError(`❌ Error inesperado: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Cargar horarios desde Google Maps
    const loadGoogleMapsHorarios = async () => {
        try {
            const placeId = GoogleMapsService.extractPlaceId(googleMapsLink);

            if (!placeId) {
                // Si no se puede extraer el Place ID, usar datos de ejemplo
                console.warn('No se pudo extraer Place ID, usando datos de ejemplo');
                setGoogleMapsHorarios([
                    { day: 'lunes', hours: '09:00–18:00', isClosed: false },
                    { day: 'martes', hours: '09:00–18:00', isClosed: false },
                    { day: 'miércoles', hours: '09:00–18:00', isClosed: false },
                    { day: 'jueves', hours: '09:00–18:00', isClosed: false },
                    { day: 'viernes', hours: '09:00–18:00', isClosed: false },
                    { day: 'sábado', hours: '09:00–13:00', isClosed: false },
                    { day: 'domingo', hours: 'Cerrado', isClosed: true }
                ]);
                return;
            }

            // Intentar cargar desde Google Maps API
            const result = await GoogleMapsService.getPlaceDetails(placeId);

            if (result.success && result.data.opening_hours) {
                const weekdayText = result.data.opening_hours.weekday_text || [];
                const parsed = weekdayText.map(text => {
                    const [dayName, hours] = text.split(': ');
                    const dayMap = {
                        'Monday': 'lunes',
                        'Tuesday': 'martes',
                        'Wednesday': 'miércoles',
                        'Thursday': 'jueves',
                        'Friday': 'viernes',
                        'Saturday': 'sábado',
                        'Sunday': 'domingo'
                    };

                    const isClosed = hours.toLowerCase().includes('closed') || hours.toLowerCase().includes('cerrado');

                    return {
                        day: dayMap[dayName] || dayName.toLowerCase(),
                        hours: hours,
                        isClosed: isClosed
                    };
                });

                setGoogleMapsHorarios(parsed);
                showInfo('✅ Horarios de Google Maps cargados correctamente');
            } else {
                // Fallback a datos de ejemplo
                console.warn('Google Maps API no devolvió horarios, usando datos de ejemplo');
                setGoogleMapsHorarios([
                    { day: 'lunes', hours: '09:00–18:00', isClosed: false },
                    { day: 'martes', hours: '09:00–18:00', isClosed: false },
                    { day: 'miércoles', hours: '09:00–18:00', isClosed: false },
                    { day: 'jueves', hours: '09:00–18:00', isClosed: false },
                    { day: 'viernes', hours: '09:00–18:00', isClosed: false },
                    { day: 'sábado', hours: '09:00–13:00', isClosed: false },
                    { day: 'domingo', hours: 'Cerrado', isClosed: true }
                ]);
            }
        } catch (error) {
            console.error('Error cargando horarios de Google Maps:', error);
            // Fallback a datos de ejemplo en caso de error
            setGoogleMapsHorarios([
                { day: 'lunes', hours: '09:00–18:00', isClosed: false },
                { day: 'martes', hours: '09:00–18:00', isClosed: false },
                { day: 'miércoles', hours: '09:00–18:00', isClosed: false },
                { day: 'jueves', hours: '09:00–18:00', isClosed: false },
                { day: 'viernes', hours: '09:00–18:00', isClosed: false },
                { day: 'sábado', hours: '09:00–13:00', isClosed: false },
                { day: 'domingo', hours: 'Cerrado', isClosed: true }
            ]);
        }
    };

    // Validar formato de fecha DD/MM/YYYY
    const isValidDate = (dateString) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(dateString)) return false;

        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        return date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;
    };

    // Detectar día de la semana de una fecha
    const getDayOfWeek = (dateString) => {
        const [day, month, year] = dateString.split('/');
        const date = new Date(year, month - 1, day);
        const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        return days[date.getDay()];
    };

    // Convertir fecha DD/MM/YYYY a objeto Date para ordenar
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    // Verificar si una fecha es pasada (anterior a hoy)
    const isPastDate = (dateString) => {
        const date = parseDate(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // Verificar si una fecha está en la próxima semana (7 días desde hoy)
    const isNextWeek = (dateString) => {
        const date = parseDate(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return date >= today && date <= nextWeek;
    };

    // Normalizar horario para comparación
    const normalizeHorario = (horario) => {
        const lower = horario.toLowerCase().trim();

        // Detectar cerrado
        if (lower.includes('cerrado') || lower.includes('closed')) {
            return 'CERRADO';
        }

        // Extraer horas (formato flexible: 9:00, 09:00, 9, etc.)
        const hoursMatch = lower.match(/(\d{1,2}):?(\d{2})?\s*(?:hs)?\s*(?:a|hasta|-|–)\s*(\d{1,2}):?(\d{2})?/i);
        if (hoursMatch) {
            const startHour = hoursMatch[1].padStart(2, '0');
            const startMin = hoursMatch[2] || '00';
            const endHour = hoursMatch[3].padStart(2, '0');
            const endMin = hoursMatch[4] || '00';
            return `${startHour}:${startMin}–${endHour}:${endMin}`;
        }

        return horario;
    };

    // Filtrar y ordenar horarios
    const filteredHorarios = horarios
        .filter(h => {
            // Filtrar fechas pasadas
            if (!showPastDates && isPastDate(h.fecha)) return false;

            // Filtrar días de la semana
            const dayOfWeek = getDayOfWeek(h.fecha);
            if (!showSaturdays && dayOfWeek === 'sábado') return false;
            if (!showSundays && dayOfWeek === 'domingo') return false;
            return true;
        })
        .sort((a, b) => {
            // Ordenar por fecha (más antiguo primero, para ver próximas fechas arriba)
            const dateA = parseDate(a.fecha);
            const dateB = parseDate(b.fecha);
            return dateA - dateB;
        });

    // Comparar horario con Google Maps (versión mejorada)
    const compareWithGoogleMaps = (horario) => {
        const dayOfWeek = getDayOfWeek(horario.fecha);
        const gmHorario = googleMapsHorarios.find(gm => gm.day === dayOfWeek);

        if (!gmHorario) return { match: null, gmHours: null };

        // Normalizar ambos horarios para comparar
        const normalizedSheet = normalizeHorario(horario.horario);
        const normalizedGM = normalizeHorario(gmHorario.hours);

        // Si ambos son cerrado, coinciden
        if (normalizedSheet === 'CERRADO' && normalizedGM === 'CERRADO') {
            return { match: true, gmHours: gmHorario.hours };
        }

        // Si uno es cerrado y el otro no, no coinciden
        if ((normalizedSheet === 'CERRADO') !== (normalizedGM === 'CERRADO')) {
            return { match: false, gmHours: gmHorario.hours };
        }

        // Comparar horarios normalizados
        if (normalizedSheet === normalizedGM) {
            return { match: true, gmHours: gmHorario.hours };
        }

        // Si los formatos son diferentes pero podrían ser similares
        return { match: false, gmHours: gmHorario.hours };
    };

    // Abrir dialog para agregar
    const handleAdd = () => {
        setEditingHorario(null);
        setFormData({ fecha: '', horario: '', motivo: '' });
        setOpenDialog(true);
    };

    // Abrir dialog para editar
    const handleEdit = (horario) => {
        setEditingHorario(horario);
        setFormData({
            fecha: horario.fecha,
            horario: horario.horario,
            motivo: horario.motivo
        });
        setOpenDialog(true);
    };

    // Guardar (agregar o editar)
    const handleSave = async () => {
        if (!formData.fecha || !formData.horario || !formData.motivo) {
            showError('❌ Todos los campos son obligatorios');
            return;
        }

        // Validar formato de fecha
        if (!isValidDate(formData.fecha)) {
            showError('❌ Formato de fecha inválido. Use DD/MM/YYYY (ej: 25/12/2025)');
            return;
        }

        setLoading(true);
        setOpenDialog(false);

        try {
            let result;
            if (editingHorario) {
                // Editar
                result = await GoogleSheetsWriterService.updateHorario(
                    formData.fecha,
                    formData.horario,
                    formData.motivo
                );
            } else {
                // Agregar
                result = await GoogleSheetsWriterService.addHorario(
                    formData.fecha,
                    formData.horario,
                    formData.motivo
                );
            }

            if (result.success) {
                showSuccess(`✅ ${editingHorario ? 'Actualizado' : 'Agregado'} correctamente`);
                loadHorarios(); // Recargar datos
            } else {
                showError(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            showError(`❌ Error inesperado: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar horario
    const handleDelete = async (fecha) => {
        if (!confirm(`¿Está seguro de eliminar el horario del ${fecha}?`)) {
            return;
        }

        setLoading(true);

        try {
            const result = await GoogleSheetsWriterService.deleteHorario(fecha);

            if (result.success) {
                showSuccess('✅ Eliminado correctamente');
                loadHorarios(); // Recargar datos
            } else {
                showError(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            showError(`❌ Error inesperado: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Mensaje de estado */}
            {message && (
                <Alert severity={messageType} sx={{ mb: 3 }}>
                    <AlertTitle>
                        {messageType === 'success' ? 'Éxito' : messageType === 'error' ? 'Error' : 'Información'}
                    </AlertTitle>
                    {message}
                </Alert>
            )}

            {/* Card única con todo */}
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        📋 Configuración de Horarios de Atención
                    </Typography>

                    {/* Configuración */}
                    <Box sx={{ mb: 3 }}>
                        <Stack spacing={2}>
                            <TextField
                                label="URL Planilla Google Sheets"
                                value={scriptUrl}
                                onChange={(e) => setScriptUrl(e.target.value)}
                                fullWidth
                                size="small"
                                helperText="URL del script deployado en Google Sheets"
                            />

                            <TextField
                                label="Nombre/Place ID Google Maps"
                                value={googleMapsLink}
                                onChange={(e) => setGoogleMapsLink(e.target.value)}
                                fullWidth
                                size="small"
                                helperText="Link del negocio en Google Maps para comparar horarios"
                            />

                            <Button
                                variant="contained"
                                onClick={loadHorarios}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Cargando...' : 'Cargar Datos'}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Filtros y botón agregar */}
                    <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Filtros:
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showSaturdays}
                                        onChange={(e) => setShowSaturdays(e.target.checked)}
                                    />
                                }
                                label="Mostrar Sábados"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showSundays}
                                        onChange={(e) => setShowSundays(e.target.checked)}
                                    />
                                }
                                label="Mostrar Domingos"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showPastDates}
                                        onChange={(e) => setShowPastDates(e.target.checked)}
                                    />
                                }
                                label="Mostrar Fechas Pasadas"
                            />

                            <Box sx={{ flex: 1 }} />

                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAdd}
                                disabled={loading}
                            >
                                Agregar Nuevo Horario
                            </Button>
                        </Stack>
                    </Box>

                    {/* Tabla de horarios */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer sx={{ mt: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Fecha</strong></TableCell>
                                        <TableCell><strong>Horario</strong></TableCell>
                                        <TableCell><strong>Motivo</strong></TableCell>
                                        <TableCell align="right"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredHorarios.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">
                                                    No hay horarios especiales cargados
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredHorarios.map((horario, index) => {
                                            const comparison = compareWithGoogleMaps(horario);
                                            const dayOfWeek = getDayOfWeek(horario.fecha);
                                            const isHighlighted = isNextWeek(horario.fecha);

                                            return (
                                                <React.Fragment key={index}>
                                                    <TableRow sx={{
                                                        bgcolor: isHighlighted ? '#e3f2fd' : 'inherit',
                                                        '&:hover': {
                                                            bgcolor: isHighlighted ? '#bbdefb' : 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography variant="body2">{horario.fecha}</Typography>
                                                                <Chip
                                                                    label={dayOfWeek}
                                                                    size="small"
                                                                    sx={{ mt: 0.5 }}
                                                                    color={
                                                                        dayOfWeek === 'sábado' ? 'warning' :
                                                                            dayOfWeek === 'domingo' ? 'error' :
                                                                                'default'
                                                                    }
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{horario.horario}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{horario.motivo}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEdit(horario)}
                                                                disabled={loading}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(horario.fecha)}
                                                                disabled={loading}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                    {/* Fila de comparación con Google Maps */}
                                                    {comparison.gmHours && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} sx={{
                                                                py: 0.5,
                                                                bgcolor: comparison.match === true ? '#e8f5e9' :
                                                                    comparison.match === false ? '#fff3e0' :
                                                                        '#f5f5f5',
                                                                borderBottom: '2px solid #e0e0e0'
                                                            }}>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    {comparison.match === true && (
                                                                        <>
                                                                            <CheckCircleIcon fontSize="small" color="success" />
                                                                            <Typography variant="caption" color="success.main">
                                                                                ✅ Coincide con Google Maps: {comparison.gmHours}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                    {comparison.match === false && (
                                                                        <>
                                                                            <CancelIcon fontSize="small" color="warning" />
                                                                            <Typography variant="caption" color="warning.main">
                                                                                🟡 GM muestra: {comparison.gmHours}
                                                                            </Typography>
                                                                        </>
                                                                    )}
                                                                    {comparison.match === null && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            ℹ️ GM: {comparison.gmHours}
                                                                        </Typography>
                                                                    )}
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de agregar/editar */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingHorario ? '✏️ Editar Horario' : '➕ Agregar Horario'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Fecha"
                            type="text"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            fullWidth
                            placeholder="DD/MM/YYYY"
                            helperText="Formato: 25/12/2025"
                            disabled={!!editingHorario} // No permitir cambiar fecha al editar
                        />

                        <TextField
                            label="Horario"
                            value={formData.horario}
                            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            fullWidth
                            placeholder="09:00 a 13:00 o cerrado"
                            helperText="Ej: 'de 09:00hs a 13:00hs' o 'cerrado'"
                        />

                        <TextField
                            label="Motivo"
                            value={formData.motivo}
                            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                            fullWidth
                            placeholder="Navidad, Feriado, etc."
                            helperText="Descripción del motivo del horario especial"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HorariosAtencionPage;
