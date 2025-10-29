
import { Logo } from "@/components/Logo";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import React from "react";
import { OnboardingStepper } from "../../OnboardingStepper";
import { useOnboarding } from "@/hooks/useOnboarding";

const Onboarding2Config = () => {
  const { activeStep } = useOnboarding();
  const { theme } = useJumboTheme();
  const ContentComponent = React.useMemo(
    () => activeStep?.component,
    [activeStep]
  );
  return (
    <React.Fragment>
      <Div sx={{ mb: 3 }}>
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      </Div>
      <OnboardingStepper />
      <ContentComponent value={activeStep} />
    </React.Fragment>
  );
};

export { Onboarding2Config };
