import { observer } from 'mobx-react';
import React from 'react';
import { Text } from 'react-native';
import { showNotification } from '../../../../../AppMessages';
import Button from '../../../../common/components/Button';
import useApiFetch from '../../../../common/hooks/useApiFetch';
import emailConfirmationService from '../../../../common/services/email-confirmation.service';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';

type PropsType = {
  buttonOnly?: boolean;
};

const sendEmail = async () => {
  if (await emailConfirmationService.send()) {
    showNotification(i18n.t('emailConfirm.sent'), 'info');
  } else {
    showNotification(i18n.t('pleaseTryAgain'), 'warning');
  }
};

const Resend = observer(({ buttonOnly }: PropsType) => {
  const settings = useApiFetch<{ channel: { email: string } }>(
    'api/v1/settings',
  );
  const email = settings.result?.channel.email || '';

  const onPress = React.useCallback(() => sendEmail(), []);

  return (
    <>
      {!buttonOnly && (
        <Text style={ThemedStyles.style.fontLM}>
          {i18n.t('onboarding.verifyEmailDescription1', { email }) + '\n\n'}
          {i18n.t('onboarding.verifyEmailDescription2')}
        </Text>
      )}
      <Button
        onPress={onPress}
        text={i18n.t('onboarding.resendEmail')}
        containerStyle={styles.button}
        textStyle={ThemedStyles.style.buttonText}
      />
    </>
  );
});

const styles = ThemedStyles.create({
  button: [
    'transparentButton',
    'paddingVertical3x',
    'fullWidth',
    'marginTop6x',
    'bcolorPrimaryBorder',
  ],
});

export default Resend;
