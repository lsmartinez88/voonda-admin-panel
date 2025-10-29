import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";

const NoDataPlaceholder = ({
  children,
  height = 300,
  placeholder = "No data available",
}) => {
  if (children) return children;

  return (
    <Div sx={{ textAlign: "center", p: 3, m: "auto" }}>
      <img
        alt={"Not Found"}
        src={`${ASSET_IMAGES}/pages/not_found.svg`}
        width={300}
        height={height}
        style={{ verticalAlign: "middle" }}
      />
      <Typography variant={"h3"} color={"text.secondary"} mt={2}>
        {placeholder}
      </Typography>
    </Div>
  );
};

export { NoDataPlaceholder };
