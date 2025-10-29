import List from "@mui/material/List";
import React from "react";
import { ListHeader } from "../ListHeader";
import { Link } from "@jumbo/shared";
import PropTypes from "prop-types";
import { FeedInvitation } from "@/components/FeedInvitation";

const InvitationsList = ({ notifications, count, noHeader = false }) => {
  return (
    <React.Fragment>
      {!noHeader && (
        <ListHeader
          title="INVITATIONS"
          count={count}
          action={<Link>SEE ALL</Link>}
        />
      )}
      <List disablePadding>
        {notifications.map((item) => {
          return <FeedInvitation key={`invitation-${item.id}`} feed={item} />;
        })}
      </List>
    </React.Fragment>
  );
};

export { InvitationsList };

InvitationsList.propTypes = {
  noHeader: PropTypes.bool,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  notifications: PropTypes.array,
};
