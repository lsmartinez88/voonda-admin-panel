import { JumboCard } from "@jumbo/components";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";
import { RevenueProgress } from "./RevenueProgress";
import { RevenueInfo } from "./RevenueInfo";
import { VisitorsOnMap } from "../SiteVisitors/VisitorsOnMap";

const RevenueOverview = ({ title }) => {
  return (
    <JumboCard title={title}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <RevenueProgress />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, lg: 3 }}
          sx={{
            order: { lg: 3 },
            mb: { lg: -3 },
            mt: { sm: -7 },
          }}
        >
          <RevenueInfo />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <VisitorsOnMap />
        </Grid>
      </Grid>
    </JumboCard>
  );
};

export { RevenueOverview };

RevenueOverview.propTyeps = {
  title: PropTypes.node.isRequired,
};
