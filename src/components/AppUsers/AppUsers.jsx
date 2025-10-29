import { Div } from "@jumbo/shared";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { ChartAppUsers } from "./ChartAppUsers";

const AppUsers = ({ title, subheader }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: "center" }}>
        <Div sx={{ pb: 1.25 }}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="h6" color={"text.secondary"}>
            {subheader}
          </Typography>
        </Div>
        <ChartAppUsers />
      </CardContent>
    </Card>
  );
};

export { AppUsers };

AppUsers.propTypes = {
  title: PropTypes.node,
  subheader: PropTypes.node,
};
