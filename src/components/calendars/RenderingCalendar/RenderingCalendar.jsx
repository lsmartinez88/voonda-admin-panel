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
import { calendarData } from "../data";
const { events } = calendarData;
const localizer = momentLocalizer(moment);

const Event = ({ event }) => {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.desc && ":  " + event.desc}
    </span>
  );
};

const EventAgenda = ({ event }) => {
  return (
    <span>
      <em style={{ color: "magenta" }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
};

const customDayPropGetter = (date) => {
  if (date.getDate() === 7 || date.getDate() === 15)
    return {
      style: {
        border: "solid 3px " + (date.getDate() === 7 ? "#faa" : "#afa"),
      },
    };
  else return {};
};

const RenderingCalendar = () => {
  const [date, setDate] = React.useState(new Date(currentYear, 1, 15));
  const [viewOption, setViewOption] = React.useState(Views.MONTH);
  const { components, defaultDate } = React.useMemo(
    () => ({
      components: {
        agenda: {
          event: EventAgenda,
        },
        event: Event,
      },
      defaultDate: new Date(2015, 3, 7),
    }),
    []
  );
  return (
    <Calendar
      localizer={localizer}
      events={events}
      // defaultDate={new Date(currentYear, 3, 1)}
      style={{ height: 600 }}
      components={components}
      defaultDate={defaultDate}
      defaultView={Views.AGENDA}
      dayPropGetter={customDayPropGetter}
      culture={"en"}
      view={viewOption}
      onView={(option) => setViewOption(option)}
      onNavigate={(newDate) => setDate(newDate)}
      date={date}
    />
  );
};

export { RenderingCalendar };
