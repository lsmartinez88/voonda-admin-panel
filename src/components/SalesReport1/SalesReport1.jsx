import { JumboCard } from "@jumbo/components";
import { Chip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { SalesReportChart1 } from "./SalesReportChart1";

const SalesReport1 = ({ title }) => {
  return (
    <JumboCard
      title={
        <Typography variant={"h4"} mb={0}>
          {title}
        </Typography>
      }
      action={<Chip label={"Today"} color={"primary"} size={"small"} />}
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      <Typography variant={"h2"}>$685k+</Typography>
      <Typography variant={"body1"} color="text.secondary" mb={1.5}>
        Past 9 months data
      </Typography>
      <SalesReportChart1 />
    </JumboCard>
  );
};

export { SalesReport1 };

SalesReport1.propTyeps = {
  title: PropTypes.node.isRequired,
};
