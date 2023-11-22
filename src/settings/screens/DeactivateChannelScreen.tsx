import React from 'react';
import { Alert } from 'react-native';
import { Button, ScreenSection, B1, Screen } from '~ui';
import i18n from '../../common/services/i18n.service';
import AuthService from '~/auth/AuthService';
import { useNavigation } from '@react-navigation/native';

/**
 * Delete Channel Screen
 */
export default function DeactivateChannelScreen() {
  const navigation = useNavigation();

  const onDisable = () => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.disableChannelConfirm'),
      [
        { text: i18n.t('yes'), onPress: () => AuthService.disable() },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  const onConfirmPasswordSuccess = () => {
    navigation.goBack();
    onDisable();
  };

  const confirmPassword = () => {
    navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.disableChannel'),
      onConfirm: onConfirmPasswordSuccess,
    });
  };

  /**
   * Render
   */
  return (
    <Screen>
      <ScreenSection top="M">
        <B1>{i18n.t('settings.disableDescription')}</B1>
        <Button top="XXL" onPress={confirmPassword} type="warning">
          {i18n.t('settings.disableChannelButton')}
        </Button>
      </ScreenSection>
    </Screen>
  );
}
