import { JumboCard } from "@jumbo/components";
import Grid from "@mui/material/Grid2";
import { GeneralInfo } from "./GeneralInfo";
import { SiteAudienceInfo } from "./SiteAudienceInfo";
import { SiteVisitsGraph } from "./SiteVisitsGraph";
import PropTypes from "prop-types";

const WelcomeSummary = ({ title }) => {
  return (
    <JumboCard title={title} contentWrapper contentSx={{ px: 3, pt: 1 }}>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <GeneralInfo />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ order: { lg: 3 } }}>
          <SiteAudienceInfo />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SiteVisitsGraph />
        </Grid>
      </Grid>
    </JumboCard>
  );
};

export { WelcomeSummary };

WelcomeSummary.propTypes = {
  title: PropTypes.node.isRequired,
};
