import { Typography } from "@mui/material";
import { Div } from "@jumbo/shared";

const PageHeader = ({ title, subheader }) => {
  return (
    <Div
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 4,
      }}
    >
      <Typography variant={"h2"}>{title}</Typography>
      <Typography variant={"body1"} mb={2} color={"text.secondary"}>
        {subheader}
      </Typography>
    </Div>
  );
};

export { PageHeader };
