import React, { useState, useEffect } from 'react';
import { Container, Stack, useMediaQuery, Button, Typography, Box } from '@mui/material';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';
import vehiculosService from '../../services/api/vehiculosService';
import estadosService from '../../services/api/estadosService';

// Components
import { VehiclesList } from './VehiclesList';
import { VehiclesFilters } from './VehiclesFilters';
import { VehicleModal } from './VehicleModal';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';
import { VehiclesPagination } from './VehiclesPagination';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';

export const VehiculosApp = () => {
    const { theme } = useJumboTheme();
    const lg = useMediaQuery(theme.breakpoints.down('lg'));
    const { showDialog, showConfirmDialog } = useJumboDialog();
    const { enqueueSnackbar } = useSnackbar();
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
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

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

    // Editar vehículo - obtener datos completos de la API primero
    const handleEditVehicle = async (vehicle) => {
        try {
            setLoading(true);
            console.log('🔄 Obteniendo vehículo completo por ID:', vehicle.id);
            
            // Obtener el vehículo completo desde la API
            const response = await vehiculosService.getVehiculoById(vehicle.id);
            
            if (response.success && response.vehiculo) {
                console.log('✅ Vehículo completo obtenido:', response.vehiculo);
                setSelectedVehicle(response.vehiculo);
                setShowEditModal(true);
            } else {
                enqueueSnackbar('Error al obtener los datos del vehículo', {
                    variant: 'error',
                    autoHideDuration: 5000
                });
            }
        } catch (error) {
            console.error('❌ Error al obtener vehículo para edición:', error);
            enqueueSnackbar(`Error al cargar el vehículo: ${error.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    // Actualizar vehículo existente
    const handleUpdateVehicle = async (vehicleData) => {
        try {
            setLoading(true);

            console.log('✏️ Datos recibidos del modal de edición:', vehicleData);

            // Obtener la empresa del usuario logueado
            const empresaUsuario = user?.empresa;
            if (!empresaUsuario) {
                showDialog({
                    title: 'Error',
                    content: 'No se pudo obtener la información de la empresa del usuario. Verifique que esté correctamente autenticado.',
                    variant: 'error'
                });
                setLoading(false);
                return;
            }

            // Estructurar datos para actualización
            const apiPayload = {
                // ID del vehículo para actualizar
                id: vehicleData.id,

                // Datos del vehículo
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                version: vehicleData.version || '',
                vehiculo_ano: vehicleData.vehiculo_ano,
                patente: vehicleData.patente,
                kilometros: vehicleData.kilometros || 0,
                valor: vehicleData.valor,
                moneda: vehicleData.moneda || 'ARS',
                fecha_ingreso: vehicleData.fecha_ingreso,
                estado_codigo: vehicleData.estado_codigo,

                // Datos de la empresa
                empresa_id: empresaUsuario.id,

                // Datos del vendedor
                vendedor_nombre: vehicleData.vendedor_nombre,
                vendedor_apellido: vehicleData.vendedor_apellido,
                vendedor_telefono: vehicleData.vendedor_telefono,
                vendedor_email: vehicleData.vendedor_email,

                // Notas
                pendientes_preparacion: vehicleData.pendientes_preparacion || '',
                comentarios: vehicleData.comentarios || '',

                // Publicaciones procesadas
                publicaciones: vehicleData.publicaciones || []
            };

            console.log('📤 Datos estructurados para actualización:', apiPayload);

            // Llamada a la API para actualizar
            const response = await vehiculosService.updateVehiculo(vehicleData.id, apiPayload);

            console.log('📥 Respuesta de la API de actualización:', response);

            if (response.success) {
                // Mostrar mensaje de éxito con Snackbar verde
                const mensaje = `✏️ Vehículo ${apiPayload.marca} ${apiPayload.modelo} ${apiPayload.version || ''} (${apiPayload.patente}) actualizado exitosamente`;

                enqueueSnackbar(mensaje, {
                    variant: 'success',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });

                // Recargar datos después de actualizar el vehículo
                await fetchVehiculos();

                // Cerrar el modal automáticamente
                setShowEditModal(false);
                setSelectedVehicle(null);
            } else {
                throw new Error(response.message || 'Error al actualizar el vehículo');
            }

        } catch (error) {
            console.error('❌ Error al actualizar vehículo:', error);
            console.error('❌ Stack trace completo:', error.stack);

            // Re-lanzar el error para que EditVehicleModal lo maneje
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Crear nuevo vehículo
    const handleCreateVehicle = async (vehicleData) => {
        try {
            setLoading(true);

            console.log('🚗 Datos recibidos del modal:', vehicleData);
            console.log('🎯 Estado específico recibido:', vehicleData.estado_codigo);
            console.log('🎯 Tipo del estado:', typeof vehicleData.estado_codigo);

            // Obtener la empresa del usuario logueado
            const empresaUsuario = user?.empresa;
            if (!empresaUsuario) {
                showDialog({
                    title: 'Error',
                    content: 'No se pudo obtener la información de la empresa del usuario. Verifique que esté correctamente autenticado.',
                    variant: 'error'
                });
                setLoading(false);
                return;
            }

            // Verificar que venga el estado desde el formulario
            if (!vehicleData.estado_codigo) {
                showDialog({
                    title: 'Error',
                    content: 'El estado del vehículo es requerido. Por favor selecciona un estado.',
                    variant: 'error'
                });
                setLoading(false);
                return;
            }

            console.log('📋 Estado del vehículo validado:', vehicleData.estado_codigo)

            // Estructurar datos según lo que espera la API del backend
            const apiPayload = {
                // Datos del vehículo
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                version: vehicleData.version || '',
                vehiculo_ano: vehicleData.vehiculo_ano,
                patente: vehicleData.patente,
                kilometros: vehicleData.kilometros || 0,
                valor: vehicleData.valor,
                moneda: vehicleData.moneda || 'ARS',
                fecha_ingreso: vehicleData.fecha_ingreso,
                estado_codigo: vehicleData.estado_codigo, // Usar el estado seleccionado en el formulario

                // Datos de la empresa (ID directo)
                empresa_id: empresaUsuario.id,

                // Datos del vendedor
                vendedor_nombre: vehicleData.vendedor_nombre,
                vendedor_apellido: vehicleData.vendedor_apellido,
                vendedor_telefono: vehicleData.vendedor_telefono,
                vendedor_email: vehicleData.vendedor_email,

                // Notas
                pendientes_preparacion: vehicleData.pendientes_preparacion || '',
                comentarios: vehicleData.comentarios || '',

                // Publicaciones procesadas
                publicaciones: vehicleData.publicaciones || []
            };

            console.log('📤 Datos estructurados para API:', apiPayload);

            // Llamada real a la API
            const response = await vehiculosService.createVehiculo(apiPayload);

            console.log('📥 Respuesta de la API:', response);

            if (response.success) {
                // Mostrar mensaje de éxito con Snackbar verde que dura 5 segundos
                const vehiculoCreado = response.vehiculo || response.data;
                const mensaje = vehiculoCreado
                    ? `🎉 Vehículo ${apiPayload.marca} ${apiPayload.modelo} ${apiPayload.version || ''} (${apiPayload.patente}) creado exitosamente`
                    : '🎉 Vehículo creado correctamente';

                enqueueSnackbar(mensaje, {
                    variant: 'success',
                    autoHideDuration: 5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                });

                // Recargar datos después de crear el vehículo
                await fetchVehiculos();

                // Cerrar el modal automáticamente
                setShowAddModal(false);
            } else {
                throw new Error(response.message || 'Error al crear el vehículo');
            }

        } catch (error) {
            console.error('❌ Error al crear vehículo:', error);
            console.error('❌ Stack trace completo:', error.stack);

            // NO cerrar el modal automáticamente en caso de error
            // El error se mostrará en el componente AddVehicleModal

            // Re-lanzar el error para que AddVehicleModal lo maneje
            throw error;
        } finally {
            setLoading(false);
        }
    };    // Abrir modal de agregar vehículo
    const handleAddVehicle = () => {
        setShowAddModal(true);
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
                        onClick={handleAddVehicle}
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

            {/* Add Vehicle Modal */}
            {showAddModal && (
                <AddVehicleModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleCreateVehicle}
                />
            )}

            {/* Edit Vehicle Modal */}
            {showEditModal && (
                <EditVehicleModal
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedVehicle(null);
                    }}
                    onSave={handleUpdateVehicle}
                    vehicle={selectedVehicle}
                />
            )}
        </Container>
    )
}

export default VehiculosApp