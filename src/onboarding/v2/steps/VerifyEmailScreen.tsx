import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import CodeConfirmScreen from '~/common/screens/CodeConfirmScreen';
import { TENANT } from '~/config/Config';
import { B1 } from '~/common/ui';
import { use2FAEmailVerification } from '../use2FAEmailVerification';
import sp from '~/services/serviceProvider';

/**
 * Verify Email Modal Screen
 */
export default withErrorBoundaryScreen(
  observer(function VerifyEmailScreen() {
    const localStore = use2FAEmailVerification();
    const i18n = sp.i18n;
    useEffect(() => {
      localStore.verify();
    }, [localStore]);

    return (
      <CodeConfirmScreen
        onBack={sp.navigation.goBack}
        title={i18n.t('onboarding.verifyEmailAddress')}
        onVerify={() => {
          localStore.submit();
          sp.navigation.goBack();
        }}
        description={i18n.t('auth.2faEmailDescription', { TENANT })}
        maxLength={6}
        keyboardType={'numeric'}
        placeholder={i18n.t('auth.authCode')}
        onChangeText={localStore.setCode}
        error={localStore.error ? i18n.t('auth.2faInvalid') : ''}
        value={localStore.code}
        detail={
          <B1 color="secondary" vertical="XL" horizontal="L">
            {i18n.t('onboarding.verifyEmailDescription2')}
            <B1
              color={localStore.resending ? 'tertiary' : 'link'}
              onPress={localStore.resend}>
              {' '}
              {i18n.t('onboarding.resend')}
            </B1>
          </B1>
        }
      />
    );
  }),
  'VerifyEmailScreen',
);
