import { CurrencyCalculator } from "@/components/CurrencyCalculator";
import { CurrentProjectsList } from "@/components/CurrentProjectsList";
import { FilesCounterCard } from "@/components/FilesCounterCard/FilesCounterCard";
import { Growth } from "@/components/Growth";
import { NewCustomers } from "@/components/NewCustomers";
import { ProjectCounterCard } from "@/components/ProjectCounterCard";
import { RecentActivities1 } from "@/components/RecentActivities1";
import { RecentTickets } from "@/components/RecentTickets";
import { RevenueHistory } from "@/components/RevenueHistory";
import { RevenueOverview } from "@/components/RevenueOverview";
import { TasksCounterCard } from "@/components/TaskCounterCard";
import { TasksList2 } from "@/components/TasksList2";
import { TeamsCounterCard } from "@/components/TeamsCounterCard";
import { TicketsStatus } from "@/components/TicketsStatus";
import { WelcomeSummary } from "@/components/WelcomSummary";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

export default function CrmPage() {
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
      <Grid container spacing={3.5}>
        <Grid size={12}>
          <WelcomeSummary title={t("widgets.title.welcomeEMA")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <RevenueHistory title={t("widgets.title.revenueHistory")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <NewCustomers title={t("widgets.title.newCustomer")} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Growth title={t("widgets.title.growth")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <ProjectCounterCard subheader={t("widgets.subheader.projects")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TasksCounterCard subheader={t("widgets.subheader.tasks")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TeamsCounterCard subheader={t("widgets.subheader.teams")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <FilesCounterCard subheader={t("widgets.subheader.files")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TasksList2 scrollHeight={373} title={t("widgets.title.taskList")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrentProjectsList
            title={t("widgets.title.currentProjects")}
            subheader={t("widgets.subheader.currentProjects")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <RecentTickets title={t("widgets.title.recentTicket")} />
        </Grid>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <TicketsStatus title={t("widgets.title.ticketStatus")} />
        </Grid>
        <Grid size={12}>
          <RevenueOverview title={t("widgets.title.revenueOverview")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivities1
            title={t("widgets.title.recentActivities")}
            scrollHeight={306}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CurrencyCalculator title={t("widgets.title.currencyCal")} />
        </Grid>
      </Grid>
    </Container>
  );
}
