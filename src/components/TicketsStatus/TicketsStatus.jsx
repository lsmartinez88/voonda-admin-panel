import { JumboCard } from "@jumbo/components";
import { TicketsStatusChart } from "./TicketsStatusChart";
import PropTypes from "prop-types";

const TicketsStatus = ({ title }) => {
  return (
    <JumboCard
      title={title}
      sx={{ textAlign: "center" }}
      contentWrapper
      contentSx={{
        px: 3,
        pt: 2,
        "&:last-child": {
          pb: 6.5,
        },
      }}
    >
      <TicketsStatusChart />
    </JumboCard>
  );
};

export { TicketsStatus };

TicketsStatus.propTyeps = {
  title: PropTypes.node.isRequired,
};
