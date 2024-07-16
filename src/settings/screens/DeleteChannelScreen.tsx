import React from 'react';
import { Alert } from 'react-native';
import { Screen, ScreenSection, Button, B1 } from '~ui';
import sp from '~/services/serviceProvider';

/**
 * Delete Channel Screen
 */
export default function DeleteChannelScreen({ navigation }) {
  const i18n = sp.i18n;
  const onDelete = password => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.deleteChannelConfirm'),
      [
        {
          text: i18n.t('yes'),
          onPress: () => sp.resolve('auth').delete(password),
        },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  const confirmPassword = () => {
    navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.deleteChannel'),
      onConfirm: onDelete,
    });
  };

  /**
   * Render
   */
  return (
    <Screen>
      <ScreenSection top="M">
        <B1>{i18n.t('settings.deleteDescription')}</B1>
        <Button top="XXL" onPress={confirmPassword} type="warning">
          {i18n.t('settings.deleteChannelButton')}
        </Button>
      </ScreenSection>
    </Screen>
  );
}
