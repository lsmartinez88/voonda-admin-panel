import { Div, Link } from "@jumbo/shared";
import PropTypes from "prop-types";

const Logo = ({ mini = false, mode = "light", sx }) => {
  return (
    <Div sx={{ display: "inline-flex", ...sx }}>
      <Link to={"/"}>
        {!mini ? (
          <img
            src={
              mode === "light"
                ? `/assets/images/voonda-logo.png`
                : `/assets/images/voonda-logo-white.png`
            }
            alt="Voonda Admin"
            width={110}
            height={35}
            style={{ verticalAlign: "middle" }}
          />
        ) : (
          <img
            src={
              mode === "light"
                ? `/assets/images/voonda-logo.png`
                : `/assets/images/voonda-logo-white.png`
            }
            alt="Voonda Admin"
            width={35}
            height={35}
            style={{ verticalAlign: "middle" }}
          />
        )}
      </Link>
    </Div>
  );
};

export { Logo };

Logo.propTypes = {
  mini: PropTypes.bool,
  mode: PropTypes.oneOf(["light", "semi-dark", "dark"]).isRequired,
  sx: PropTypes.object,
};
