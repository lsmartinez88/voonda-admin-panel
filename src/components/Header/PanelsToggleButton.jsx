import { Tooltip } from '@mui/material'
import { ViewModule, ViewStream } from '@mui/icons-material'
import { JumboIconButton } from "@jumbo/components/JumboIconButton"
import { Span } from "@jumbo/shared"
import { useLayout } from '../../contexts/LayoutContext'

export const PanelsToggleButton = () => {
    const { showAllPanels, toggleAllPanels } = useLayout()

    return (
        <Span>
            <Tooltip title={showAllPanels ? 'Mostrar solo Voonda' : 'Mostrar todos los paneles'}>
                <JumboIconButton
                    onClick={toggleAllPanels}
                    elevation={23}
                >
                    {showAllPanels ? (
                        <ViewModule sx={{ fontSize: "1.25rem" }} />
                    ) : (
                        <ViewStream sx={{ fontSize: "1.25rem" }} />
                    )}
                </JumboIconButton>
            </Tooltip>
        </Span>
    )
}