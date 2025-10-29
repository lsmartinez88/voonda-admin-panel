import { Div } from "@jumbo/shared";
import { getBackgroundColorStyle } from "@jumbo/utilities/helpers";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import PropTypes from "prop-types";

function FeaturedCard3({
  avatar,
  title,
  subheader,
  action,
  sx,
  children,
  contentSx,
  headerSx,
  bgcolor,
  textColor,
}) {
  const bgColorStyle = getBackgroundColorStyle(bgcolor);
  const colorStyle = textColor ? { color: textColor } : {};
  return (
    <Card>
      <Div sx={{ ...bgColorStyle, ...colorStyle, ...sx }}>
        {action && <CardHeader action={action} />}
        <CardContent
          sx={{
            textAlign: "center",
            ...headerSx,
          }}
        >
          {avatar}
          {renderTitle(title, textColor)}
          {renderSubheader(subheader, textColor)}
        </CardContent>
      </Div>
      {children && (
        <CardContent
          sx={{
            textAlign: "center",
            bgcolor: (theme) => theme.palette.action.hover,
            ...contentSx,
          }}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}

function renderTitle(title, textColor) {
  if (!title) {
    return null;
  }

  if (typeof title === "string") {
    return (
      <Typography variant={"h5"} {...(textColor && { color: textColor })}>
        {title}
      </Typography>
    );
  }

  return title;
}

function renderSubheader(subheader, textColor) {
  if (!subheader) {
    return null;
  }

  if (typeof subheader === "string") {
    return (
      <Typography
        variant={"h6"}
        {...(textColor ? { color: textColor } : { color: "text.secondary" })}
        mb={2}
      >
        {subheader}
      </Typography>
    );
  }

  return subheader;
}

export { FeaturedCard3 };

FeaturedCard3.propTypes = {
  avatar: PropTypes.node,
  title: PropTypes.node,
  subheader: PropTypes.node,
  action: PropTypes.node,
  sx: PropTypes.object,
  children: PropTypes.node,
  headerSx: PropTypes.object,
  contentSx: PropTypes.object,
  bgcolor: PropTypes.arrayOf(PropTypes.string),
  textColor: PropTypes.string,
};
