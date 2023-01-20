import { useNavigation } from '@react-navigation/native';
import React from 'react';
import FitScrollView from '../../common/components/FitScrollView';
import SaveButton from '../../common/components/SaveButton';
import i18n from '../../common/services/i18n.service';
import { B1, Column, H3, Screen, ScreenHeader } from '../../common/ui';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';

type NavigationProp = InAppVerificationStackNavigationProp<'InAppVerificationConfirmation'>;

export default function InAppVerificationConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const onContinue = () => {
    navigation.popToTop();
    navigation.goBack();
  };

  return (
    <Screen screenName="InAppVerificationConfirmationScreen" safe>
      <ScreenHeader
        title="Confirmation"
        centerTitle
        border
        extra={<SaveButton onPress={onContinue} text={i18n.t('continue')} />}
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{i18n.t('inAppVerification.confirmation.title')}</H3>
          <B1 color="secondary" bottom="XL2">
            {i18n.t('inAppVerification.confirmation.description')}
          </B1>
        </Column>
      </FitScrollView>
    </Screen>
  );
}
