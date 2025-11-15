import React, { useState, useEffect } from 'react';
import { Container, Stack, useMediaQuery, Button, Typography, Box } from '@mui/material';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useAuth } from '@/contexts/AuthContext';
import { vehiculosService } from '@/services/api';

// Components
import { VehiclesList } from './VehiclesList';
import { VehiclesFilters } from './VehiclesFilters';
import { VehicleModal } from './VehicleModal';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';

export const VehiculosApp = () => {
    const { theme } = useJumboTheme();
    const lg = useMediaQuery(theme.breakpoints.down('lg'));
    const { showDialog, showConfirmDialog } = useJumboDialog();
    const { isAuthenticated } = useAuth();

    // Estados
    const [vehiculos, setVehiculos] = useState([]);
    const [totalVehiculos, setTotalVehiculos] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        marca: '',
        modelo: '',
        estado: '',
        sortBy: 'fecha_ingreso',
        order: 'desc',
        page: 1,
        limit: 20
    });

    // Fetch vehículos usando API service
    const fetchVehiculos = async () => {
        try {
            setLoading(true);

            // Preparar opciones de filtro para el servicio
            const options = {
                page: filters.page,
                limit: filters.limit,
                sortBy: filters.sortBy,
                order: filters.order
            };

            // Agregar filtros si existen
            if (filters.search) {
                options.search = filters.search;
            }
            if (filters.marca) {
                options.marca = filters.marca;
            }
            if (filters.modelo) {
                options.modelo = filters.modelo;
            }
            if (filters.estado) {
                options.estado = filters.estado;
            }

            console.log('🔍 Buscando vehículos con opciones:', options);

            const response = await vehiculosService.getVehiculos(options);

            if (response.success) {
                console.log('✅ Vehículos obtenidos:', response);
                setVehiculos(response.vehiculos || response.data || []);
                setTotalVehiculos(response.total || response.vehiculos?.length || 0);
            } else {
                console.error('❌ Error en respuesta:', response);
                setVehiculos([]);
                setTotalVehiculos(0);

                // Solo mostrar error si no es un problema de autenticación
                if (response.error && !response.error.includes('Sesión expirada') && isAuthenticated) {
                    showDialog({
                        title: 'Error',
                        content: `Error al cargar los vehículos: ${response.error}`,
                        variant: 'error'
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error al obtener vehículos:', error);
            setVehiculos([]);
            setTotalVehiculos(0);

            // Solo mostrar error si el usuario está autenticado
            if (isAuthenticated) {
                showDialog({
                    title: 'Error',
                    content: `Error al cargar los vehículos: ${error.message}`,
                    variant: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Sincronizar con sheets (deshabilitado temporalmente)
    const sincronizarConSheets = async () => {
        showDialog({
            title: 'Función no disponible',
            content: 'La sincronización con Google Sheets está temporalmente deshabilitada.',
            variant: 'warning'
        });
    };

    // Crear/actualizar vehículo usando API service
    const handleSaveVehicle = async (vehicleData) => {
        try {
            setLoading(true);

            let response;
            if (selectedVehicle) {
                // Actualizar vehículo existente
                response = await vehiculosService.updateVehiculo(selectedVehicle.id, vehicleData);
            } else {
                // Crear nuevo vehículo
                response = await vehiculosService.createVehiculo(vehicleData);
            }

            if (response.success) {
                showDialog({
                    title: 'Éxito',
                    content: selectedVehicle ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente',
                    variant: 'success'
                });
                setShowModal(false);
                setSelectedVehicle(null);
                await fetchVehiculos(); // Recargar datos
            } else {
                showDialog({
                    title: 'Error',
                    content: response.error || 'Error al guardar el vehículo',
                    variant: 'error'
                });
            }
        } catch (error) {
            console.error('❌ Error al guardar vehículo:', error);
            showDialog({
                title: 'Error',
                content: `Error al guardar el vehículo: ${error.message}`,
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Eliminar vehículo usando API service  
    const handleDeleteVehicle = async (vehicleId) => {
        const confirmed = await showConfirmDialog({
            title: 'Confirmar eliminación',
            content: '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmed) return;

        try {
            setLoading(true);

            const response = await vehiculosService.deleteVehiculo(vehicleId);

            if (response.success) {
                showDialog({
                    title: 'Éxito',
                    content: 'Vehículo eliminado correctamente',
                    variant: 'success'
                });
                await fetchVehiculos(); // Recargar datos
            } else {
                showDialog({
                    title: 'Error',
                    content: response.error || 'Error al eliminar el vehículo',
                    variant: 'error'
                });
            }
        } catch (error) {
            console.error('❌ Error al eliminar vehículo:', error);
            showDialog({
                title: 'Error',
                content: `Error al eliminar el vehículo: ${error.message}`,
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Editar vehículo
    const handleEditVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
    };

    // Cargar datos iniciales solo si el usuario está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            fetchVehiculos();
        }
    }, [filters, isAuthenticated]);

    // Si no está autenticado, no mostrar nada
    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" color="primary" gutterBottom>
                        Gestión de Vehículos
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {totalVehiculos} vehículos en total
                    </Typography>
                </Box>

                <Stack spacing={1} direction='row'>
                    <Button
                        onClick={sincronizarConSheets}
                        variant='outlined'
                        startIcon={<SyncIcon />}
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5,
                            fontSize: 14,
                            letterSpacing: 0
                        }}
                    >
                        Sincronizar
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedVehicle(null)
                            setShowModal(true)
                        }}
                        variant='contained'
                        startIcon={<AddIcon />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5,
                            fontSize: 14,
                            letterSpacing: 0
                        }}
                        disableElevation
                    >
                        Agregar Vehículo
                    </Button>
                </Stack>
            </Stack>

            {/* Filters */}
            <VehiclesFilters
                filters={filters}
                onFiltersChange={setFilters}
                loading={loading}
            />

            {/* Vehicles List */}
            <VehiclesList
                vehiculos={vehiculos}
                loading={loading}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
            />

            {/* Vehicle Modal */}
            {showModal && (
                <VehicleModal
                    vehicle={selectedVehicle}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedVehicle(null);
                    }}
                    onSave={handleSaveVehicle}
                />
            )}
        </Container>
    )
}

export default VehiculosApp