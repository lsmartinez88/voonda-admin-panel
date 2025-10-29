import React from 'react'
import VehicleModalHybrid from '../Vehiculos/VehicleModalHybrid'

// Por ahora usamos el modal existente, después lo refactorizamos
export const VehicleModal = ({ vehicle, onSave, onClose }) => {
    return (
        <VehicleModalHybrid
            vehicle={vehicle}
            onSave={onSave}
            onClose={onClose}
        />
    )
}