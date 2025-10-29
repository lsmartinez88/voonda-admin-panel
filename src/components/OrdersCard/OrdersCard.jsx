import { CardIconText } from "@jumbo/shared/CardIconText";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

export const OrdersCard = ({ vertical, subTitle }) => {
  return (
    <CardIconText
      icon={<ShoppingCartRoundedIcon fontSize="large" />}
      title={
        <Typography variant={"h4"} color={"primary.main"}>
          2,380
        </Typography>
      }
      subTitle={
        <Typography variant={"h6"} color={"text.secondary"}>
          {subTitle}
        </Typography>
      }
      color={"primary.main"}
      disableHoverEffect={true}
      hideArrow={true}
      variant={"outlined"}
    />
  );
};

OrdersCard.propTypes = {
  vertical: PropTypes.bool,
  subTitle: PropTypes.node,
};
