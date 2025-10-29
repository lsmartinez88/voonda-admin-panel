import { JumboCard } from "@jumbo/components";
import { Typography } from "@mui/material";
import { ChartWebsiteTraffic } from "./ChartWebsiteTraffic";
import PropTypes from "prop-types";

const WebsiteTraffic = ({ title }) => {
  return (
    <JumboCard
      title={
        <Typography variant={"h4"} mb={0}>
          {title}
        </Typography>
      }
      sx={{ textAlign: "center" }}
    >
      <ChartWebsiteTraffic />
    </JumboCard>
  );
};

export { WebsiteTraffic };

WebsiteTraffic.propTypes = {
  title: PropTypes.node,
};
