
import { KmlLayerMap } from "@/components/maps/KmlLayerMap";
import { MapProvider } from "@/components/maps/MapProvider";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export default function KmLayerMapPage() {
  const { t } = useTranslation();
  return (
    <MapProvider>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: CONTAINER_MAX_WIDTH,
          display: "flex",
          minWidth: 0,
          flex: 1,
          flexDirection: "column",
        }}
        disableGutters
      >
        <Typography variant={"h1"} mb={3}>
          {t("modules.title.kmlLayerMap")}
        </Typography>
        <KmlLayerMap />
      </Container>
    </MapProvider>
  );
}
