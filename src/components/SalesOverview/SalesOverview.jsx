import { JumboCard } from "@jumbo/components";
import { Button, Stack } from "@mui/material";
import React from "react";
import { ChartSalesOverview } from "./ChartSalesOverview";
import { salesChartData } from "./data";
import PropTypes from "prop-types";

function SalesOverview({ title }) {
  const [chartData, setChartData] = React.useState(salesChartData.monthly);
  return (
    <JumboCard
      title={title}
      action={
        <Stack direction={"row"} spacing={1}>
          <Button
            size={"small"}
            variant={"contained"}
            onClick={() => setChartData(salesChartData.monthly)}
          >
            Monthly
          </Button>
          <Button
            size={"small"}
            variant={"contained"}
            onClick={() => setChartData(salesChartData.yearly)}
          >
            Yearly
          </Button>
        </Stack>
      }
    >
      <ChartSalesOverview data={chartData} />
    </JumboCard>
  );
}

export { SalesOverview };

SalesOverview.propTyeps = {
  title: PropTypes.node.isRequired,
};
