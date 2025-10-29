
import { BasicCalendar } from "@/components/calendars/BasicCalendar";
import { CalendarWrapper } from "@/components/calendars/CalendarWrapper";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { JumboCard } from "@jumbo/components/JumboCard";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export default function BasicCalendarPage() {
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
        {t("modules.title.basicCalendar")}
      </Typography>
      <JumboCard contentWrapper>
        <CalendarWrapper>
          <BasicCalendar />
        </CalendarWrapper>
      </JumboCard>
    </Container>
  );
}
