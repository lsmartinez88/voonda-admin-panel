import { JumboCard } from "@jumbo/components";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Typography } from "@mui/material";
import { NewArticlesChart } from "./NewArticlesChart";
import PropTypes from "prop-types";

const NewArticles = ({ subheader }) => {
  return (
    <JumboCard
      title={<Typography variant={"h2"}>526+</Typography>}
      subheader={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subheader}
        </Typography>
      }
      action={<BookmarkIcon />}
      headerSx={{ pb: 1.25 }}
    >
      <NewArticlesChart />
    </JumboCard>
  );
};

export { NewArticles };

NewArticles.propTypes = {
  subheader: PropTypes.node.isRequired,
};
