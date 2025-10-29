import { APP_ICONS } from "@/utilities/constants/icons";
import PropTypes from "prop-types";

function Icon({ name, ...props }) {
  if (!name) return "";

  const appIcon = APP_ICONS.find((icon) => {
    return icon.name === name;
  });

  if (!appIcon) {
    return name ?? "";
  }

  const { Component } = appIcon;

  return <Component {...props} />;
}
export { Icon };

Icon.propTypes = {
  name: PropTypes.string,
};
