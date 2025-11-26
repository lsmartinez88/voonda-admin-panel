import { JumboCard } from "@jumbo/components";
import { Box, Typography, Button, Stack, Alert } from "@mui/material";
import { VoondaAdminHeader } from "../VoondaAdminHeader";
import TestIcon from "@mui/icons-material/Science";

export const Prueba = () => {
  return (
    <>
      <VoondaAdminHeader title={"Prueba"} />
      
      <Stack spacing={3.75}>
        <JumboCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TestIcon />
              <Typography variant="h4">Componente de Prueba</Typography>
            </Box>
          }
          contentWrapper
          sx={{ mb: 3.75 }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            Esta es una página de prueba para demostrar la funcionalidad del nuevo layout administrativo.
          </Alert>

          <Typography variant="body1" paragraph>
            Este componente está utilizando el mismo estilo y estructura que las páginas de configuración 
            de usuario (user/settings/public-profile). Incluye:
          </Typography>

          <Box component="ul" sx={{ mb: 3, pl: 2 }}>
            <Typography component="li" variant="body2">Header responsivo con dropdown móvil</Typography>
            <Typography component="li" variant="body2">Sidebar de navegación con grupos</Typography>
            <Typography component="li" variant="body2">Layout basado en SettingsLayout</Typography>
            <Typography component="li" variant="body2">Componentes JumboCard para contenido</Typography>
          </Box>

          <Button variant="contained" color="primary">
            Botón de Prueba
          </Button>
        </JumboCard>

        <JumboCard
          title="Funcionalidades Adicionales"
          contentWrapper
          contentSx={{ pt: 0 }}
        >
          <Typography variant="body2" color="text.secondary" paragraph>
            Aquí puedes agregar más funcionalidades específicas para la administración del sistema.
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="small">
              Acción 1
            </Button>
            <Button variant="outlined" size="small">
              Acción 2
            </Button>
            <Button variant="outlined" size="small">
              Acción 3
            </Button>
          </Stack>
        </JumboCard>
      </Stack>
    </>
  );
};
