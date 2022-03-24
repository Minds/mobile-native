//@ts-nocheck
import React, { Component } from 'react';
import { ScrollView, Alert } from 'react-native';
import { ScreenSection, Button, B1 } from '~ui';
import SettingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Delete Channel Screen
 */
export default class DeleteChannelScreen extends Component {
  onDelete = password => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.deleteChannelConfirm'),
      [
        {
          text: i18n.t('yes'),
          onPress: () => SettingsService.delete(password),
        },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  onConfirmPasswordSuccess = password => {
    this.props.navigation.goBack();
    this.onDelete(password);
  };

  confirmPassword = () => {
    this.props.navigation.navigate('PasswordConfirmation', {
      title: i18n.t('settings.deleteChannel'),
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
        <ScreenSection top="M">
          <B1>{i18n.t('settings.deleteDescription')}</B1>
          <Button top="XXL" onPress={this.confirmPassword} type="warning">
            {i18n.t('settings.deleteChannelButton')}
          </Button>
        </ScreenSection>
      </ScrollView>
    );
  }
}
