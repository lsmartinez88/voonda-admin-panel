import React from 'react'
import { CompradoresManager } from '@/components'
import { Box } from '@mui/material'

const CompradoresPage = () => {
    return (
        <Box sx={{ mt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CompradoresManager />
        </Box>
    )
}

export default CompradoresPage