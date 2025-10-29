import { JumboCard } from "@jumbo/components";
import PropTypes from "prop-types";
import { TrafficAnalysisChart } from "./TrafficAnalysisChart";

const TrafficAnalysis = ({ title, subheader }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      sx={{
        textAlign: "center",
      }}
      contentWrapper
    >
      <TrafficAnalysisChart />
    </JumboCard>
  );
};

export { TrafficAnalysis };

TrafficAnalysis.propTypes = {
  title: PropTypes.node,
  subheader: PropTypes.node,
};
