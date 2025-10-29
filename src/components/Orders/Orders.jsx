import { JumboCard } from "@jumbo/components/JumboCard";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import { ChartOrders } from "./ChartOrders";
import { orders } from "./data";
import PropTypes from "prop-types";

export function Orders({ title }) {
  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0.5}>
          {title}
        </Typography>
      }
      subheader={
        <Typography variant={"h6"} color={"text.secondary"} mb={0}>
          293
        </Typography>
      }
      headerSx={{ pb: 0 }}
    >
      <Div sx={{ mt: -2.5 }}>
        <ChartOrders data={orders} />
      </Div>
    </JumboCard>
  );
}


Orders.propTypes = {
  title: PropTypes.node.isRequired,
};
