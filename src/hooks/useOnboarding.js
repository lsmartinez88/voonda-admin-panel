import { OnboardingContext } from '@/components/onboarding/OnboardingProvider';
import { useContext } from 'react';

function useOnboarding() {
  return useContext(OnboardingContext);
}

export { useOnboarding };
