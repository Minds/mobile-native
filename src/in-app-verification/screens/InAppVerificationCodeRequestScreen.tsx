import React from 'react';
import deviceInfo from 'react-native-device-info';

import i18n from '~/common/services/i18n.service';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';
import apiService from '~/common/services/__mocks__/api.service';
import { B1, Column, H3, Screen, ScreenHeader } from '~/common/ui';
import SaveButton from '~/common/components/SaveButton';
import FitScrollView from '~/common/components/FitScrollView';
import { IS_IOS } from '~/config/Config';
import { showNotification } from 'AppMessages';

type PropsType = InAppVerificationStackScreenProps<'InAppVerificationCodeRequest'>;

export default function InAppVerificationCodeRequestScreen({
  navigation,
}: PropsType) {
  const [code, setCode] = React.useState('');

  const onContinue = () => {
    if (code) {
      navigation.navigate('InAppVerificationCamera', { code });
    }
  };

  React.useEffect(() => {
    deviceInfo.getUniqueId().then(async deviceId => {
      const response = await apiService.post(
        `/api/v3/verification/${deviceId}`,
        {
          device_type: IS_IOS ? 'ios' : 'android',
        },
      );
      if (response?.code) {
        showNotification(`Verification code: ${response.code}`, 'info', 0);
        setCode(response.code);
      }
    });
  }, []);

  return (
    <Screen safe>
      <ScreenHeader
        title="Verification Code"
        centerTitle
        border
        back
        extra={
          <SaveButton
            onPress={onContinue}
            text={i18n.t('continue')}
            disabled={!code}
          />
        }
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{i18n.t('inAppVerification.codeRequest.title')}</H3>
          <B1 color="secondary" bottom="M">
            {i18n.t('inAppVerification.codeRequest.description')}
          </B1>
          <B1 color="secondary" bottom="XL2">
            {i18n.t('inAppVerification.codeRequest.description2')}
          </B1>
        </Column>
      </FitScrollView>
    </Screen>
  );
}
