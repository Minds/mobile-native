import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button, ScreenSection, B1, Screen, B2 } from '~ui';
import { IS_TENANT, TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

/**
 * Delete Channel Screen
 */
export default function DeactivateChannelScreen() {
  const navigation = useNavigation();
  const i18n = sp.i18n;
  const onDisable = () => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.disableChannelConfirm'),
      [
        { text: i18n.t('yes'), onPress: () => sp.resolve('auth').disable() },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  const confirmPassword = () => {
    navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.disableChannel'),
      onConfirm: onDisable,
    });
  };

  /**
   * Render
   */
  return (
    <Screen>
      <ScreenSection top="M">
        <B1>{i18n.t('settings.disableDescription', { TENANT })}</B1>
        {IS_TENANT ? (
          <B2 style={[sp.styles.style.paddingTop2x]}>
            {i18n.t('settings.tenantDeleteAddition')}
          </B2>
        ) : undefined}
        <Button top="XXL" onPress={confirmPassword} type="warning">
          {i18n.t('settings.disableChannelButton')}
        </Button>
      </ScreenSection>
    </Screen>
  );
}
