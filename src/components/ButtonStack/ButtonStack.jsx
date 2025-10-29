import { Stack } from "@mui/material";
import PropTypes from "prop-types";

function ButtonStack({ direction, children }) {
  const dir = direction === "vertical" ? "column" : "row";

  return (
    <Stack direction={dir} spacing={1}>
      {children}
    </Stack>
  );
}

export { ButtonStack };

ButtonStack.propTypes = {
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
  children: PropTypes.node.isRequired,
};
