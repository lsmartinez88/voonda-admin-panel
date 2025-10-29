import { JumboCard } from "@jumbo/components";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { ActiveUsersChart } from "./ActiveUsersChart";

const ActiveUsers = ({ subheader }) => {
  return (
    <JumboCard
      title={<Typography variant={"h3"}>257</Typography>}
      subheader={subheader}
      action={
        <Typography variant={"body1"} color={"success.main"}>
          1.5%{" "}
          <TrendingUpIcon
            sx={{
              verticalAlign: "middle",
              fontSize: "1rem",
              ml: 0.5,
              color: "inherit",
            }}
          />
        </Typography>
      }
      contentWrapper
      contentSx={{ pt: 1 }}
    >
      <ActiveUsersChart />
    </JumboCard>
  );
};

export { ActiveUsers };

ActiveUsers.propTypes = {
  subheader: PropTypes.node,
};
