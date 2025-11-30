import React, { useState, useEffect } from 'react';
import {
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
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { VoondaAdminHeader } from "../VoondaAdminHeader";
import GoogleSheetsWriterService from '../../../services/googleSheetsWriterService';
import GoogleMapsService from '../../../services/googleMapsService';

export const HorariosAtencion = () => {
  // Estados
  const [scriptUrl, setScriptUrl] = useState(import.meta.env.VITE_HORARIOS_SCRIPT_URL || '');
  const [googleMapsLink, setGoogleMapsLink] = useState(import.meta.env.VITE_GOOGLE_MAPS_LINK || '');
  const [horarios, setHorarios] = useState([]);
  const [googleMapsHorarios, setGoogleMapsHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  // Filtros
  const [showSaturdays, setShowSaturdays] = useState(false);
  const [showSundays, setShowSundays] = useState(false);
  const [showPastDates, setShowPastDates] = useState(false);

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [formData, setFormData] = useState({
    fecha: '',
    horario: '',
    motivo: ''
  });

  useEffect(() => {
    // Inicializar Google Maps con datos por defecto
    setGoogleMapsHorarios([
      { day: 'lunes', hours: '09:00–18:00', isClosed: false },
      { day: 'martes', hours: '09:00–18:00', isClosed: false },
      { day: 'miércoles', hours: '09:00–18:00', isClosed: false },
      { day: 'jueves', hours: '09:00–18:00', isClosed: false },
      { day: 'viernes', hours: '09:00–18:00', isClosed: false },
      { day: 'sábado', hours: '09:00–13:00', isClosed: false },
      { day: 'domingo', hours: 'Cerrado', isClosed: true }
    ]);
  }, []);

  useEffect(() => {
    if (scriptUrl) {
      loadHorarios();
    }
  }, [scriptUrl]);

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

  // Convertir objeto Date a formato DD/MM/YYYY
  const formatDateToString = (date) => {
    if (typeof date === 'string') {
      // Si ya es string, verificar formato
      if (date.includes('/')) return date;
      // Si es ISO string, convertir
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return String(date);
  };

  const loadHorarios = async () => {
    setLoading(true);
    showInfo('📥 Cargando horarios desde Google Sheets...');

    try {
      const result = await GoogleSheetsWriterService.readHorarios();

      if (result.success) {
        // Normalizar fechas que vienen como Date objects
        const normalizedData = result.data.map(h => ({
          ...h,
          fecha: formatDateToString(h.fecha),
          horario: String(h.horario || ''),
          motivo: String(h.motivo || '')
        }));
        setHorarios(normalizedData);
        showSuccess(`✅ ${normalizedData.length} horarios cargados correctamente`);
      } else {
        showError(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      showError(`❌ Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleMapsHorarios = async () => {
    try {
      const placeId = GoogleMapsService.extractPlaceId(googleMapsLink);

      if (!placeId) {
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

  const isValidDate = (dateString) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;
  };

  const getDayOfWeek = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[date.getDay()];
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const isPastDate = (dateString) => {
    const date = parseDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isNextWeek = (dateString) => {
    const date = parseDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return date >= today && date <= nextWeek;
  };

  const normalizeHorario = (horario) => {
    const lower = horario.toLowerCase().trim();

    if (lower.includes('cerrado') || lower.includes('closed')) {
      return 'CERRADO';
    }

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

  const filteredHorarios = horarios
    .filter(h => {
      if (!showPastDates && isPastDate(h.fecha)) return false;

      const dayOfWeek = getDayOfWeek(h.fecha);
      if (!showSaturdays && dayOfWeek === 'sábado') return false;
      if (!showSundays && dayOfWeek === 'domingo') return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.fecha);
      const dateB = parseDate(b.fecha);
      return dateA - dateB;
    });

  const compareWithGoogleMaps = (horario) => {
    const dayOfWeek = getDayOfWeek(horario.fecha);
    const gmHorario = googleMapsHorarios.find(gm => gm.day === dayOfWeek);

    if (!gmHorario) return { match: null, gmHours: null };

    const normalizedSheet = normalizeHorario(horario.horario);
    const normalizedGM = normalizeHorario(gmHorario.hours);

    if (normalizedSheet === 'CERRADO' && normalizedGM === 'CERRADO') {
      return { match: true, gmHours: gmHorario.hours };
    }

    if ((normalizedSheet === 'CERRADO') !== (normalizedGM === 'CERRADO')) {
      return { match: false, gmHours: gmHorario.hours };
    }

    if (normalizedSheet === normalizedGM) {
      return { match: true, gmHours: gmHorario.hours };
    }

    return { match: false, gmHours: gmHorario.hours };
  };

  const handleAdd = () => {
    setEditingHorario(null);
    setFormData({ fecha: '', horario: '', motivo: '' });
    setOpenDialog(true);
  };

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setFormData({
      fecha: horario.fecha,
      horario: horario.horario,
      motivo: horario.motivo
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!formData.fecha || !formData.horario || !formData.motivo) {
      showError('❌ Todos los campos son obligatorios');
      return;
    }

    if (!isValidDate(formData.fecha)) {
      showError('❌ Formato de fecha inválido. Use DD/MM/YYYY (ej: 25/12/2025)');
      return;
    }

    setLoading(true);
    setOpenDialog(false);

    try {
      let result;
      if (editingHorario) {
        result = await GoogleSheetsWriterService.updateHorario(
          formData.fecha,
          formData.horario,
          formData.motivo
        );
      } else {
        result = await GoogleSheetsWriterService.addHorario(
          formData.fecha,
          formData.horario,
          formData.motivo
        );
      }

      if (result.success) {
        showSuccess(`✅ ${editingHorario ? 'Actualizado' : 'Agregado'} correctamente`);
        loadHorarios();
      } else {
        showError(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      showError(`❌ Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fecha) => {
    if (!confirm(`¿Está seguro de eliminar el horario del ${fecha}?`)) {
      return;
    }

    setLoading(true);

    try {
      const result = await GoogleSheetsWriterService.deleteHorario(fecha);

      if (result.success) {
        showSuccess('✅ Eliminado correctamente');
        loadHorarios();
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
    <>
      <VoondaAdminHeader title={"Horarios de Atención"} />

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          <AlertTitle>
            {messageType === 'success' ? 'Éxito' : messageType === 'error' ? 'Error' : 'Información'}
          </AlertTitle>
          {message}
        </Alert>
      )}

      <Card>
        <CardContent>
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
                label="Link Google Maps del local"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                fullWidth
                size="small"
                helperText="Link del negocio en Google Maps"
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="35%"><strong>Fecha</strong></TableCell>
                    <TableCell width="40%"><strong>Horario y Motivo</strong></TableCell>
                    <TableCell width="25%" align="right"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHorarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
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
                        <TableRow
                          key={index}
                          sx={{
                            bgcolor: isHighlighted ? '#e3f2fd' : 'inherit',
                            '&:hover': {
                              bgcolor: isHighlighted ? '#bbdefb' : 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          {/* Columna Fecha */}
                          <TableCell>
                            <Box>
                              {/* Primera línea: Fecha + Badge día */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {horario.fecha}
                                </Typography>
                                <Chip
                                  label={dayOfWeek}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    height: 20,
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    borderColor: dayOfWeek === 'sábado' ? 'warning.main' :
                                      dayOfWeek === 'domingo' ? 'error.main' :
                                        'primary.main',
                                    color: dayOfWeek === 'sábado' ? 'warning.main' :
                                      dayOfWeek === 'domingo' ? 'error.main' :
                                        'primary.main'
                                  }}
                                />
                              </Box>
                              {/* Segunda línea: Comparación con Google Maps */}
                              {comparison.gmHours && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  {comparison.match === true && (
                                    <Typography variant="body2" color="success.main">
                                      Coincide con GM
                                    </Typography>
                                  )}
                                  {comparison.match === false && (
                                    <Typography variant="body2" color="warning.main">
                                      No coincide (GM: {comparison.gmHours})
                                    </Typography>
                                  )}
                                  {comparison.match === null && (
                                    <Typography variant="body2" color="text.secondary">
                                      GM: {comparison.gmHours}
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
                          </TableCell>

                          {/* Columna Horario y Motivo unificados */}
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                                {horario.horario}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {horario.motivo}
                              </Typography>
                            </Box>
                          </TableCell>

                          {/* Columna Acciones */}
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

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
              disabled={!!editingHorario}
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
    </>
  );
};
