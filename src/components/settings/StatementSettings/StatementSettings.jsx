import { Div, Span } from "@jumbo/shared";
import { Box, Card, Stack, Typography } from "@mui/material";

import { SettingHeader } from "../SettingHeader";
import { statementsData } from "./data";
import { AppPagination1 } from "@/components/AppPagination1";
import { StatementWithFilter } from "./StatementWithFilter";
import { StatementsList } from "./StatementsList";

const StatementSettings = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <SettingHeader title={"Statements/Transactions"} divider sx={{ mb: 4 }} />
      <Div sx={{ mb: 3 }}>
        <StatementWithFilter />
      </Div>
      <Card sx={{ mb: 3 }}>
        <StatementsList />
      </Card>
      <Stack direction={"row"} justifyContent={"space-between"} sx={{ mx: 2 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Showing <Span sx={{ color: "text.primary" }}>1</Span> of{" "}
          <Span sx={{ color: "text.primary" }}>{statementsData?.length}</Span>
        </Typography>
        <AppPagination1 data={statementsData} />
      </Stack>
    </Box>
  );
};
export { StatementSettings };
