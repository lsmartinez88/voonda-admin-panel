import { JumboCard } from "@jumbo/components";
import { Typography } from "@mui/material";
import { OrdersReportChart } from "./OrdersReportChart";
import PropTypes from "prop-types";

const OrdersReport = ({ title, subheader, chartHeight, subTitle }) => {
  return (
    <JumboCard
      title={
        <Typography variant={"h4"} mb={0}>
          {title}
        </Typography>
      }
      subheader={subTitle === null ? subTitle : subheader}
      sx={{ textAlign: "center" }}
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      <OrdersReportChart height={chartHeight} />
    </JumboCard>
  );
};

export { OrdersReport };

OrdersReport.propTypes = {
  chartHeight: PropTypes.number,
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  subTitle: PropTypes.string,
};
