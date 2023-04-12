import { showNotification } from 'AppMessages';
import React from 'react';

import { Screen } from '~/common/ui';
import VerificationCamera from '../components/VerificationCamera';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type Props = InAppVerificationStackScreenProps<'InAppVerificationCamera'>;

function InAppVerificationCameraScreen({ route, navigation }: Props) {
  if (!route.params?.code || !route.params?.deviceId) {
    showNotification('Missing params');
    navigation.goBack();
  }

  return (
    <Screen safe>
      <VerificationCamera
        code={route.params.code}
        deviceId={route.params.deviceId}
      />
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  InAppVerificationCameraScreen,
  'InAppVerificationCameraScreen',
);
