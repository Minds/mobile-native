import { useBackHandler } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import { B1 } from '~/common/ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { TENANT } from '~/config/Config';
import { use2FAEmailVerification } from '~/onboarding/v2/use2FAEmailVerification';
import sp from '~/services/serviceProvider';

/**
 * Initial email verification screen
 *
 * It uses the 2FA endpoints but without the api.service interceptor modal
 * to be able to transition to this component as the initial screen
 */
const InitialEmailVerificationScreen = () => {
  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  // Local store
  const localStore = use2FAEmailVerification();

  // verify on mount
  useEffect(() => {
    localStore.verify();
  }, [localStore]);

  const detail = (
    <>
      <B1 color="secondary" vertical="XL" horizontal="L">
        {sp.i18n.t('onboarding.verifyEmailDescription2')}
        <B1
          color={localStore.resending ? 'tertiary' : 'link'}
          onPress={localStore.resend}>
          {' '}
          {sp.i18n.t('onboarding.resend')}
        </B1>
      </B1>

      <B1
        horizontal="L"
        color="link"
        onPress={() =>
          sp.navigation.push('ChangeEmail', {
            onSubmit: () => localStore.resend(),
          })
        }>
        Change email
      </B1>
    </>
  );
  return (
    <CodeConfirmScreen
      onBack={sp.resolve('auth').justRegistered ? undefined : localStore.cancel}
      title={sp.i18n.t('onboarding.verifyEmailAddress')}
      onVerify={localStore.submit}
      description={sp.i18n.t('auth.2faEmailDescription', { TENANT })}
      maxLength={6}
      keyboardType={'numeric'}
      placeholder={sp.i18n.t('auth.authCode')}
      onChangeText={localStore.setCode}
      error={localStore.error ? sp.i18n.t('auth.2faInvalid') : ''}
      value={localStore.code}
      detail={detail}
    />
  );
};

export default withErrorBoundaryScreen(
  observer(InitialEmailVerificationScreen),
  'InitialEmailVerificationScreen',
);
