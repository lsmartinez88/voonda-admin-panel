import { Container } from "@mui/material";
import { Onboarding2Config } from "./Onboarding2Config";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { steps } from "./data";
import { OnboardingProvider } from "../OnboardingProvider";

export const Onboarding2 = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: CONTAINER_MAX_WIDTH,
                display: "flex",
                minWidth: 0,
                flex: 1,
                flexDirection: "column",
            }}
            disableGutters
        >
            <OnboardingProvider initSteps={steps}>
                <Onboarding2Config />
            </OnboardingProvider>
        </Container>
    );
};