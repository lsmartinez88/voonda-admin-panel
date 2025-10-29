import React, { useState } from 'react'
import {
    Box,
    Typography,
    Pagination,
    Stack,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
    Chip
} from '@mui/material'
import { JumboCard } from '@jumbo/components'
import Grid from '@mui/material/Grid2'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { FaEye } from 'react-icons/fa'

// Components
import { VehicleCard } from './VehicleCard'
import { VehicleTable } from './VehicleTable'

const ITEMS_PER_PAGE_OPTIONS = [
    { value: 6, label: '6 por página' },
    { value: 12, label: '12 por página' },
    { value: 24, label: '24 por página' },
    { value: 48, label: '48 por página' }
]

export const VehiclesList = ({
    vehiculos,
    loading,
    totalVehiculos,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    onPageChange,
    onEdit,
    onDelete,
    headerActions
}) => {
    const [viewMode, setViewMode] = useState('cards')

    const totalPages = Math.ceil(totalVehiculos / itemsPerPage)

    const handlePageSizeChange = (newSize) => {
        setItemsPerPage(newSize)
        onPageChange(1) // Reset to first page when changing page size
    }

    // Loading state
    if (loading) {
        return (
            <JumboCard contentWrapper sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={32} />
                    <Typography>Cargando vehículos...</Typography>
                </Box>
            </JumboCard>
        )
    }

    // Empty state
    if (vehiculos.length === 0) {
        return (
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
        )
    }

    return (
        <>
            {/* Header con controles */}
            <JumboCard
                title={
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='h2'>
                            Inventario
                        </Typography>
                        <Chip
                            label={`${totalVehiculos} vehículos`}
                            color='primary'
                            variant='outlined'
                            size='small'
                        />
                    </Stack>
                }
                action={headerActions}
                contentWrapper
                sx={{ mb: 3 }}
            >
                {/* Controles de vista y paginación */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                >
                    {/* Tabs de vista */}
                    <Tabs
                        value={viewMode}
                        onChange={(e, newValue) => setViewMode(newValue)}
                        sx={{ minHeight: 'auto' }}
                    >
                        <Tab
                            value='cards'
                            icon={<ViewModuleIcon />}
                            label='Vista Cards'
                            sx={{ textTransform: 'none' }}
                        />
                        <Tab
                            value='table'
                            icon={<TableRowsIcon />}
                            label='Vista Tabla'
                            sx={{ textTransform: 'none' }}
                        />
                    </Tabs>

                    {/* Controles de paginación */}
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <FormControl size='small' sx={{ minWidth: 140 }}>
                            <InputLabel>Elementos</InputLabel>
                            <Select
                                value={itemsPerPage}
                                label='Elementos'
                                onChange={(e) => handlePageSizeChange(e.target.value)}
                            >
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant='body2' color='text.secondary'>
                            Página {currentPage} de {totalPages}
                        </Typography>
                    </Stack>
                </Stack>
            </JumboCard>

            {/* Contenido principal */}
            {viewMode === 'cards' ? (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {vehiculos.map((vehiculo) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={vehiculo.id}>
                                <VehicleCard
                                    vehiculo={vehiculo}
                                    onEdit={() => onEdit(vehiculo)}
                                    onDelete={() => onDelete(vehiculo.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <JumboCard contentWrapper sx={{ mb: 3 }}>
                    <VehicleTable
                        vehiculos={vehiculos}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </JumboCard>
            )}

            {/* Paginación inferior */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, newPage) => onPageChange(newPage)}
                        color='primary'
                        showFirstButton
                        showLastButton
                        size='large'
                    />
                </Box>
            )}
        </>
    )
}