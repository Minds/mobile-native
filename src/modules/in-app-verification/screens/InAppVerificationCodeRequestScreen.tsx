import React, { useCallback, useEffect } from 'react';
import deviceInfo from 'react-native-device-info';
import { observer, useLocalStore } from 'mobx-react';

import i18n from '~/common/services/i18n.service';
import { InAppVerificationStackScreenProps } from '../InAppVerificationStack';
import { B1, Button, Column, H3, Screen, ScreenHeader } from '~/common/ui';
import SaveButton from '~/common/components/SaveButton';
import FitScrollView from '~/common/components/FitScrollView';
import { showNotification } from 'AppMessages';
import pushService from '~/common/services/push.service';
import usePushNotificationListener from '~/common/hooks/usePushNotificationListener';
import logService from '~/common/services/log.service';
import { api } from '../api';

type PropsType = InAppVerificationStackScreenProps<'InAppVerificationCodeRequest'>;

export default observer(function InAppVerificationCodeRequestScreen({
  navigation,
  route,
}: PropsType) {
  const store = useCodeRequestStore(navigation, route);

  const title = i18n.t(
    store.error
      ? `inAppVerification.messages.${store.error}.title`
      : 'inAppVerification.codeRequest.title',
  );
  const detail = i18n.t(
    store.error
      ? `inAppVerification.messages.${store.error}.detail`
      : 'inAppVerification.codeRequest.description',
  );
  const detail2 = i18n.t('inAppVerification.codeRequest.description2');

  return (
    <Screen safe>
      <ScreenHeader
        title="Verification Code"
        centerTitle
        border
        back
        extra={
          <SaveButton
            onPress={store.onContinue}
            text={i18n.t('continue')}
            disabled={!store.code}
          />
        }
      />
      <FitScrollView>
        <Column space="L" top="XXL">
          <H3 bottom="M">{title}</H3>
          <B1 color="secondary" bottom="M">
            {detail}
          </B1>
          {!store.error ? (
            <B1 color="secondary" bottom="XL2">
              {detail2}
            </B1>
          ) : (
            <Button
              mode="flat"
              type="action"
              onPress={() => store.requestCode()}>
              {i18n.t(`inAppVerification.messages.${store.error}.action`)}
            </Button>
          )}
        </Column>
      </FitScrollView>
    </Screen>
  );
});

function useCodeRequestStore(
  navigation: PropsType['navigation'],
  route: PropsType['route'],
) {
  const store = useLocalStore(() => ({
    code: '',
    error: '' as 'codeReqError' | '',
    deviceId: '',
    setCode(code: string) {
      store.code = code;
    },
    onContinue() {
      if (store.code) {
        navigation.navigate('InAppVerificationCamera', {
          code: store.code,
          deviceId: store.deviceId,
        });
      }
    },
    async requestCode() {
      const token = pushService.getToken();
      store.error = '';

      if (token) {
        try {
          store.deviceId = store.deviceId || (await deviceInfo.getUniqueId());
          await api.requestCode(store.deviceId, token);
        } catch (error) {
          logService.exception(error);
          store.error = 'codeReqError';
        }
      } else {
        showNotification(
          'Please grant push notifications permissions in order to verify your account',
        );
      }
    },
  }));

  // Code resend
  useEffect(() => {
    if (route.params?.requestAgain) {
      // clean the parameter in case it is requested more than once
      navigation.setParams({ requestAgain: undefined });
      store.requestCode();
    }
  }, [route.params?.requestAgain, store]);

  const pushListener = useCallback(
    push => {
      const data = push.getData();

      if (data?.metadata) {
        const meta = JSON.parse(data?.metadata);
        if (meta.verification_code) {
          showNotification(
            `Your verification code is: ${meta.verification_code}`,
            'info',
            0,
          );
          store.setCode(meta.verification_code);
        }
      }
    },
    [store],
  );

  // Listen for the push notification with the code
  usePushNotificationListener(pushListener);

  React.useEffect(() => {
    store.requestCode();
  }, [store]);

  return store;
}
