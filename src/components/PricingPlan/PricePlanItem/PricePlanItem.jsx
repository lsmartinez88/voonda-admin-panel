import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { FeaturesList } from "../FeaturesList";

const PricePlanItem = ({ title, subheader, children, headerSx, sx }) => {
  return (
    <Card
      sx={{
        transform: "scale(.95)",
        transition: "all .2s ease-in-out",
        "&:hover": {
          transform: "scale(1)",
        },
        ...sx,
      }}
    >
      <CardHeader
        title={
          typeof title === "string" ? (
            <Typography
              variant={"h2"}
              fontSize={36}
              fontWeight={500}
              color="inherit"
            >
              {title}
            </Typography>
          ) : (
            title
          )
        }
        subheader={
          typeof subheader === "string" ? (
            <Typography
              variant={"h5"}
              color="inherit"
              sx={{
                textTransform: "uppercase",
                letterSpacing: 3,
                mb: 0,
              }}
            >
              {subheader}
            </Typography>
          ) : (
            subheader
          )
        }
        sx={{
          py: 5,
          color: "common.white",
          ...headerSx,
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 5,
        }}
      >
        <FeaturesList />
        {children}
      </CardContent>
    </Card>
  );
};

export { PricePlanItem };

PricePlanItem.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  headerSx: PropTypes.object.isRequired,
  sx: PropTypes.object,
};
