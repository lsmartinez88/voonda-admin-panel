import React from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import IconButton from "@mui/material/IconButton";
import { JumboCard } from "@jumbo/components";
import { NewRequestsList } from "./NewRequestsList";
import { requests } from "./data";
import PropTypes from "prop-types";

const NewRequests = ({ title, subheader }) => {
  const [refreshRequests, setRefreshRequests] = React.useState(false);

  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={
        <IconButton onClick={() => setRefreshRequests(true)}>
          <AutorenewIcon />
        </IconButton>
      }
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <NewRequestsList
        refresh={refreshRequests}
        requests={requests}
        onRefreshCallback={setRefreshRequests}
      />
    </JumboCard>
  );
};

export { NewRequests };

NewRequests.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
