import { useRoute } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import i18n from '~/common/services/i18n.service';
import { Button } from '~/common/ui';
import KeyboardSpacingView from '../common/components/keyboard/KeyboardSpacingView';
import NavigationService from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import settingsService from '../settings/SettingsService';
import { showNotification } from '../../AppMessages';
import validator from '../common/services/validator.service';
import { IS_IOS } from '../config/Config';

/**
 * Initial email verification screen
 *
 * It uses the 2FA endpoints but without the api.service interceptor modal
 * to be able to transition to this component as the initial screen
 */
const ChangeEmailScreen = () => {
  const route = useRoute<any>();
  // Local store
  const localStore = useLocalStore(() => ({
    email: '',
    error: false,
    setEmail(code: string) {
      localStore.email = code;
    },
    setError(error: boolean) {
      localStore.error = error;
    },
    async submit() {
      if (!validator.email(this.email)) {
        showNotification('Please enter a valid email', 'danger');
        return;
      }

      return settingsService
        .submitSettings({ email: this.email })
        .then(() => {
          NavigationService.goBack();
          route.params.onSubmit?.();
        })
        .catch(() =>
          showNotification(i18n.t('settings.errorSaving'), 'danger'),
        );
    },
  }));

  // verify on mount
  useEffect(() => {
    settingsService
      .getSettings()
      .then(({ channel }) => localStore.setEmail(channel.email))
      .catch(console.error);
  }, [localStore]);

  const detail = (
    <KeyboardSpacingView safe={IS_IOS} enabled>
      <SafeAreaView
        edges={['bottom']}
        style={ThemedStyles.style.bgPrimaryBackground}>
        <Button
          type="action"
          size="large"
          horizontal="L"
          vertical="L"
          spinner
          onPress={localStore.submit}>
          Confirm
        </Button>
      </SafeAreaView>
    </KeyboardSpacingView>
  );

  return (
    <>
      <CodeConfirmScreen
        onBack={NavigationService.goBack}
        title={'Change email'}
        description={i18n.t('auth.mistypedEmail')}
        keyboardType={'email-address'}
        placeholder={'New email address'}
        onChangeText={localStore.setEmail}
        error={localStore.error ? i18n.t('auth.2faInvalid') : ''}
        value={localStore.email}
      />
      {detail}
    </>
  );
};

export default withErrorBoundaryScreen(
  observer(ChangeEmailScreen),
  'ChangeEmailScreen',
);
