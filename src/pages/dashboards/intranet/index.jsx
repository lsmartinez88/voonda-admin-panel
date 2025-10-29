import { Orders } from "@/components/Orders";
import { PageViews } from "@/components/PageViews";
import { Visits } from "@/components/Visits";
import { CurrentProjectsList } from "@/components/CurrentProjectsList";
import { DailyFeed } from "@/components/DailyFeed";
import { HeaderChart } from "@/components/HeaderChart";
import { LatestNotifications } from "@/components/LatestNotifications";
import { MarketingCampaign } from "@/components/MarketingCampaign";
import { PopularArticles } from "@/components/PopularArticles";
import { PopularProducts } from "@/components/PopularProducts";
import { RecentActivities } from "@/components/RecentActivities";
import { TaskListExpandable } from "@/components/TaskListExpandable";
import { UserPhotos } from "@/components/UserPhotos";
import { UserProfileCard1 } from "@/components/UserProfileCard1";
import { WeeklySales } from "@/components/WeeklySales";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useTranslation } from "react-i18next";
import { MapProvider } from "@/components/maps/MapProvider";
import { MarkerClustererMap } from "@/components/maps/MarkerClustererMap";

export default function IntranetPage() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <HeaderChart title={t("widgets.title.intranet")} />
      <Container
        maxWidth={false}
        sx={{
          maxWidth: CONTAINER_MAX_WIDTH,
        }}
        disableGutters
      >
        <Grid container spacing={3.75}>
          <Grid size={12}>
            <Grid container spacing={3.75}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Grid container spacing={3.75}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <PageViews title={t("widgets.title.pageViews")} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Orders title={t("widgets.title.orders1")} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Visits title={t("widgets.title.visits")} />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <UserProfileCard1 />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <PopularArticles
              title={t("widgets.title.popularArticles")}
              scrollHeight={423}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentActivities
              title={t("widgets.title.recentActivities")}
              scrollHeight={342}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CurrentProjectsList
              title={t("widgets.title.currentProjects")}
              subheader={t("widgets.subheader.currentProjects")}
              scrollHeight={341}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DailyFeed
              title={t("widgets.title.dailyFeed")}
              scrollHeight={400}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TaskListExpandable
              title={t("widgets.title.taskListExpandable")}
              subheader={t("widgets.subheader.taskListExpandable")}
              scrollHeight={395}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <MarketingCampaign
              title={t("widgets.title.marketingCampaign")}
              subheader={t("widgets.subheader.marketingCampaign")}
              scrollHeight={428}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <LatestNotifications
              title={t("widgets.title.latestNotifications")}
              scrollHeight={387}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <WeeklySales
              title={t("widgets.title.weeklySales")}
              subheader={t("widgets.subheader.weeklySales")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserPhotos title={t("widgets.title.pictures")} />
          </Grid>
          <Grid size={12}>
            <MapProvider>
              <MarkerClustererMap />
            </MapProvider>
          </Grid>
          <Grid size={12}>
            <PopularProducts
              title={t("widgets.title.popularProducts")}
              subheader={t("widgets.subheader.popularProducts")}
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
