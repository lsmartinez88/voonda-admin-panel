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
            {/* Controles superiores estilo ContactApp */}
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
                {/* Botones de acción para desktop */}
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                    {headerActions}
                </Box>

                {/* Controles de vista */}
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

                    {/* Tabs de vista */}
                    <Tabs
                        value={viewMode}
                        onChange={(e, newValue) => setViewMode(newValue)}
                        sx={{
                            minHeight: 'auto',
                            '& .MuiTab-root': {
                                minHeight: 40,
                                minWidth: 40,
                                px: 2
                            }
                        }}
                    >
                        <Tab
                            value='cards'
                            icon={<ViewModuleIcon />}
                            sx={{ textTransform: 'none' }}
                        />
                        <Tab
                            value='table'
                            icon={<TableRowsIcon />}
                            sx={{ textTransform: 'none' }}
                        />
                    </Tabs>
                </Stack>
            </Stack>

            {/* Contenido principal */}
            {viewMode === 'cards' ? (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {vehiculos.map((vehiculo) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehiculo.id}>
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
                <JumboCard
                    contentWrapper
                    sx={{
                        mb: 3,
                        '& .MuiCardContent-root': {
                            padding: '0 !important'
                        }
                    }}
                >
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