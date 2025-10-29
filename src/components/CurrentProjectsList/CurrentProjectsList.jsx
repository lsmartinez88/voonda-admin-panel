import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { Chip } from "@mui/material";
import { ProjectsList } from "./ProjectsList";
import PropTypes from "prop-types";

const CurrentProjectsList = ({ title, subheader, scrollHeight }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={<Chip color={"warning"} label={"This week"} size={"small"} />}
      headerSx={{ borderBottom: 1, borderBottomColor: "divider" }}
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 356}
      >
        <ProjectsList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { CurrentProjectsList };

CurrentProjectsList.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node,
  scrollHeight: PropTypes.number,
};
