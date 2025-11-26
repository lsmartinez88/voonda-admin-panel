import { JumboCard } from "@jumbo/components";
import { Box, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { VoondaAdminHeader } from "../VoondaAdminHeader";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const diasSemana = [
  { dia: "Lunes", horario: "09:00 - 18:00", abierto: true },
  { dia: "Martes", horario: "09:00 - 18:00", abierto: true },
  { dia: "Miércoles", horario: "09:00 - 18:00", abierto: true },
  { dia: "Jueves", horario: "09:00 - 18:00", abierto: true },
  { dia: "Viernes", horario: "09:00 - 18:00", abierto: true },
  { dia: "Sábado", horario: "10:00 - 14:00", abierto: true },
  { dia: "Domingo", horario: "Cerrado", abierto: false },
];

export const HorariosAtencion = () => {
  return (
    <>
      <VoondaAdminHeader title={"Horarios de Atención"} />

      <JumboCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon />
            <Typography variant="h4" sx={{ mb: 0 }}  >Configuración semanal</Typography>
          </Box>
        }
        contentWrapper
        sx={{ mb: 3.75 }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          A continuación se muestran los horarios de atención del local. Esta información será consultada desde Google Maps.
        </Typography>

        <List>
          {diasSemana.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: index < diasSemana.length - 1 ? 1 : 0,
                borderColor: 'divider',
                py: 2,
              }}
            >
              <ListItemText
                primary={item.dia}
                primaryTypographyProps={{
                  variant: "body1",
                  fontWeight: 500
                }}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={item.abierto ? "Abierto" : "Cerrado"}
                      size="small"
                      color={item.abierto ? "success" : "default"}
                      sx={{ height: 20 }}
                    />
                    <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {item.horario}
                    </Box>
                  </Box>
                }
                secondaryTypographyProps={{
                  component: "span"
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="caption" component="div" color="text.secondary">
            💡 Nota: Los horarios mostrados son de ejemplo. Próximamente se integrarán con la API de Google Places para obtener información actualizada automáticamente.
          </Typography>
        </Box>
      </JumboCard>
    </>
  );
};
