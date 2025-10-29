import { CardIconText } from "@jumbo/shared/CardIconText";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

export const RevenuesCard = ({ subTitle }) => {
  return (
    <CardIconText
      icon={<AccountBalanceWalletRoundedIcon fontSize="large" />}
      title={
        <Typography variant={"h4"} color={"secondary.main"}>
          29,380
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"secondary.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};

RevenuesCard.propTypes = {
  subTitle: PropTypes.node,
};
