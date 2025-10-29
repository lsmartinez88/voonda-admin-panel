import { getBackgroundColorStyle } from "@jumbo/utilities/helpers";
import { Card, CardHeader, Typography } from "@mui/material";
import PropTypes from "prop-types";

function FeaturedCard2({ title, subheader, avatar, bgcolor }) {
  const bgColorStyle = getBackgroundColorStyle(bgcolor);
  return (
    <Card
      sx={{
        height: 116,
        "& .MuiCardHeader-root": {
          height: "100%",
        },
        "& .MuiCardHeader-avatar": {
          marginRight: "50px",
          marginLeft: "10px",

          "&::before": {
            content: '""',
            position: "absolute",
            top: "-35px",
            left: "-55px",
            width: 185,
            height: 185,
            borderRadius: "50%",
            ...bgColorStyle,
          },
        },
      }}
    >
      <CardHeader
        avatar={avatar}
        title={
          typeof title === "string" ? (
            title
          ) : (
            <Typography variant={"h4"} mb={0}>
              {title}
            </Typography>
          )
        }
        subheader={subheader}
        sx={{ position: "relative" }}
      />
    </Card>
  );
}

export { FeaturedCard2 };

FeaturedCard2.propTypes = {
  avatar: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node,
  bgcolor: PropTypes.arrayOf(PropTypes.string),
};
