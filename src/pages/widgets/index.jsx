import { AyurvedaCard } from "@/components/AyurvedaCard";
import { CityBgCard } from "@/components/CityBgCard";
import { CryptoNews } from "@/components/CryptoNews";
import { CurrencyCalculator } from "@/components/CurrencyCalculator";
import { CurrentProjectsList } from "@/components/CurrentProjectsList";
import { DailyFeed } from "@/components/DailyFeed";
import { EarningExpenses } from "@/components/EarningExpenses";
import { EventInviteConfirmCard } from "@/components/EventInviteConfirmCard";
import { ExplorePlaceCard } from "@/components/ExplorePlaceCard";
import { FeaturedCard1 } from "@/components/FeaturedCard1";
import { FlyingBird } from "@/components/FlyingBird";
import { GoogleNest } from "@/components/GoogleNest";
import { LatestPosts } from "@/components/LatestPosts";
import { MarketingCampaign } from "@/components/MarketingCampaign";
import { NewConnections } from "@/components/NewConnections";
import { NewsPhotos } from "@/components/NewPhotos";
import { NewRequests } from "@/components/NewRequests";
import { NewsLetterSubscription } from "@/components/NewsLetterSubscription";
import { OurOffice } from "@/components/OurOffice";
import { PortfolioBalance } from "@/components/PortfolioBalance";
import { ProductImage } from "@/components/ProductImage";
import { ProjectCard } from "@/components/ProjectCard";
import { RecentActivities } from "@/components/RecentActivities";
import { SiteVisitors } from "@/components/SiteVisitors";
import { Summary } from "@/components/Summary";
import { TaskListExpandable } from "@/components/TaskListExpandable";
import { UpgradePlan } from "@/components/UpgradePlan";
import { UserProfileAction } from "@/components/UserProfileAction";
import { UserProfileCard1 } from "@/components/UserProfileCard1";
import { WeeklySales } from "@/components/WeeklySales";
import { WordOfTheDay } from "@/components/WordOfTheDay";
import { WordOfTheDay1 } from "@/components/WordOfTheDay1";
import { YourCurrentPlan } from "@/components/YourCurrentPlan";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { EmojiObjectsOutlined, FolderOpen } from "@mui/icons-material";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

export function WidgetsPage() {
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
        <Grid size={{ xs: 12, md: 6 }}>
          <PortfolioBalance title={t("widgets.title.cryptoPortfolio")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EarningExpenses />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AyurvedaCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewConnections
            title={t("widgets.title.newConnections")}
            scrollHeight={296}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProjectCard title={t("widgets.title.projectSummary")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewsLetterSubscription
            title={t("widgets.title.newsLetter")}
            subheader={t("widgets.subheader.newsLetter")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewsPhotos />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <FlyingBird
            title={t("widgets.title.flyingBird")}
            subheader={t("widgets.subheader.flyingBird")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OurOffice title={t("widgets.title.ourOffice")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CurrencyCalculator title={t("widgets.title.currencyCal")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WordOfTheDay1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Summary />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ProductImage height={320} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExplorePlaceCard height={400} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EventInviteConfirmCard
            title={t("widgets.title.eventInvite")}
            subheader={t("widgets.title.eventInvite")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <UserProfileCard1 />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <GoogleNest title={t("widgets.title.googleNest")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <YourCurrentPlan title={t("widgets.title.yourCurrentPlan")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={3.75}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeaturedCard1
                title={"23"}
                subheader="Ideas"
                icon={<EmojiObjectsOutlined sx={{ fontSize: 42 }} />}
                bgcolor={["135deg", "#FBC79A", "#D73E68"]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeaturedCard1
                title={"250"}
                subheader="Docs"
                icon={<FolderOpen sx={{ fontSize: 36 }} />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CityBgCard />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <WeeklySales
            title={t("widgets.title.weeklySales")}
            subheader={t("widgets.subheader.weeklySales")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LatestPosts
            title={t("widgets.title.latestPosts")}
            subheader={t("widgets.subheader.latestPosts")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MarketingCampaign
            title={t("widgets.title.marketingCampaign")}
            subheader={t("widgets.subheader.marketingCampaign")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrentProjectsList
            title={t("widgets.title.currentProjects")}
            subheader={t("widgets.subheader.currentProjects")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NewRequests
            title={t("widgets.title.newRequests")}
            subheader={t("widgets.subheader.newRequests")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivities
            title={t("widgets.title.recentActivities")}
            scrollHeight={304}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TaskListExpandable
            title={t("widgets.title.taskList")}
            subheader={t("widgets.subheader.taskListExpandable")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DailyFeed title={t("widgets.title.dailyFeed")} scrollHeight={398} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <UpgradePlan />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WordOfTheDay title={t("widgets.title.wordOfTheDay")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <UserProfileAction />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SiteVisitors
            title={t("widgets.title.siteVisitors")}
            subheader={t("widgets.subheader.siteVisitors")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CryptoNews title={t("widgets.title.cryptoNews")} />
        </Grid>
      </Grid>
    </Container>
  );
}
