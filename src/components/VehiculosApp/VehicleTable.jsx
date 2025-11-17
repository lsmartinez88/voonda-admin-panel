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
                        <TableCell>Vehículo</TableCell>
                        <TableCell width={150}>Precio</TableCell>
                        <TableCell width={120}>Kilometraje</TableCell>
                        <TableCell width={150}>Patente</TableCell>
                        <TableCell width={120}>Fecha Ingreso</TableCell>
                        <TableCell width={120}>Vendedor</TableCell>
                        <TableCell width={100} align="right">Acciones</TableCell>
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