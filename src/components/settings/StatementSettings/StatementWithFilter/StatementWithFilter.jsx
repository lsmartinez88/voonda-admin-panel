import { SortedWithFilter } from "@/components/SortedWithFilter";
import { Div } from "@jumbo/shared";
import { alpha, IconButton, Stack, Typography, TextField } from "@mui/material";

import { RiFilterLine } from "react-icons/ri";

const StatementWithFilter = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flexWrap={"wrap"}
      gap={2}
    >
      <Div
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          p: (theme) => theme.spacing(0.75, 1, 0.75, 1.75),
          backgroundColor: (theme) => alpha(theme.palette.common.black, 0.05),
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textTransform: "uppercase",
            fontSize: 12,
            letterSpacing: 1.5,
            mr: 1.25,
          }}
        >
          Period
        </Typography>
        <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            ".MuiInputBase-root": {
              borderRadius: 6,
              width: 145,
            },
            ".MuiInputBase-input": {
              py: 0.75,
            },
          }}
        />
        <Typography variant="body1" mx={1}>
          to
        </Typography>
        <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            ".MuiInputBase-root": {
              borderRadius: 6,
              width: 145,
            },
            ".MuiInputBase-input": {
              py: 0.75,
            },
          }}
        />
      </Div>
      <Div sx={{ display: "flex", minWidth: 0, alignItems: "center", gap: 1 }}>
        <SortedWithFilter data={[{ label: "Owner" }, { label: "Admin" }]} />
        <IconButton
          sx={{
            border: 1,
            borderRadius: 1.5,
            fontSize: 18,
            display: { xs: "none", md: "inline-flex" },
          }}
          color="primary"
        >
          <RiFilterLine />
        </IconButton>
      </Div>
    </Stack>
  );
};

export { StatementWithFilter };
