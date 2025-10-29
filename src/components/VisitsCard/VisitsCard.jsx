import { CardIconText } from "@jumbo/shared/CardIconText";
import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

export const VisitsCard = ({ subTitle }) => {
  return (
    <CardIconText
      icon={<TouchAppRoundedIcon fontSize="large" />}
      title={
        <Typography variant={"h4"} color={"success.main"}>
          2,870
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"success.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};

VisitsCard.propTypes = {
  subTitle: PropTypes.node,
};
