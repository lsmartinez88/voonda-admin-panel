import { List } from "@mui/material";
import React from "react";
import { ListHeader } from "../ListHeader";
import PropTypes from "prop-types";
import { FeedMessage } from "@/components/FeedMessage";

function MessagesList({ title, count, action, notifications }) {
  return (
    <React.Fragment>
      {title && <ListHeader title={title} count={count} action={action} />}
      <List disablePadding>
        {notifications.map((item) => {
          return <FeedMessage key={`message-${item.id}`} feed={item} />;
        })}
      </List>
    </React.Fragment>
  );
}

export { MessagesList };

MessagesList.propTypes = {
  title: PropTypes.node,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  action: PropTypes.node,
  notifications: PropTypes.array, // Using any[] as notifications type
};
