import { FeedInvitation } from "@/components/FeedInvitation";
import { FeedPhotoUpload } from "@/components/FeedPhotoUpload";
import { FeedSharedPost } from "@/components/FeedSharedPost";


const FeedComponents = {
  PROJECT_INVITATION: FeedInvitation,
  PHOTOS_UPLOADED: FeedPhotoUpload,
  SHARED_POST: FeedSharedPost,
};

const FeedItem = ({ feed }) => {
  const FeedComponent = FeedComponents[feed.type];
  return <FeedComponent feed={feed} />;
};

export { FeedItem };
