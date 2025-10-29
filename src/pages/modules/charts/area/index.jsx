
import { ConnectNullAreaChart } from "@/components/charts/area/ConnectNullAreaChart";
import { PercentAreaChart } from "@/components/charts/area/PercentAreaChart";
import { SimpleAreaChart } from "@/components/charts/area/SimpleAreaChart";
import { StackedAreaChart } from "@/components/charts/area/StackedAreaChart";
import { SynchronizedAreaChart } from "@/components/charts/area/SynchronizedAreaChart";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const AreaChartPage = () => {
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
        {t("modules.title.areaChart")}
      </Typography>
      <Stack spacing={3}>
        <SimpleAreaChart />
        <StackedAreaChart />
        <ConnectNullAreaChart />
        <SynchronizedAreaChart />
        <PercentAreaChart />
      </Stack>
    </Container>
  );
};

export default AreaChartPage;
