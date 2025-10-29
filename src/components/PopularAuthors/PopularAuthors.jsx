import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { AuthorsList } from "./AuthorsList";
import PropTypes from "prop-types";

const PopularAuthors = ({ title, subheader, scrollHeight }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      headerSx={{ borderBottom: 1, borderBottomColor: "divider" }}
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 366}
      >
        <AuthorsList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { PopularAuthors };

PopularAuthors.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
