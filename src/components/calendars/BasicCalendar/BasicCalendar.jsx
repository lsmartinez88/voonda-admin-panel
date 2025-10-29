import { currentYear } from "@/utilities/constants/data";
import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import "moment/locale/en-in";
import "moment/locale/es";
import "moment/locale/fr";
import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { events } from "../data";
const localizer = momentLocalizer(moment);

const BasicCalendar = () => {
  const [date, setDate] = React.useState(new Date(currentYear, 1, 15));
  const [viewOption, setViewOption] = React.useState(Views.MONTH);
  const { views } = React.useMemo(
    () => ({
      views: {
        month: true,
        week: true,
      },
    }),
    []
  );
  return (
    <Calendar
      date={date}
      localizer={localizer}
      events={events}
      style={{ height: 600 }}
      culture={"en"}
      view={viewOption}
      views={views}
      onView={(option) => setViewOption(option)}
      onNavigate={(newDate) => setDate(newDate)}
    />
  );
};

export { BasicCalendar };
