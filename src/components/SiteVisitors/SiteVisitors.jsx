import { JumboCard } from "@jumbo/components";
import Grid from "@mui/material/Grid2";
import { countryList } from "./data";
import PropTypes from "prop-types";
import { VisitorsOnMap } from "./VisitorsOnMap";
import { CountriesList } from "./CountriesList";

const SiteVisitors = ({ title, subheader }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      contentSx={{ p: 3 }}
      contentWrapper
    >
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, md: 5 }}>
          <CountriesList countries={countryList} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <VisitorsOnMap />
        </Grid>
      </Grid>
    </JumboCard>
  );
};

export { SiteVisitors };

SiteVisitors.propTyeps = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
