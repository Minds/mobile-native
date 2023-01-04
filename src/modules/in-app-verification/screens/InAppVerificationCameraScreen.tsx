import React from 'react';

import { Screen } from '~/common/ui';
import VerificationCamera from '../components/VerificationCamera';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';

type Props = InAppVerificationStackScreenProps<'InAppVerificationCamera'>;

export default function InAppVerificationCameraScreen({ route }: Props) {
  return (
    <Screen safe>
      <VerificationCamera
        code={route.params.code}
        deviceId={route.params.deviceId}
      />
    </Screen>
  );
}
