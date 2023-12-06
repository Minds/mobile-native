import { observer } from 'mobx-react';
import React from 'react';
import { Screen } from '~/common/ui';
import { useIsFeatureOn } from 'ExperimentsProvider';
import AuthService from '~/auth/AuthService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SurveyView } from '../components/SurveyView';

function SurveyScreen({ navigation }) {
  const mandatoryOnboarding = useIsFeatureOn(
    'minds-3921-mandatory-onboarding-tags',
  );

  const next = () =>
    mandatoryOnboarding
      ? navigation.navigate('OnboardingChannels')
      : AuthService.setCompletedOnboard();

  return (
    <Screen safe>
      <SurveyView onPressContinue={next} />
    </Screen>
  );
}

export default withErrorBoundaryScreen(observer(SurveyScreen));
