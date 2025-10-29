import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import { ChartOnlineVisitors } from "./ChartOnlineVisitors";
import PropTypes from "prop-types";

const OnlineVisitors = ({ title, subheader }) => {
  return (
    <JumboCard
      title={<Typography variant={"h3"}>{title}</Typography>}
      subheader={
        <Typography variant={"h6"} color={"text.secondary"} mb={0}>
          {subheader}
        </Typography>
      }
    >
      <Div sx={{ p: (theme) => theme.spacing(0, 3, 3) }}>
        <Typography variant={"h5"}>2,855 users online</Typography>
      </Div>
      <ChartOnlineVisitors />
    </JumboCard>
  );
};

export { OnlineVisitors };
OnlineVisitors.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
