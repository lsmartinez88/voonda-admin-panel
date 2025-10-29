import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Box,
    Typography,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { JumboCard } from '@jumbo/components';

const VehicleTable = ({ vehiculos, onEdit, onDelete }) => {
    // Los vehículos ya vienen con modelo_autos cargado desde el componente padre

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('es-AR').format(number || 0);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Disponible':
                return 'success';
            case 'Vendido':
                return 'error';
            case 'Reservado':
                return 'warning';
            case 'Mantenimiento':
                return 'info';
            default:
                return 'default';
        }
    };

    if (!vehiculos || vehiculos.length === 0) {
        return (
            <JumboCard contentWrapper sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                    No hay vehículos para mostrar
                </Typography>
            </JumboCard>
        );
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Marca/Modelo</strong></TableCell>
                        <TableCell><strong>Año</strong></TableCell>
                        <TableCell><strong>Color</strong></TableCell>
                        <TableCell><strong>Combustible</strong></TableCell>
                        <TableCell><strong>Transmisión</strong></TableCell>
                        <TableCell><strong>Kilometraje</strong></TableCell>
                        <TableCell><strong>Precio</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehiculos.map((vehiculo) => (
                        <TableRow key={vehiculo.id} hover>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {vehiculo.modelo_autos?.marca || 'Marca no disponible'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {vehiculo.modelo_autos?.modelo || 'Modelo no disponible'}
                                        {vehiculo.modelo_autos?.versión && ` ${vehiculo.modelo_autos.versión}`}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {vehiculo.modelo_autos ? vehiculo.modelo_autos.año : vehiculo.vehiculo_ano}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {vehiculo.color || 'N/A'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {vehiculo.modelo_autos?.combustible || vehiculo.combustible || 'N/A'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {vehiculo.modelo_autos?.caja || vehiculo.caja || vehiculo.transmision || 'N/A'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {vehiculo.kilometros ? `${formatNumber(vehiculo.kilometros)} km` : 'N/A'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {formatCurrency(vehiculo.valor)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={vehiculo.estado || 'N/A'}
                                    color={getEstadoColor(vehiculo.estado)}
                                    size="small"
                                    variant="filled"
                                />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Editar vehículo">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(vehiculo)}
                                            color="primary"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar vehículo">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(vehiculo.id)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VehicleTable;