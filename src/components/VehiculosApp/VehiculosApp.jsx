import React, { useState, useEffect } from 'react';
import { Container, Stack, useMediaQuery, Button, Typography, Box } from '@mui/material';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useAuth } from '../../contexts/AuthContext';
import vehiculosService from '../../services/api/vehiculosService';

// Components
import { VehiclesList } from './VehiclesList';
import { VehiclesFilters } from './VehiclesFilters';
import { VehicleModal } from './VehicleModal';
import { VehiclesPagination } from './VehiclesPagination';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';

export const VehiculosApp = () => {
    const { theme } = useJumboTheme();
    const lg = useMediaQuery(theme.breakpoints.down('lg'));
    const { showDialog, showConfirmDialog } = useJumboDialog();
    const { user } = useAuth();

    // Estados principales
    const [vehiculos, setVehiculos] = useState([]);
    const [totalVehiculos, setTotalVehiculos] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 12
    });
    const [loading, setLoading] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Estados para opciones de filtros
    const [marcasModelos, setMarcasModelos] = useState([])
    const [años, setAños] = useState([])
    const [estados, setEstados] = useState([])
    const [loadingOptions, setLoadingOptions] = useState(false)
    const [filters, setFilters] = useState({
        search: '',
        marca: '',
        modelo: '',
        año: '',
        estado: '',
        sortBy: 'fecha_ingreso',
        order: 'desc',
        page: 1,
        limit: 12
    })

    // Fetch vehículos usando API service
    const fetchVehiculos = async () => {
        try {
            setLoading(true);

            console.log('🔍 Buscando vehículos con opciones:', filters);

            const response = await vehiculosService.getVehiculos(filters);

            if (response.success) {
                console.log('✅ Vehículos obtenidos:', response);
                setVehiculos(response.vehiculos || []);
                setTotalVehiculos(response.pagination?.total || response.vehiculos?.length || 0);

                // Actualizar estado de paginación
                const paginationData = response.pagination || {};
                setPagination({
                    page: paginationData.page || 1,
                    pages: paginationData.pages || Math.ceil((paginationData.total || 0) / filters.limit),
                    total: paginationData.total || 0,
                    limit: paginationData.limit || filters.limit
                });
            } else {
                console.error('❌ Error en respuesta:', response);
                setVehiculos([]);
                setTotalVehiculos(0);

                showDialog({
                    title: 'Error',
                    content: `Error al cargar los vehículos: ${response.error || 'Error desconocido'}`,
                    variant: 'error'
                });
            }
        } catch (error) {
            console.error('❌ Error al obtener vehículos:', error);
            setVehiculos([]);
            setTotalVehiculos(0);

            showDialog({
                title: 'Error',
                content: `Error al cargar los vehículos: ${error.message}`,
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Cargar opciones para filtros
    const loadFilterOptions = async () => {
        try {
            setLoadingOptions(true)

            // Cargar marcas-modelos, años, estados en paralelo usando los nuevos endpoints
            const [marcasModelosResponse, añosResponse, estadosResponse] = await Promise.all([
                vehiculosService.getMarcasModelos(),
                vehiculosService.getAños(),
                vehiculosService.getEstados()
            ])

            if (marcasModelosResponse.success) {
                setMarcasModelos(marcasModelosResponse.marcas || [])
                console.log('✅ Marcas y modelos cargados:', marcasModelosResponse.marcas)
            }

            if (añosResponse.success) {
                setAños(añosResponse.años || [])
                console.log('✅ Años cargados:', añosResponse.años)
            }

            if (estadosResponse.success) {
                setEstados(estadosResponse.estados || [])
                console.log('✅ Estados cargados:', estadosResponse.estados)
            }

        } catch (error) {
            console.error('❌ Error al cargar opciones de filtros:', error)
            showDialog({
                title: 'Error',
                content: `Error al cargar opciones de filtros: ${error.message}`,
                variant: 'error'
            })
        } finally {
            setLoadingOptions(false)
        }
    }

    // Cargar modelos cuando cambia la marca seleccionada - DEPRECATED
    // Ahora usamos la estructura jerárquica que ya viene cargada
    const getModelosForMarca = (marca) => {
        if (!marca || !marcasModelos.length) {
            return []
        }
        
        const marcaData = marcasModelos.find(m => m.marca === marca)
        return marcaData ? marcaData.modelos : []
    }

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
        if (user) {
            fetchVehiculos()
            loadFilterOptions() // Cargar opciones de filtros
        }
    }, [filters, user])

    // Manejar cambio de página
    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Manejar cambio de elementos por página
    const handleItemsPerPageChange = (newLimit) => {
        setFilters(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset a primera página cuando cambia el límite
        }));
    };

    // Si no está autenticado, no mostrar nada
    if (!user) {
        return (
            <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    Debes iniciar sesión para acceder al módulo de vehículos
                </Typography>
            </Container>
        );
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
                marcasModelos={marcasModelos}
                años={años}
                estados={estados}
                loadingOptions={loadingOptions}
                getModelosForMarca={getModelosForMarca}
            />

            {/* Vehicles List */}
            <VehiclesList
                vehiculos={vehiculos}
                loading={loading}
                totalVehiculos={totalVehiculos}
                currentPage={pagination.page}
                itemsPerPage={pagination.limit}
                setItemsPerPage={handleItemsPerPageChange}
                onPageChange={handlePageChange}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
                filters={filters}
                onFiltersChange={setFilters}
            />

            {/* Paginación personalizada */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <VehiclesPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    limit={pagination.limit}
                />
            </Box>

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