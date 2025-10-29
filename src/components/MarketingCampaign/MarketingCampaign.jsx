import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { Article, Refresh } from "@mui/icons-material";
import { Chip } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { CampaignsList } from "./CampaignsList";

const MarketingCampaign = ({ title, subheader, scrollHeight }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={
        <React.Fragment>
          <Chip label={"Today"} size={"small"} sx={{ mr: 1 }} />
          <JumboDdMenu
            menuItems={[
              {
                icon: <Refresh sx={{ fontSize: 20 }} />,
                title: "Refresh",
                slug: "refresh",
              },
              {
                icon: <Article sx={{ fontSize: 20 }} />,
                title: "All campaigns",
                slug: "articles",
              },
            ]}
          />
        </React.Fragment>
      }
      contentWrapper={true}
      contentSx={{ p: 0 }}
    >
      <JumboScrollbar
        autoHeight
        autoHeightMin={scrollHeight ? scrollHeight : 356}
      >
        <CampaignsList />
      </JumboScrollbar>
    </JumboCard>
  );
};

export { MarketingCampaign };

MarketingCampaign.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
