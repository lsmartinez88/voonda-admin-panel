import { Div } from "@jumbo/shared";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

//TODO: need to handle the bgcolor (degree identification)
function FeaturedCard1({
  bgcolor = ["135deg", "#38B8F2", "#843CF6"],
  icon,
  title,
  subheader,
}) {
  return (
    <Card
      sx={{
        height: 115,
        backgroundImage: `linear-gradient(${bgcolor.toString()})`,
      }}
    >
      <CardActions
        disableSpacing
        sx={{ p: 0, alignItems: "stretch", height: "100%" }}
      >
        <Div
          sx={{
            display: "flex",
            width: 126,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "common.white",
            borderRadius: "50%",
            outline: "solid 10px rgba(255, 255, 255, 0.2)",
            margin: "0 10px 0 -60px",
          }}
        >
          <Div
            sx={{
              display: "flex",
              minWidth: 56,
              height: 56,
              mr: "6px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Div>
        </Div>
        <CardContent sx={{ p: 2.5, flex: 1, alignSelf: "center" }}>
          {typeof title === "string" ? (
            <Typography variant={"h4"} color={"common.white"}>
              {title}
            </Typography>
          ) : (
            title
          )}
          {typeof title === "string" ? (
            <Typography variant={"h5"} color={"common.white"} mb={0}>
              {subheader}
            </Typography>
          ) : (
            subheader
          )}
        </CardContent>
      </CardActions>
    </Card>
  );
}

export { FeaturedCard1 };

FeaturedCard1.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node,
  bgcolor: PropTypes.arrayOf(PropTypes.string),
};
