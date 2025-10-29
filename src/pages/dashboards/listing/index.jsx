import { Cities } from "@/components/Cities";
import { Properties } from "@/components/Properties";
import { QueriesStatistics } from "@/components/QueriesStatistics";
import { VisitsStatistics } from "@/components/VisitsStatistics";
import { DealsClosed } from "@/components/DealsClosed";
import { PopularAgents } from "@/components/PopularAgents";
import { PropertiesList } from "@/components/PropertiesList";
import { RecentActivities1 } from "@/components/RecentActivities1";
import { YourCurrentPlan } from "@/components/YourCurrentPlan";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

export default function ListingPage() {
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
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Properties title={t("widgets.title.properties")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Cities title={t("widgets.title.cities")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <VisitsStatistics title={t("widgets.title.onlineVisits")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <QueriesStatistics title={t("widgets.title.onlineQueries")} />
        </Grid>
        <Grid size={12}>
          <PopularAgents title={t("widgets.title.popularAgents")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <YourCurrentPlan title={t("widgets.title.yourCurrentPlan")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DealsClosed
            title={t("widgets.title.dealsClosed")}
            subheader={t("widgets.subheader.dealsClosed")}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PropertiesList title={t("widgets.title.properties")} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivities1
            title={t("widgets.title.recentActivities")}
            scrollHeight={556}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
