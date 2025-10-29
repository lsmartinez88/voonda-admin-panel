
import { useOnboarding } from "@/hooks/useOnboarding";
import React from "react";
import { useOnboarding3 } from "../useOnboarding3";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Onboarding3Sidebar } from "../Onboarding3Sidebar";


const Onboarding3Config = () => {
  const onboardingLayoutOptions = useOnboarding3();

  const { activeStep } = useOnboarding();

  const ContentComponent = React.useMemo(
    () => activeStep?.component,
    [activeStep]
  );

  return (
    <ContentLayout
      sidebar={<Onboarding3Sidebar />}
      {...onboardingLayoutOptions}
    >
      <ContentComponent value={activeStep} />
    </ContentLayout>
  );
};

export { Onboarding3Config };
