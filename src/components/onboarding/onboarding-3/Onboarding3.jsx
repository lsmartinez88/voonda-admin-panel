import { OnboardingProvider } from "../OnboardingProvider";
import { sidebarSteps, steps } from "./data";
import { Onboarding3Config } from "./Onboarding3Config";



export const Onboarding3 = () => {
    return (
        <OnboardingProvider initSteps={steps} initSidebarSteps={sidebarSteps}>
            <Onboarding3Config />
        </OnboardingProvider>
    );
}; 
