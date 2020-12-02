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
export default function useOnboardingProgress(updateState) {
  const store = useApiFetch<OnboardingGroupState>('api/v3/onboarding', {
    persist: true,
    params: {},
    updateState,
  });

  // setTimeout(() => {
  //   store.setError(null);
  //   store.setResult({
  //     id: 'InitialOnboardingGroup',
  //     completed_pct: 0.3,
  //     steps: [
  //       { id: 'VerifyEmailStep', is_completed: true },
  //       { id: 'SuggestedHashtagsStep', is_completed: false },
  //       { id: 'SetupChannelStep', is_completed: false },
  //       { id: 'VerifyUniqueness', is_completed: false },
  //       { id: 'CreatePostStep', is_completed: false },
  //     ],
  //   });
  // }, 1000);
  return store;
}
