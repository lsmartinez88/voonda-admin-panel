
import { AxisLabelsComposedChart } from "@/components/charts/composed/AxisLabelsComposedChart";
import { LineBarAreaComposedChart } from "@/components/charts/composed/LineBarAreaComposedChart";
import { SameDataComposedChart } from "@/components/charts/composed/SameDataComposedChart";
import { VerticalComposedChart } from "@/components/charts/composed/VerticalComposedChart";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ComposedChartPage = () => {
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
        {t("modules.title.composedChart")}
      </Typography>
      <Stack spacing={3}>
        <AxisLabelsComposedChart />
        <VerticalComposedChart />
        <SameDataComposedChart />
        <LineBarAreaComposedChart />
      </Stack>
    </Container>
  );
};

export default ComposedChartPage;
