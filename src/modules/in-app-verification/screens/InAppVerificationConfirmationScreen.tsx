import { useNavigation } from '@react-navigation/native';
import React from 'react';
import UserModel from '~/channel/UserModel';
import FitScrollView from '~/common/components/FitScrollView';
import SaveButton from '~/common/components/SaveButton';
import { B1, Column, H3, Screen, ScreenHeader } from '~/common/ui';
import { InAppVerificationStackNavigationProp } from '../InAppVerificationStack';
import { useTranslation } from '../locales';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type NavigationProp =
  InAppVerificationStackNavigationProp<'InAppVerificationConfirmation'>;

function InAppVerificationConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const onContinue = () => {
    navigation.popToTop();
    navigation.goBack();

    // fire the user verified event
    UserModel.events.emit('userVerified');
  };
  const { t } = useTranslation();

  return (
    <Screen safe>
      <ScreenHeader
        title="Confirmation"
        centerTitle
        border
        extra={<SaveButton onPress={onContinue} text={t('Continue')} />}
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{t("You're all set.")}</H3>
          <B1 color="secondary" bottom="XL2">
            {t('Now you can earn tokens and rewards.')}
          </B1>
        </Column>
      </FitScrollView>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  InAppVerificationConfirmationScreen,
  'InAppVerificationConfirmationScreen',
);
