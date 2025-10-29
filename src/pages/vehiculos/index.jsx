import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSync } from 'react-icons/fa'
import VehicleModalHybrid from '../../components/Vehiculos/VehicleModalHybrid'
import VehicleCard from '../../components/Vehiculos/VehicleCard'
import VehicleTable from '../../components/Vehiculos/VehicleTable'
import { JumboCard } from '@jumbo/components'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { syncSheetsService } from '../../services/sync-sheets'
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Tabs,
    Tab,
    Grid,
    Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SyncIcon from '@mui/icons-material/Sync'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TableRowsIcon from '@mui/icons-material/TableRows'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ITEMS_PER_PAGE = 12

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [viewMode, setViewMode] = useState('cards') // 'cards' o 'table'
    const [currentPage, setCurrentPage] = useState(1)
    const [totalVehiculos, setTotalVehiculos] = useState(0)
    const [filtros, setFiltros] = useState({
        marca: '',
        estado: '',
        año_desde: '',
        año_hasta: '',
        precio_desde: '',
        precio_hasta: ''
    })
    const { showDialog, showConfirmDialog } = useJumboDialog()

    // Cargar vehículos al montar el componente
    useEffect(() => {
        cargarVehiculos()
    }, [])

    const cargarVehiculos = async (page = currentPage) => {
        try {
            setLoading(true)

            // Primero obtener el total para la paginación
            let countQuery = supabase
                .from('vehiculos')
                .select('*', { count: 'exact', head: true })
                .eq('activo', true)

            // Aplicar filtros al conteo
            if (filtros.marca) {
                countQuery = countQuery.ilike('marca', `%${filtros.marca}%`)
            }
            if (filtros.estado) {
                countQuery = countQuery.eq('estado', filtros.estado)
            }
            if (filtros.año_desde) {
                countQuery = countQuery.gte('vehiculo_ano', parseInt(filtros.año_desde))
            }
            if (filtros.año_hasta) {
                countQuery = countQuery.lte('vehiculo_ano', parseInt(filtros.año_hasta))
            }
            if (filtros.precio_desde) {
                countQuery = countQuery.gte('valor', parseFloat(filtros.precio_desde))
            }
            if (filtros.precio_hasta) {
                countQuery = countQuery.lte('valor', parseFloat(filtros.precio_hasta))
            }

            const { count, error: countError } = await countQuery
            if (countError) throw countError

            setTotalVehiculos(count || 0)

            // Ahora obtener los datos paginados
            const from = (page - 1) * ITEMS_PER_PAGE
            const to = from + ITEMS_PER_PAGE - 1

            let dataQuery = supabase
                .from('vehiculos')
                .select('*')
                .eq('activo', true)
                .order('created_at', { ascending: false })
                .range(from, to)

            // Aplicar filtros a los datos
            if (filtros.marca) {
                dataQuery = dataQuery.ilike('marca', `%${filtros.marca}%`)
            }
            if (filtros.estado) {
                dataQuery = dataQuery.eq('estado', filtros.estado)
            }
            if (filtros.año_desde) {
                dataQuery = dataQuery.gte('vehiculo_ano', parseInt(filtros.año_desde))
            }
            if (filtros.año_hasta) {
                dataQuery = dataQuery.lte('vehiculo_ano', parseInt(filtros.año_hasta))
            }
            if (filtros.precio_desde) {
                dataQuery = dataQuery.gte('valor', parseFloat(filtros.precio_desde))
            }
            if (filtros.precio_hasta) {
                dataQuery = dataQuery.lte('valor', parseFloat(filtros.precio_hasta))
            }

            const { data: vehiculosData, error } = await dataQuery

            if (error) {
                console.error('Error cargando vehículos:', error)
                showDialog({
                    title: 'Error',
                    content: `Error cargando vehículos: ${error.message}`
                })
            } else {
                // Obtener los modelo_ids únicos que no son null
                const modeloIds = vehiculosData
                    .filter(v => v.modelo_id)
                    .map(v => v.modelo_id)
                    .filter((id, index, arr) => arr.indexOf(id) === index) // únicos

                let modelosMap = {}

                // Si hay modelo_ids, cargar los modelos
                if (modeloIds.length > 0) {
                    const { data: modelosData, error: modelosError } = await supabase
                        .from('modelo_autos')
                        .select('*')
                        .in('id', modeloIds)

                    if (modelosError) {
                        console.error('Error cargando modelos:', modelosError)
                    } else {
                        // Crear un mapa para acceso rápido
                        modelosMap = modelosData.reduce((acc, modelo) => {
                            acc[modelo.id] = modelo
                            return acc
                        }, {})
                    }
                }

                // Combinar vehiculos con sus modelos
                const vehiculosConModelos = vehiculosData.map(vehiculo => ({
                    ...vehiculo,
                    modelo_autos: vehiculo.modelo_id ? modelosMap[vehiculo.modelo_id] : null
                }))

                setVehiculos(vehiculosConModelos || [])
                setCurrentPage(page)
            }
        } catch (error) {
            console.error('Error:', error)
            showDialog({
                title: 'Error',
                content: `Error: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    const sincronizarConSheets = async () => {
        try {
            // Mostrar loading
            setLoading(true)

            // Usar el servicio de sincronización
            const result = await syncSheetsService.syncVehiculos()

            if (result.success) {
                showDialog({
                    title: '✅ Sincronización Exitosa',
                    content: result.message
                })
                cargarVehiculos() // Recargar datos
            } else {
                showDialog({
                    title: '❌ Error en Sincronización',
                    content: result.message
                })
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

                    if (error) {
                        showDialog({
                            title: 'Error',
                            content: `Error eliminando vehículo: ${error.message}`
                        })
                    } else {
                        showDialog({
                            title: 'Éxito',
                            content: 'Vehículo eliminado correctamente'
                        })
                        cargarVehiculos(currentPage)
                    }
                } catch (error) {
                    showDialog({
                        title: 'Error',
                        content: `Error: ${error.message}`
                    })
                }
            }
        })
    }

    const handleSave = async (vehicleData) => {
        try {
            let error

            if (selectedVehicle) {
                // Actualizar vehículo existente
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
                // Crear nuevo vehículo
                const result = await supabase.from('vehiculos').insert([
                    {
                        ...vehicleData,
                        sincronizado_sheets: false
                    }
                ])

                error = result.error
            }

            if (error) {
                showDialog({
                    title: 'Error',
                    content: `Error guardando vehículo: ${error.message}`
                })
            } else {
                showDialog({
                    title: 'Éxito',
                    content: selectedVehicle ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente'
                })
                setShowModal(false)
                setSelectedVehicle(null)
                cargarVehiculos()
            }
        } catch (error) {
            showDialog({
                title: 'Error',
                content: `Error: ${error.message}`
            })
        }
    }

    const aplicarFiltros = () => {
        setCurrentPage(1) // Resetear a primera página
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

    const handlePageChange = (event, newPage) => {
        cargarVehiculos(newPage)
    }

    const totalPages = Math.ceil(totalVehiculos / ITEMS_PER_PAGE)

    return (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 2 }}>
            {/* Header Card */}
            <JumboCard
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img src='/assets/images/logo.png' alt='Logo' style={{ height: 48 }} />
                        <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
                            Gestión de Vehículos
                        </Typography>
                    </Box>
                }
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            onClick={sincronizarConSheets}
                            variant='contained'
                            color='success'
                            startIcon={<SyncIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Sincronizar Sheets
                        </Button>
                        <Button
                            onClick={() => {
                                setSelectedVehicle(null)
                                setShowModal(true)
                            }}
                            variant='contained'
                            startIcon={<AddIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            Nuevo Vehículo
                        </Button>
                    </Box>
                }
                contentWrapper
                sx={{ mb: 3 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>
                        Administra tu inventario de vehículos
                    </Typography>
                    <Chip label={`Total: ${totalVehiculos} vehículos`} color='primary' variant='outlined' />
                </Box>
            </JumboCard>

            {/* Filtros */}
            <JumboCard title='Filtros de Búsqueda' contentWrapper sx={{ mb: 3 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label='Marca'
                            value={filtros.marca}
                            onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filtros.estado}
                                label='Estado'
                                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                            >
                                <MenuItem value=''>Todos los estados</MenuItem>
                                <MenuItem value='Disponible'>Disponible</MenuItem>
                                <MenuItem value='Vendido'>Vendido</MenuItem>
                                <MenuItem value='Reservado'>Reservado</MenuItem>
                                <MenuItem value='Mantenimiento'>Mantenimiento</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Año desde'
                            value={filtros.año_desde}
                            onChange={(e) => setFiltros({ ...filtros, año_desde: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Año hasta'
                            value={filtros.año_hasta}
                            onChange={(e) => setFiltros({ ...filtros, año_hasta: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Precio desde'
                            value={filtros.precio_desde}
                            onChange={(e) => setFiltros({ ...filtros, precio_desde: e.target.value })}
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            fullWidth
                            type='number'
                            label='Precio hasta'
                            value={filtros.precio_hasta}
                            onChange={(e) => setFiltros({ ...filtros, precio_hasta: e.target.value })}
                            size='small'
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={aplicarFiltros} variant='contained' sx={{ textTransform: 'none' }}>
                        Aplicar Filtros
                    </Button>
                    <Button onClick={limpiarFiltros} variant='outlined' sx={{ textTransform: 'none' }}>
                        Limpiar
                    </Button>
                </Box>
            </JumboCard>

            {/* Selector de vista y paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)} sx={{ minHeight: 'auto' }}>
                    <Tab value='cards' icon={<ViewModuleIcon />} label='Vista Cards' sx={{ textTransform: 'none' }} />
                    <Tab value='table' icon={<TableRowsIcon />} label='Vista Tabla' sx={{ textTransform: 'none' }} />
                </Tabs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='body2' color='text.secondary'>
                        Página {currentPage} de {totalPages}
                    </Typography>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color='primary'
                        size='small'
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Box>

            {/* Contenido principal */}
            {loading ? (
                <JumboCard contentWrapper sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                border: '3px solid',
                                borderColor: 'primary.main',
                                borderTopColor: 'transparent',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }}
                        />
                        <Typography>Cargando vehículos...</Typography>
                    </Box>
                </JumboCard>
            ) : vehiculos.length === 0 ? (
                <JumboCard contentWrapper sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <FaEye style={{ fontSize: '48px', color: '#9ca3af' }} />
                        <Typography variant='h6' color='text.secondary'>
                            No hay vehículos para mostrar
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Prueba ajustando los filtros o agrega nuevos vehículos
                        </Typography>
                    </Box>
                </JumboCard>
            ) : viewMode === 'cards' ? (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {vehiculos.map((vehiculo) => (
                            <Grid item xs={12} sm={6} md={4} key={vehiculo.id}>
                                <VehicleCard
                                    vehiculo={vehiculo}
                                    onEdit={(vehicle) => {
                                        setSelectedVehicle(vehicle)
                                        setShowModal(true)
                                    }}
                                    onDelete={eliminarVehiculo}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Paginación inferior */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color='primary'
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            ) : (
                <JumboCard contentWrapper>
                    <VehicleTable
                        vehiculos={vehiculos}
                        onEdit={(vehicle) => {
                            setSelectedVehicle(vehicle)
                            setShowModal(true)
                        }}
                        onDelete={eliminarVehiculo}
                    />
                    {/* Paginación para tabla */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color='primary'
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </JumboCard>
            )}

            {/* Modal */}
            {showModal && (
                <VehicleModalHybrid
                    vehicle={selectedVehicle}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedVehicle(null)
                    }}
                />
            )}
        </Box>
    )
}

export default Vehiculos