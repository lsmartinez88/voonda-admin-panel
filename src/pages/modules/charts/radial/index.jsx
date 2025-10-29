
import { SimpleRadialChart } from "@/components/charts/radial/SimpleRadialChart";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const RadialChartPage = () => {
  const { t } = useTranslation();
  return (
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
        {t("modules.title.radialChart")}
      </Typography>
      <SimpleRadialChart />
    </Container>
  );
};

export default RadialChartPage;
