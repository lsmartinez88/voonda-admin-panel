import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Container, Stack, useMediaQuery, Button, IconButton, Typography, Box } from '@mui/material'
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { syncSheetsService } from '../../services/sync-sheets'

// Components
import { VehiclesList } from './VehiclesList'
import { VehiclesFilters } from './VehiclesFilters'
import { VehicleModal } from './VehicleModal'

// Icons
import AddIcon from '@mui/icons-material/Add'
import SyncIcon from '@mui/icons-material/Sync'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const VehiculosApp = () => {
    const { theme } = useJumboTheme()
    const lg = useMediaQuery(theme.breakpoints.down('lg'))
    const { showDialog, showConfirmDialog } = useJumboDialog()

    // Estados
    const [vehiculos, setVehiculos] = useState([])
    const [totalVehiculos, setTotalVehiculos] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [filters, setFilters] = useState({
        search: '',
        marca: '',
        modelo: '',
        condicion: '',
        sortBy: 'fecha_ingreso',
        order: 'desc'
    })

    // Fetch vehículos
    const fetchVehiculos = async () => {
        try {
            setLoading(true)

            let query = supabase
                .from('vehiculos')
                .select('*', { count: 'exact' })

            // Aplicar filtros
            if (filters.search) {
                query = query.or(`dominio.ilike.%${filters.search}%,marca.ilike.%${filters.search}%,modelo.ilike.%${filters.search}%`)
            }
            if (filters.marca) {
                query = query.eq('marca', filters.marca)
            }
            if (filters.modelo) {
                query = query.eq('modelo', filters.modelo)
            }
            if (filters.condicion) {
                query = query.eq('estado', filters.condicion)
            }

            // Ordenamiento
            query = query.order(filters.sortBy, { ascending: filters.order === 'asc' })

            const { data, error, count } = await query

            if (error) {
                throw error
            }

            setVehiculos(data || [])
            setTotalVehiculos(count || 0)
        } catch (error) {
            console.error('Error fetching vehicles:', error)
            showDialog({
                title: 'Error',
                content: 'Error al cargar los vehículos: ' + error.message,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // Sincronizar con sheets
    const sincronizarConSheets = async () => {
        try {
            setLoading(true)
            showDialog({
                title: 'Sincronizando...',
                content: 'Actualizando datos con Google Sheets...',
                variant: 'info'
            })

            const result = await syncSheetsService.syncVehiculos()

            if (result.success) {
                showDialog({
                    title: 'Sincronización exitosa',
                    content: `Se sincronizaron ${result.totalSynced} vehículos correctamente.`,
                    variant: 'success'
                })
                await fetchVehiculos() // Recargar datos
            } else {
                throw new Error(result.error || 'Error en sincronización')
            }
        } catch (error) {
            console.error('Error syncing:', error)
            showDialog({
                title: 'Error de sincronización',
                content: 'No se pudo sincronizar con Google Sheets: ' + error.message,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // Crear/actualizar vehículo
    const handleSaveVehicle = async (vehicleData) => {
        try {
            setLoading(true)

            if (selectedVehicle) {
                // Actualizar
                const { error } = await supabase
                    .from('vehiculos')
                    .update(vehicleData)
                    .eq('id', selectedVehicle.id)

                if (error) throw error

                showDialog({
                    title: 'Éxito',
                    content: 'Vehículo actualizado correctamente',
                    variant: 'success'
                })
            } else {
                // Crear
                const { error } = await supabase
                    .from('vehiculos')
                    .insert([vehicleData])

                if (error) throw error

                showDialog({
                    title: 'Éxito',
                    content: 'Vehículo creado correctamente',
                    variant: 'success'
                })
            }

            setShowModal(false)
            setSelectedVehicle(null)
            await fetchVehiculos()
        } catch (error) {
            console.error('Error saving vehicle:', error)
            showDialog({
                title: 'Error',
                content: 'Error al guardar el vehículo: ' + error.message,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // Eliminar vehículo
    const handleDeleteVehicle = async (vehicleId) => {
        const confirmed = await showConfirmDialog({
            title: 'Confirmar eliminación',
            content: '¿Estás seguro de que quieres eliminar este vehículo?'
        })

        if (confirmed) {
            try {
                setLoading(true)

                const { error } = await supabase
                    .from('vehiculos')
                    .delete()
                    .eq('id', vehicleId)

                if (error) throw error

                showDialog({
                    title: 'Éxito',
                    content: 'Vehículo eliminado correctamente',
                    variant: 'success'
                })

                await fetchVehiculos()
            } catch (error) {
                console.error('Error deleting vehicle:', error)
                showDialog({
                    title: 'Error',
                    content: 'Error al eliminar el vehículo: ' + error.message,
                    variant: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
    }

    // Editar vehículo
    const handleEditVehicle = (vehicle) => {
        setSelectedVehicle(vehicle)
        setShowModal(true)
    }

    // Cargar datos iniciales
    useEffect(() => {
        fetchVehiculos()
    }, [filters])

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
            <VehicleModal
                open={showModal}
                vehicle={selectedVehicle}
                onClose={() => {
                    setShowModal(false)
                    setSelectedVehicle(null)
                }}
                onSave={handleSaveVehicle}
                loading={loading}
            />
        </Container>
    )
}

export default VehiculosApp