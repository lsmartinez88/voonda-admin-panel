import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import { List } from "@mui/material";

import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { SocialMediaButtons } from "./SocialMediaButtons";
import { branches } from "./data";
import PropTypes from "prop-types";
import { IconLabelListItem } from "@/components/IconLabelListItem";

const OurOffice1 = ({ title }) => {
  const activeBranch = branches[0];
  return (
    <JumboCard title={title}>
      <Div>
        <List disablePadding>
          <IconLabelListItem
            alignItems="flex-start"
            icon={<LocationOnIcon />}
            text={activeBranch.address}
          />
          <IconLabelListItem icon={<PhoneIcon />} text={activeBranch.phone} />
          <IconLabelListItem
            icon={<MailOutlineIcon />}
            text={activeBranch.email}
          />
        </List>
        <SocialMediaButtons />
      </Div>
    </JumboCard>
  );
};

export { OurOffice1 };

OurOffice1.propTypes = {
  title: PropTypes.node.isRequired,
};
