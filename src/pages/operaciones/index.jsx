import React from 'react'
import { OperacionesManager } from '@/components'
import { Box } from '@mui/material'

const OperacionesPage = () => {
    return (
        <Box sx={{ mt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <OperacionesManager />
        </Box>
    )
}

export default OperacionesPage