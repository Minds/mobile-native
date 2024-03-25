import { observer } from 'mobx-react';
import React from 'react';
import { Screen } from '~/common/ui';
import AuthService from '~/auth/AuthService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SurveyView } from '../components/SurveyView';

function SurveyScreen() {
  return (
    <Screen safe>
      <SurveyView onPressContinue={AuthService.setCompletedOnboard} />
    </Screen>
  );
}

export default withErrorBoundaryScreen(observer(SurveyScreen));
