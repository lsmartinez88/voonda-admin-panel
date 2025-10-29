import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const FilesCounterCard = ({ subheader }) => {
  return (
    <JumboCard bgcolor={["#23BCBA"]} contentSx={{ p: 3 }} contentWrapper>
      <Div sx={{ display: "flex", alignItems: "center" }}>
        <img
          alt={""}
          width={48}
          height={48}
          src={`${ASSET_IMAGES}/dashboard/filesIcon.svg`}
        />
        <Div sx={{ ml: 2, flex: 1 }}>
          <Typography color={"common.white"} variant={"h2"} mb={0.5}>
            42
          </Typography>
          <Typography color={"common.white"} variant={"h5"} mb={0}>
            {subheader}
          </Typography>
        </Div>
      </Div>
    </JumboCard>
  );
};

export { FilesCounterCard };

FilesCounterCard.propTypes = {
  subheader: PropTypes.node.isRequired,
};
