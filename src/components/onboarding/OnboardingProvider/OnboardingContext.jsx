import React from "react";

const onboardingValue = {
  steps: {},
  activeStep: {},
  sidebarSteps: {},
  activeIndex: 0,
  sidebarActiveStep: {},
  nextStep: () => {},
  prevStep: () => {},
};
const OnboardingContext = React.createContext(onboardingValue);

export { OnboardingContext };
