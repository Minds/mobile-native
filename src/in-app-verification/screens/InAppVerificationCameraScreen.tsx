import React from 'react';

import { Screen } from '../../common/ui';
import OcrCamera from '../components/OcrCamera';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';

type Props = InAppVerificationStackScreenProps<'InAppVerificationCamera'>;

export default function InAppVerificationCameraScreen({ route }: Props) {
  return (
    <Screen screenName="InAppVerificationCameraScreen" safe>
      <OcrCamera code={route.params.code} />
    </Screen>
  );
}
