import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";
import { CommentsList } from "./CommentsList";

const Comments = ({ title, scrollHeight }) => {
  return (
    <JumboCard
      title={title}
      action={
        <Chip label={"8 New Comments"} color={"primary"} size={"small"} />
      }
      headerSx={{ borderBottom: 1, borderBottomColor: "divider" }}
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 460}
      >
        <CommentsList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { Comments };

Comments.propTypes = {
  title: PropTypes.node,
  scrollHeight: PropTypes.number,
};
