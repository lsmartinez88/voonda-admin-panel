import { useOnboarding } from "@/hooks/useOnboarding";
import { useOnboarding1Config } from "../useOnboarding1";
import React from "react";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Onboarding1Sidebar } from "../Onboarding1Sidebar";



export const Onboarding1Config = () => {
  const onboardingLayoutOptions = useOnboarding1Config();

  const { activeStep } = useOnboarding();

  const ContentComponent = React.useMemo(
    () => activeStep?.component,
    [activeStep]
  );

  return (
    <ContentLayout
      sidebar={<Onboarding1Sidebar />}
      {...onboardingLayoutOptions}
    >
      <ContentComponent value={activeStep} />
    </ContentLayout>
  );
};