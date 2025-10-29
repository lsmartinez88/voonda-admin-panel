import { JumboCard } from "@jumbo/components";
import { Typography } from "@mui/material";

export const CustomizerCard = ({ title, children }) => {
  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0}>
          {title}
        </Typography>
      }
      headerSx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
      contentWrapper
      sx={{ boxShadow: "none", borderRadius: 0 }}
    >
      {children}
    </JumboCard>
  );
};
