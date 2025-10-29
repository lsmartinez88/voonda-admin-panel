
import { ConnectNullLineChart } from "@/components/charts/line/ConnectNullLinChart";
import { CustomizedDotLineChart } from "@/components/charts/line/CustomizedDotLineChart";
import { DashedLineChart } from "@/components/charts/line/DashedLineChart";
import { ReferenceLineChart } from "@/components/charts/line/ReferenceLineChart";
import { SimpleLineChart } from "@/components/charts/line/SimpleLineChart";
import { SynchronizedLineChart } from "@/components/charts/line/SynchronizedLineChart";
import { VerticalLineChart } from "@/components/charts/line/VerticalLineChart";
import { XAxisPaddingLineChart } from "@/components/charts/line/XAxisPaddingLineChart";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const LineChartPage = () => {
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
        {t("modules.title.lineChart")}
      </Typography>
      <Stack spacing={3}>
        <SimpleLineChart />
        <VerticalLineChart />
        <CustomizedDotLineChart />
        <DashedLineChart />
        <ReferenceLineChart />
        <XAxisPaddingLineChart />
        <ConnectNullLineChart />
        <SynchronizedLineChart />
      </Stack>
    </Container>
  );
};

export default LineChartPage;
