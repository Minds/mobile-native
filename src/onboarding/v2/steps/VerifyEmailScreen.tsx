import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { showNotification } from '../../../../AppMessages';
import Button from '../../../common/components/Button';
import MText from '../../../common/components/MText';
import useApiFetch from '../../../common/hooks/useApiFetch';
import emailConfirmationService from '../../../common/services/email-confirmation.service';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const sendEmail = async () => {
  if (await emailConfirmationService.send()) {
    showNotification(i18n.t('emailConfirm.sent'), 'info');
  } else {
    showNotification(i18n.t('pleaseTryAgain'), 'warning');
  }
};

/**
 * Verify Email Modal Screen
 */
export default withErrorBoundaryScreen(
  observer(function VerifyEmailScreen() {
    const theme = ThemedStyles.style;
    const settings =
      useApiFetch<{ channel: { email: string } }>('api/v1/settings');
    const email = settings.result?.channel.email || '';

    const onPress = useCallback(() => sendEmail(), []);

    return (
      <ModalContainer
        title="Verify email"
        onPressBack={NavigationService.goBack}>
        <View style={[theme.flexContainer, theme.paddingHorizontal4x]}>
          <MText style={theme.fontLM}>
            {i18n.t('onboarding.verifyEmailDescription1', { email }) + '\n\n'}
            {i18n.t('onboarding.verifyEmailDescription2')}
          </MText>
          <Button
            onPress={onPress}
            text={i18n.t('onboarding.resendEmail')}
            containerStyle={[
              theme.transparentButton,
              theme.paddingVertical3x,
              theme.fullWidth,
              theme.marginTop6x,
              theme.bcolorPrimaryBorder,
            ]}
            textStyle={theme.buttonText}
          />
        </View>
      </ModalContainer>
    );
  }),
  'VerifyEmailScreen',
);
