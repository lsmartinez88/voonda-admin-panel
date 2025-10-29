import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProjectCounterCard = ({ subheader }) => {
  return (
    <JumboCard contentWrapper contentSx={{ p: 3 }} bgcolor={["#6f42c1"]}>
      <Div sx={{ display: "flex", alignItems: "center" }}>
        <img
          alt={"Properties Icon"}
          src={`${ASSET_IMAGES}/dashboard/projectIcon.svg`}
          width={48}
          height={48}
        />
        <Div sx={{ ml: 2, flex: 1 }}>
          <Typography color={"common.white"} variant={"h2"} mb={0.5}>
            09
          </Typography>
          <Typography color={"common.white"} variant={"h5"} mb={0}>
            {subheader}
          </Typography>
        </Div>
      </Div>
    </JumboCard>
  );
};

export { ProjectCounterCard };

ProjectCounterCard.propTypes = {
  subheader: PropTypes.node.isRequired,
};
