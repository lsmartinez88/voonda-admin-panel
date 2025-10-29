import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { Chip } from "@mui/material";
import { ActivitiesList } from "./ActivitiesList";
import PropTypes from "prop-types";

function RecentActivities({ title, scrollHeight }) {
  return (
    <JumboCard
      title={title}
      action={<Chip color={"warning"} size={"small"} label={"Last 20 days"} />}
      contentWrapper={true}
      contentSx={{ px: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 278}
      >
        <ActivitiesList />
      </JumboScrollbar>
    </JumboCard>
  );
}

export { RecentActivities };

RecentActivities.propTyeps = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
