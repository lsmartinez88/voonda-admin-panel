import { AvgDailyTraffic } from "@/components/AvgDailyTraffic";
import { Comments } from "@/components/Comments";
import { DailyFeed } from "@/components/DailyFeed";
import { LatestNotifications } from "@/components/LatestNotifications";
import { MarketingCampaign } from "@/components/MarketingCampaign";
import { NewAuthors } from "@/components/NewAuthors";
import { NewSubscribers } from "@/components/NewSubscribers";
import { NewArticles } from "@/components/NewsArticles";
import { PopularArticles } from "@/components/PopularArticles";
import { PopularAuthors } from "@/components/PopularAuthors";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

export default function NewsPage() {
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
          <NewSubscribers subheader={t("widgets.subheader.newSubscribers")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewArticles subheader={t("widgets.subheader.newArticles")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewAuthors subheader={t("widgets.subheader.newAuthors")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <AvgDailyTraffic subheader={t("widgets.subheader.avgDailyTraffic")} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <PopularAuthors
            title={t("widgets.title.popularAuthors")}
            subheader={t("widgets.subheader.popularAuthors")}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <PopularArticles title={t("widgets.title.popularArticles")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LatestNotifications title={t("widgets.title.latestNotifications")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DailyFeed title={t("widgets.title.dailyFeed")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Comments title={t("widgets.title.comments")} scrollHeight={450} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MarketingCampaign
            title={t("widgets.title.marketingCampaign")}
            subheader={t("widgets.subheader.marketingCampaign")}
            scrollHeight={430}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
