//@ts-nocheck
import React, { Component } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button, ScreenSection, B1 } from '~ui';
import SettingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Delete Channel Screen
 */
export default class DeactivateChannelScreen extends Component {
  onDisable = () => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.disableChannelConfirm'),
      [
        { text: i18n.t('yes'), onPress: () => SettingsService.disable() },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  onConfirmPasswordSuccess = password => {
    this.props.navigation.goBack();
    this.onDisable();
  };

  confirmPassword = () => {
    this.props.navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.disableChannel'),
      onConfirm: this.onConfirmPasswordSuccess,
    });
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <ScrollView style={[theme.flexContainer, theme.padding2x]}>
        <KeyboardAvoidingView
          style={[theme.flexContainer]}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScreenSection top="M">
            <B1>{i18n.t('settings.disableDescription')}</B1>
            <Button top="XXL" onPress={this.confirmPassword} type="warning">
              {i18n.t('settings.disableChannelButton')}
            </Button>
          </ScreenSection>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
