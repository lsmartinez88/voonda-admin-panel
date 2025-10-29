
import { CalendarWrapper } from "@/components/calendars/CalendarWrapper";
import { RenderingCalendar } from "@/components/calendars/RenderingCalendar";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { JumboCard } from "@jumbo/components/JumboCard";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function RenderingCalendarPage() {
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
        {t("modules.title.renderingCalendar")}
      </Typography>

      <JumboCard contentWrapper>
        <CalendarWrapper>
          <RenderingCalendar />
        </CalendarWrapper>
      </JumboCard>
    </Container>
  );
}
