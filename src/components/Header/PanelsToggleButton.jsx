import { IconButton, Tooltip } from '@mui/material'
import { ViewModule, ViewStream } from '@mui/icons-material'
import { useLayout } from '../../contexts/LayoutContext'

export const PanelsToggleButton = () => {
    const { showAllPanels, toggleAllPanels } = useLayout()

    return (
        <Tooltip title={showAllPanels ? 'Mostrar solo Voonda' : 'Mostrar todos los paneles'}>
            <IconButton
                onClick={toggleAllPanels}
                color="primary"
                size="small"
                sx={{
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: showAllPanels ? 'primary.main' : 'primary.light',
                    bgcolor: showAllPanels ? 'primary.light' : 'transparent',
                    '&:hover': {
                        bgcolor: showAllPanels ? 'primary.main' : 'primary.light',
                        color: 'white'
                    }
                }}
            >
                {showAllPanels ? <ViewModule /> : <ViewStream />}
            </IconButton>
        </Tooltip>
    )
}