import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { Avatar, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

export function FlyingBird({ title, subheader }) {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      avatar={
        <Avatar
          sx={{ width: 72, height: 72 }}
          alt={"Flying bird"}
          src={`${ASSET_IMAGES}/dashboard/fling-bird.png`}
        />
      }
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      <Typography mb={2}>
        Some description about the card. This widget could be used to describe a
        project, a product, user’s profile or may be more.
      </Typography>
      <Button
        variant={"outlined"}
        sx={{
          "&:hover": {
            color: "common.white",
            backgroundColor: "primary.main",
          },
        }}
      >
        View Profile
      </Button>
    </JumboCard>
  );
}

FlyingBird.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
