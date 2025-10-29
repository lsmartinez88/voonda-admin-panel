
import List from "@mui/material/List";
import React from "react";
import { ListHeader } from "../ListHeader";
import { Link } from "@jumbo/shared";
import PropTypes from "prop-types";
import { FeedInvitation } from "@/components/FeedInvitation";
import { FeedPhotoUpload } from "@/components/FeedPhotoUpload";
import { FeedSharedPost } from "@/components/FeedSharedPost";

const feedTypes = {
  PROJECT_INVITATION: FeedInvitation,
  PHOTOS_UPLOADED: FeedPhotoUpload,
  SHARED_POST: FeedSharedPost,
};

const FeedsList = ({ count, notifications, noHeader = true }) => {
  return (
    <React.Fragment>
      {!noHeader && (
        <ListHeader title="FEEDS" count={count} action={<Link>SEE ALL</Link>} />
      )}
      <List disablePadding>
        {notifications.map((item) => {
          const FeedItemComponent = feedTypes[item.type];
          return <FeedItemComponent key={`feed-${item.id}`} feed={item} />;
        })}
      </List>
    </React.Fragment>
  );
};

export { FeedsList };

FeedsList.propTypes = {
  count: PropTypes.number,
  notifications: PropTypes.array,
  noHeader: PropTypes.bool,
};
