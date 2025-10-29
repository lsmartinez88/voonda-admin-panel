import { JumboCard, JumboScrollbar } from "@jumbo/components";
import ProjectList from "./ProjectsList/ProjectsList";
import { projects } from "./data";
import PropTypes from "prop-types";

const ProjectsListCard = ({ title, scrollHeight }) => {
  return (
    <JumboCard title={title} contentSx={{ p: 0 }} contentWrapper>
      <JumboScrollbar autoHeight autoHeightMin={392}>
        <ProjectList data={projects} />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { ProjectsListCard };

ProjectsListCard.propTypes = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
