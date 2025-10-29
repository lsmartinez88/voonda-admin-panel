import { Button } from "@mui/material";
import { ConnectionsList } from "./ConnectionsList";
import { JumboCard, JumboScrollbar } from "@jumbo/components";
import PropTypes from "prop-types";

function NewConnections({ title, scrollHeight }) {
  return (
    <JumboCard
      title={title}
      subheader={title}
      action={
        <Button variant={"contained"} size={"small"}>
          See all
        </Button>
      }
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 278}
      >
        <ConnectionsList />
      </JumboScrollbar>
    </JumboCard>
  );
}

export { NewConnections };

NewConnections.propTypes = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
