import { useRoute } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import { Button } from '~/common/ui';
import KeyboardSpacingView from '../common/components/keyboard/KeyboardSpacingView';
import { showNotification } from '../../AppMessages';
import validator from '../common/services/validator.service';
import { IS_IOS } from '../config/Config';
import sp from '~/services/serviceProvider';
/**
 * This screen is used in onboarding to update the email
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

      return sp
        .resolve('settingsApi')
        .submitSettings({ email: this.email })
        .then(() => {
          sp.navigation.goBack();
          route.params.onSubmit?.();
        })
        .catch(() =>
          showNotification(sp.i18n.t('settings.errorSaving'), 'danger'),
        );
    },
  }));

  // verify on mount
  useEffect(() => {
    sp.resolve('settingsApi')
      .getSettings()
      .then(({ channel }) => localStore.setEmail(channel.email))
      .catch(console.error);
  }, [localStore]);

  const detail = (
    <KeyboardSpacingView safe={IS_IOS} enabled>
      <SafeAreaView
        edges={['bottom']}
        style={sp.styles.style.bgPrimaryBackground}>
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
        onBack={() => sp.navigation.goBack()}
        title={'Change email'}
        description={sp.i18n.t('auth.mistypedEmail')}
        keyboardType={'email-address'}
        placeholder={'New email address'}
        onChangeText={localStore.setEmail}
        error={localStore.error ? sp.i18n.t('auth.2faInvalid') : ''}
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
