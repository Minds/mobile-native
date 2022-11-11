import { useNavigation } from '@react-navigation/core';
import React from 'react';
import FitScrollView from '../../common/components/FitScrollView';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import { B1, Column, H3, Screen, ScreenHeader } from '../../common/ui';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';

type NavigationProp = InAppVerificationStackNavigationProp<'InAppVerificationCodeRequest'>;

export default function InAppVerificationCodeRequestScreen() {
  const navigation = useNavigation<NavigationProp>();

  const onContinue = () => {
    //TODO: Replace with the code received from the push notification
    navigation.navigate('InAppVerificationCamera', { code: '345892' });
  };

  return (
    <Screen safe>
      <ScreenHeader
        title="Verification Code"
        centerTitle
        border
        back
        extra={<SaveButton onPress={onContinue} text={i18n.t('continue')} />}
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
