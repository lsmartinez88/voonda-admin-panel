import { OnboardingProvider } from "../OnboardingProvider";
import { steps } from "./data";
import { Onboarding1Config } from "./Onboarding1Config";


export const Onboarding1 = () => {
    return (
        <OnboardingProvider initSteps={steps}>
            <Onboarding1Config />
        </OnboardingProvider>
    );
}; 
