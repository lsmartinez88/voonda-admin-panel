import { FeaturedCard2 } from "@/components/FeaturedCard2";
import { Avatar } from "@mui/material";
import PropTypes from "prop-types";

function UserSummary({ title, subheader }) {
  return (
    <FeaturedCard2
      avatar={
        <Avatar
          sx={{
            width: 60,
            height: 60,
            boxShadow: 2,
            position: "relative",
          }}
          src={`/assets/images/avatar/avatar7.jpg`}
          alt={""}
        />
      }
      title={title}
      subheader={subheader}
      bgcolor={["#00C4B4"]}
    />
  );
}

export { UserSummary };

UserSummary.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
