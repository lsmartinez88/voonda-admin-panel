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
                            "th:first-child": {
                                pl: 3,
                            },
                            "th:last-child": {
                                pr: 3,
                            },
                        }}
                    >
                        <TableCell>Vehículo</TableCell>
                        <TableCell width={120}>Año</TableCell>
                        <TableCell width={120}>Motor</TableCell>
                        <TableCell width={120}>Combustible</TableCell>
                        <TableCell width={150}>Precio</TableCell>
                        <TableCell width={120}>Estado</TableCell>
                        <TableCell width={100} align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehiculos.map((item, index) => (
                        <VehicleItem
                            item={item}
                            key={index}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}