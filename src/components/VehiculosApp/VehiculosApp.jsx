import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Container, Stack, useMediaQuery, Button, IconButton } from '@mui/material'
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks'
import { CONTAINER_MAX_WIDTH } from '@/config/layouts'
import { ContentLayout } from '@/layouts/ContentLayout'
import { PageHeader } from '@/components/PageHeader'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { syncSheetsService } from '@/services/sync-sheets'

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
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [totalVehiculos, setTotalVehiculos] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [filtros, setFiltros] = useState({
        marca: '',
        estado: '',
        año_desde: '',
        año_hasta: '',
        precio_desde: '',
        precio_hasta: ''
    })

    // Cargar vehículos al inicializar
    useEffect(() => {
        cargarVehiculos()
    }, [])

    const cargarVehiculos = async (page = currentPage, pageSize = itemsPerPage) => {
        try {
            setLoading(true)

            // Construir query base
            let countQuery = supabase
                .from('vehiculos')
                .select('*', { count: 'exact', head: true })
                .eq('activo', true)

            let dataQuery = supabase
                .from('vehiculos')
                .select('*')
                .eq('activo', true)
                .order('created_at', { ascending: false })

            // Aplicar filtros
            const applyFilters = (query) => {
                if (filtros.marca) query = query.ilike('marca', `%${filtros.marca}%`)
                if (filtros.estado) query = query.eq('estado', filtros.estado)
                if (filtros.año_desde) query = query.gte('vehiculo_ano', parseInt(filtros.año_desde))
                if (filtros.año_hasta) query = query.lte('vehiculo_ano', parseInt(filtros.año_hasta))
                if (filtros.precio_desde) query = query.gte('valor', parseFloat(filtros.precio_desde))
                if (filtros.precio_hasta) query = query.lte('valor', parseFloat(filtros.precio_hasta))
                return query
            }

            countQuery = applyFilters(countQuery)
            dataQuery = applyFilters(dataQuery)

            // Obtener total
            const { count, error: countError } = await countQuery
            if (countError) throw countError

            setTotalVehiculos(count || 0)

            // Aplicar paginación
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1
            dataQuery = dataQuery.range(from, to)

            // Obtener datos
            const { data: vehiculosData, error } = await dataQuery

            if (error) throw error

            // Cargar modelos relacionados
            const modeloIds = vehiculosData
                .filter(v => v.modelo_id)
                .map(v => v.modelo_id)
                .filter((id, index, arr) => arr.indexOf(id) === index)

            let modelosMap = {}
            if (modeloIds.length > 0) {
                const { data: modelosData, error: modelosError } = await supabase
                    .from('modelo_autos')
                    .select('*')
                    .in('id', modeloIds)

                if (!modelosError) {
                    modelosMap = modelosData.reduce((acc, modelo) => {
                        acc[modelo.id] = modelo
                        return acc
                    }, {})
                }
            }

            // Combinar datos
            const vehiculosConModelos = vehiculosData.map(vehiculo => ({
                ...vehiculo,
                modelo_autos: vehiculo.modelo_id ? modelosMap[vehiculo.modelo_id] : null
            }))

            setVehiculos(vehiculosConModelos || [])
            setCurrentPage(page)

        } catch (error) {
            console.error('Error cargando vehículos:', error)
            showDialog({
                title: 'Error',
                content: `Error cargando vehículos: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    const sincronizarConSheets = async () => {
        try {
            setLoading(true)
            const result = await syncSheetsService.syncVehiculos()

            showDialog({
                title: result.success ? '✅ Sincronización Exitosa' : '❌ Error en Sincronización',
                content: result.message
            })

            if (result.success) {
                cargarVehiculos()
            }
        } catch (error) {
            console.error('Error sincronizando:', error)
            showDialog({
                title: '❌ Error',
                content: `Error sincronizando: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    const eliminarVehiculo = async (id) => {
        showConfirmDialog({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('vehiculos')
                        .update({ activo: false })
                        .eq('id', id)

                    if (error) throw error

                    showDialog({
                        title: 'Éxito',
                        content: 'Vehículo eliminado correctamente'
                    })
                    cargarVehiculos(currentPage)
                } catch (error) {
                    showDialog({
                        title: 'Error',
                        content: `Error eliminando vehículo: ${error.message}`
                    })
                }
            }
        })
    }

    const handleSave = async (vehicleData) => {
        try {
            let error

            if (selectedVehicle) {
                const result = await supabase
                    .from('vehiculos')
                    .update({
                        ...vehicleData,
                        updated_at: new Date().toISOString(),
                        sincronizado_sheets: false
                    })
                    .eq('id', selectedVehicle.id)
                error = result.error
            } else {
                const result = await supabase.from('vehiculos').insert([{
                    ...vehicleData,
                    sincronizado_sheets: false
                }])
                error = result.error
            }

            if (error) throw error

            showDialog({
                title: 'Éxito',
                content: selectedVehicle ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente'
            })
            setShowModal(false)
            setSelectedVehicle(null)
            cargarVehiculos()
        } catch (error) {
            showDialog({
                title: 'Error',
                content: `Error guardando vehículo: ${error.message}`
            })
        }
    }

    const aplicarFiltros = () => {
        setCurrentPage(1)
        cargarVehiculos(1)
    }

    const limpiarFiltros = () => {
        setFiltros({
            marca: '',
            estado: '',
            año_desde: '',
            año_hasta: '',
            precio_desde: '',
            precio_hasta: ''
        })
        setCurrentPage(1)
        setTimeout(() => cargarVehiculos(1), 100)
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: CONTAINER_MAX_WIDTH,
                display: 'flex',
                minWidth: 0,
                flex: 1,
                flexDirection: 'column',
            }}
            disableGutters
        >
            <ContentLayout
                contentOptions={{
                    sx: {
                        padding: '0 !important'
                    }
                }}
                header={
                    <PageHeader
                        title='Gestión de Vehículos'
                        subheader={`${totalVehiculos} vehículos en total`}
                        action={
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
                                    Agregar
                                </Button>
                            </Stack>
                        }
                    />
                }
            >
                <Container maxWidth={CONTAINER_MAX_WIDTH} disableGutters>
                    {/* Filtros */}
                    <VehiclesFilters
                        filtros={filtros}
                        setFiltros={setFiltros}
                        aplicarFiltros={aplicarFiltros}
                        limpiarFiltros={limpiarFiltros}
                    />
                </Container>

                <Container maxWidth={CONTAINER_MAX_WIDTH} disableGutters>
                    {/* Lista de Vehículos */}
                    <VehiclesList
                        vehiculos={vehiculos}
                        loading={loading}
                        totalVehiculos={totalVehiculos}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        onPageChange={(page) => cargarVehiculos(page)}
                        onEdit={(vehicle) => {
                            setSelectedVehicle(vehicle)
                            setShowModal(true)
                        }}
                        onDelete={eliminarVehiculo}
                    />                {/* Modal */}
                    {showModal && (
                        <VehicleModal
                            vehicle={selectedVehicle}
                            onSave={handleSave}
                            onClose={() => {
                                setShowModal(false)
                                setSelectedVehicle(null)
                            }}
                        />
                    )}
                </Container>
            </ContentLayout>
        </Container>
    )
}