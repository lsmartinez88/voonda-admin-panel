import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { PropertiesChart } from "./PropertiesChart";

const Properties = ({ title }) => {
  return (
    <JumboCard
      title={
        <Typography
          variant={"h6"}
          mb={0}
          sx={{ fontSize: 12, color: "common.white", letterSpacing: 1.5 }}
        >
          {title}
        </Typography>
      }
      sx={{ color: "common.white" }}
      bgcolor={["#9575cd"]}
    >
      <Div
        sx={{
          p: 3,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          position: "absolute",
        }}
      >
        <Typography variant={"h2"} color={"common.white"}>
          26,873
        </Typography>
        <Typography variant={"h6"} color={"common.white"} mb={0}>
          {"03% This Week"}
        </Typography>
      </Div>
      <PropertiesChart />
    </JumboCard>
  );
};

export { Properties };

Properties.propTypes = {
  title: PropTypes.node,
};
