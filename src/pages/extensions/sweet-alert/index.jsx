
import { AdvancedAlert } from "@/components/sweet-alerts/AdvancedAlert";
import { AlertsType } from "@/components/sweet-alerts/AlertsType";
import { AnimationAlert } from "@/components/sweet-alerts/AnimationAlert";
import { AutoCloseAlert } from "@/components/sweet-alerts/AutoCloseAlert";
import { BasicAlert } from "@/components/sweet-alerts/BasicAlert";
import { CustomHtmlMessage } from "@/components/sweet-alerts/CustomHtmlMessage";
import { CustomPosition } from "@/components/sweet-alerts/CustomPosition";
import { DialogThreeButton } from "@/components/sweet-alerts/DialogThreeButton";
import { ErrorAlert } from "@/components/sweet-alerts/ErrorAlert";
import { ImageWithMessage } from "@/components/sweet-alerts/ImageWithMessage";
import { SuccessAlert } from "@/components/sweet-alerts/SuccessAlert";
import { TitleWithText } from "@/components/sweet-alerts/TitleWithText";
import { ToastAlerts } from "@/components/sweet-alerts/ToastAlerts";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";

export default function SweetAlertsPage() {
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
        {t("extensions.title.sweetAlerts")}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BasicAlert />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnimationAlert />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TitleWithText />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DialogThreeButton />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SuccessAlert />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ErrorAlert />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ImageWithMessage />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomHtmlMessage />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomPosition />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AutoCloseAlert />
        </Grid>
        <Grid size={12}>
          <AdvancedAlert />
        </Grid>
        <Grid size={12}>
          <ToastAlerts />
        </Grid>
        <Grid size={12}>
          <AlertsType />
        </Grid>
      </Grid>
    </Container>
  );
}
