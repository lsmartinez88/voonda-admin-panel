import { List } from "@mui/material";

import { ProjectItem } from "../ProjectItem";

const ProjectList = ({ data }) => {
  return (
    <List disablePadding>
      {data.map((project, index) => (
        <ProjectItem key={index} project={project} />
      ))}
    </List>
  );
};

export default ProjectList;
