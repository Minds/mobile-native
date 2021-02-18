import useApiFetch from '../../common/hooks/useApiFetch';

export type InitialOnboardingId =
  | 'VerifyEmailStep'
  | 'SuggestedHashtagsStep'
  | 'SetupChannelStep'
  | 'VerifyUniquenessStep'
  | 'CreatePostStep';

export type OnboardingStepState = {
  is_completed: boolean;
  id: InitialOnboardingId;
};

export type OnboardingGroupState = {
  id: string;
  is_completed: boolean;
  completed_pct: number;
  steps: Array<OnboardingStepState>;
};

/**
 * Onboarding progress hook
 */
export default function useOnboardingProgress(updateState?: any) {
  const store = useApiFetch<OnboardingGroupState>('api/v3/onboarding', {
    persist: true,
    params: {},
    updateState,
  });

  return store;
}
