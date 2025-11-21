import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { VehicleItem } from './VehicleItem'

export const VehicleTable = ({ vehiculos, onEdit, onDelete }) => {
    return (
        <TableContainer>
            <Table sx={{ minWidth: 700 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            "th:first-of-type": {
                                pl: 3,
                            },
                            "th:last-of-type": {
                                pr: 3,
                            },
                        }}
                    >
                        <TableCell width={220}>Vehículo</TableCell>
                        <TableCell width={160}>Precio</TableCell>
                        <TableCell width={140}>Fecha/Patente</TableCell>
                        <TableCell width={140}>Vendedor</TableCell>
                        <TableCell width={120} align="center">Info</TableCell>
                        <TableCell width={80} />{/* Sin header para acciones */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehiculos.map((vehiculo, index) => (
                        <VehicleItem
                            vehiculo={vehiculo}
                            key={vehiculo.id || index}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}