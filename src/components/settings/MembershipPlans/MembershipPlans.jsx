import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { PlansUsage } from "./PlansUsage";
import { SpendingLimits } from "./SpendingLimits";
import { PaymentInformation } from "./PaymentInformation";
import { SettingHeader } from "../SettingHeader";

const plansData = [
  {
    id: 1,
    label: "Plans & Usage",
    component: PlansUsage,
  },
  {
    id: 2,
    label: "Spending Limits",
    component: SpendingLimits,
  },
  {
    id: 3,
    label: "Payment Information",
    component: PaymentInformation,
  },
];

const MembershipPlans = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = ({ }, newValue) => {
    setValue(newValue);
  };
  const MembershipPlansWrapper = plansData[value]?.component;
  return (
    <React.Fragment>
      <SettingHeader
        title={"Membership & Plans"}
        sx={{ borderBottom: "none", pb: 0.5, mb: 0 }}
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Membership & Plans"
        >
          {plansData?.map((item, index) => (
            <Tab label={item.label} key={index} />
          ))}
        </Tabs>
      </Box>
      <MembershipPlansWrapper />
    </React.Fragment>
  );
};
export { MembershipPlans };
