import { observer } from 'mobx-react';
import React from 'react';
import { Screen } from '~/common/ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { SurveyView } from '../components/SurveyView';
import serviceProvider from '~/services/serviceProvider';

function SurveyScreen() {
  return (
    <Screen safe>
      <SurveyView
        onPressContinue={serviceProvider.resolve('auth').setCompletedOnboard}
      />
    </Screen>
  );
}

export default withErrorBoundaryScreen(observer(SurveyScreen));
