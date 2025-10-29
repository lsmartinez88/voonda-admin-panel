import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { ArticlesList } from "./ArticlesList";
import { menuItems } from "./data";
import PropTypes from "prop-types";

const PopularArticles = ({ title, scrollHeight }) => {
  return (
    <JumboCard
      title={title}
      action={<JumboDdMenu menuItems={menuItems} />}
      contentWrapper
      contentSx={{ p: 0 }}
      headerSx={{ pb: 1 }}
      sx={{
        ".MuiCardHeader-action": {
          my: -0.75,
          mr: -1,
        },
      }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 395}
      >
        <ArticlesList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { PopularArticles };

PopularArticles.propTypes = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
