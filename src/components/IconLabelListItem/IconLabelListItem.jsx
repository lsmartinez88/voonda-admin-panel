import { Divider, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

function IconLabelListItem({ icon, text, divider = true, ...restProps }) {
  return (
    <React.Fragment>
      <ListItem sx={{ p: (theme) => theme.spacing(1.5, 3) }} {...restProps}>
        <ListItemIcon sx={{ minWidth: 36, color: "text.primary" }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
      {divider && <Divider component="li" />}
    </React.Fragment>
  );
}

export { IconLabelListItem };

IconLabelListItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  divider: PropTypes.bool,
};
