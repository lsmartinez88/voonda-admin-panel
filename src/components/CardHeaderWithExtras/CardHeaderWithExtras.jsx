import { Div } from "@jumbo/shared";
import { CardHeader, Chip, Stack } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

function CardHeaderWithExtras({
  title,
  subheader,
  action,
  count,
  extras,
  spacing = 3,
  ...restProps
}) {
  return (
    <CardHeader
      title={
        <React.Fragment>
          {title}{" "}
          {count && <Chip size={"small"} label={count} color="primary" />}
        </React.Fragment>
      }
      subheader={subheader}
      action={
        <Stack spacing={spacing} direction={"row"} alignItems={"center"}>
          <Div>{extras}</Div>
          <Div style={{ marginBlock: "-6px" }}>{action}</Div>
        </Stack>
      }
      {...restProps}
    />
  );
}

export { CardHeaderWithExtras };

CardHeaderWithExtras.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subheader: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extras: PropTypes.node,
  spacing: PropTypes.number,
  divider: PropTypes.bool,
};
