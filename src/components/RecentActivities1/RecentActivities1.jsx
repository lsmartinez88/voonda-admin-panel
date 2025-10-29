import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { RecentActivitiesList } from "./RecentActivitiesList";
import PropTypes from "prop-types";
const RecentActivities1 = ({ title, scrollHeight }) => {
  return (
    <JumboCard title={title} contentWrapper contentSx={{ p: 0 }}>
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 480}
      >
        <RecentActivitiesList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { RecentActivities1 };

RecentActivities1.propTyeps = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
