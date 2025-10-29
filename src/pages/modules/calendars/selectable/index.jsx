
import { CalendarWrapper } from "@/components/calendars/CalendarWrapper";
import { SelectableCalendar } from "@/components/calendars/SelectableCalendar";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { JumboCard } from "@jumbo/components/JumboCard";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function SelectableCalendarPage() {
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
        {t("modules.title.selectableCalendar")}
      </Typography>
      <JumboCard contentWrapper>
        <CalendarWrapper>
          <SelectableCalendar />
        </CalendarWrapper>
      </JumboCard>
    </Container>
  );
}
