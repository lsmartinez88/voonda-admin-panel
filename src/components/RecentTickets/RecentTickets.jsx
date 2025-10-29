import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { RecentTicketsList } from "./RecentTicketsList";
import PropTypes from "prop-types";

const RecentTickets = ({ title }) => {
  return (
    <JumboCard title={title} contentWrapper contentSx={{ p: 0 }}>
      <JumboScrollbar autoHeight autoHeightMin={284}>
        <RecentTicketsList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { RecentTickets };
RecentTickets.propTyeps = {
  title: PropTypes.node.isRequired,
};
