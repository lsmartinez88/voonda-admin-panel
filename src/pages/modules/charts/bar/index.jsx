
import { BiaxialBarChart } from "@/components/charts/bar/BiaxialBarChart";
import { CustomShapeBarChart } from "@/components/charts/bar/CustomShapeBarChart";
import { MixBarChart } from "@/components/charts/bar/MixBarChart";
import { PositiveAndNegativeBarChart } from "@/components/charts/bar/PositiveAndNegativeBarChart";
import { StackedBarChart } from "@/components/charts/bar/StackedBarChart";
import { StackedWithErrorBarChart } from "@/components/charts/bar/StackedWithErrorBarChart";
import { TinyBarChart } from "@/components/charts/bar/TinyBarChart";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const BarChartPage = () => {
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
        {t("modules.title.barChart")}
      </Typography>
      <Stack spacing={3}>
        <TinyBarChart />
        <StackedBarChart />
        <StackedWithErrorBarChart />
        <MixBarChart />
        <CustomShapeBarChart />
        <PositiveAndNegativeBarChart />
        <BiaxialBarChart />
      </Stack>
    </Container>
  );
};

export default BarChartPage;
