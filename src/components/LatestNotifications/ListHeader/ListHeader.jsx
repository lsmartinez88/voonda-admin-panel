import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const ListHeader = ({ title, count, action }) => {
  return (
    <Div
      className={"d-flex align-items-center justify-content-between px-4 pt-4"}
    >
      <Typography variant={"h4"} color={"text.secondary"}>
        {count} {title}
      </Typography>
      {action}
    </Div>
  );
};

export { ListHeader };

ListHeader.propTypes = {
  title: PropTypes.node.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  action: PropTypes.node,
};
