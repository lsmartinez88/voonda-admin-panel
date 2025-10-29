import { ActiveUsers } from "@/components/ActiveUsers";
import { CreditScore } from "@/components/CreditScore";
import { EmailCampaign } from "@/components/EmailCampaign";

import { OnlineSignups } from "@/components/OnlineSignups";
import { Orders } from "@/components/Orders";
import { PageViews } from "@/components/PageViews";
import { RevenueThisYear } from "@/components/RevenueThisYear";
import { Stocks } from "@/components/Stocks";
import { TrafficAnalysis } from "@/components/TrafficAnalysis";
import { AvgDailyTraffic } from "@/components/AvgDailyTraffic";
import { LastMonthSales } from "@/components/LastMonthSales";
import { NewAuthors } from "@/components/NewAuthors";
import { NewSubscribers } from "@/components/NewSubscribers";
import { NewVisitorsThisMonth } from "@/components/NewVisitorsThisMonth";
import { NewArticles } from "@/components/NewsArticles";
import { OnlineSignupsFilled } from "@/components/OnlineSignupsFilled";
import { OrdersReport } from "@/components/OrdersReport";
import { SalesReport } from "@/components/SalesReport";
import { TotalRevenueThisYear } from "@/components/TotalRevenueThisYear";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import { OrdersCard } from "@/components/OrdersCard";
import { RevenuesCard } from "@/components/RevenuesCard";
import { QueriesCard } from "@/components/QueriesCard";
import { VisitsCard } from "@/components/VisitsCard";

export default function MetricsPage() {
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
          <LastMonthSales subheader={t("widgets.subheader.latestMonthSales")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OnlineSignupsFilled
            subheader={t("widgets.subheader.onlineSignups")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <NewVisitorsThisMonth
            subheader={t("widgets.subheader.newVisitors")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TotalRevenueThisYear
            subheader={t("widgets.subheader.totalRevenueYear")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OrdersReport
            title={t("widgets.title.orderReports")}
            subheader={t("widgets.subheader.orderReports")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CreditScore
            title={t("widgets.title.creditScore")}
            subheader={t("widgets.subheader.creditScore")}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TrafficAnalysis
            title={t("widgets.title.trafficAnalysis")}
            subheader={t("widgets.subheader.trafficAnalysis")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OrdersCard
            vertical={true}
            subTitle={t("widgets.subheader.objectCountOrders")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RevenuesCard
            subTitle={t("widgets.subheader.objectCountRevenues")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <VisitsCard
            subTitle={t("widgets.subheader.objectCountVisits")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <QueriesCard
            subTitle={t("widgets.subheader.objectCountQueries")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OnlineSignups subheader={t("widgets.subheader.onlineSignups1")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <RevenueThisYear subheader={t("widgets.subheader.revenueThisYear")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EmailCampaign subheader={t("widgets.subheader.emailCampaign")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AvgDailyTraffic subheader={t("widgets.subheader.avgDailyTraffic")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewSubscribers subheader={t("widgets.subheader.newSubscribers")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewAuthors subheader={t("widgets.subheader.newAuthors")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <NewArticles subheader={t("widgets.subheader.newArticles")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <SalesReport title={t("widgets.title.salesReports")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ActiveUsers subheader={t("widgets.subheader.activeUsers")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <PageViews title={t("widgets.title.pageViews")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Orders title={t("widgets.title.orders1")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Stocks title={t("widgets.title.stock")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <OrdersCard
            vertical={true}
            subTitle={t("widgets.subheader.objectCountOrders")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RevenuesCard
            subTitle={t("widgets.subheader.objectCountRevenues")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <VisitsCard
            subTitle={t("widgets.subheader.objectCountVisits")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <QueriesCard
            subTitle={t("widgets.subheader.objectCountQueries")}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
