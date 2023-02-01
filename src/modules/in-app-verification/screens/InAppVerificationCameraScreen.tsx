import { showNotification } from 'AppMessages';
import React from 'react';

import { Screen } from '~/common/ui';
import VerificationCamera from '../components/VerificationCamera';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';

type Props = InAppVerificationStackScreenProps<'InAppVerificationCamera'>;

export default function InAppVerificationCameraScreen({
  route,
  navigation,
}: Props) {
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
