import React from 'react'
import { VendedoresManager } from '@/components'
import { Box } from '@mui/material'

const VendedoresPage = () => {
    return (
        <Box sx={{ mt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <VendedoresManager />
        </Box>
    )
}

export default VendedoresPage