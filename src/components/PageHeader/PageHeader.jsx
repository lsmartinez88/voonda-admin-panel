import { Typography } from "@mui/material";
import { Div } from "@jumbo/shared";

const PageHeader = ({ title, subheader, action }) => {
  return (
    <Div
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: action ? 2 : 0,
        }}
      >
        <Div sx={{ flex: 1 }}>
          <Typography variant={"h2"}>{title}</Typography>
          <Typography variant={"body1"} mb={2} color={"text.secondary"}>
            {subheader}
          </Typography>
        </Div>
        {action && (
          <Div sx={{ ml: 2 }}>
            {action}
          </Div>
        )}
      </Div>
    </Div>
  );
};

export { PageHeader };
