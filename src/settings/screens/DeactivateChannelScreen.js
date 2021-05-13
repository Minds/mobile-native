//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import Button from '../../common/components/Button';
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
          <Text
            style={[
              theme.fontL,
              theme.marginTop,
              theme.marginBottom2x,
              theme.colorSecondaryText,
            ]}>
            {i18n.t('settings.disableDescription')}
          </Text>
          <View style={theme.marginTop4x}>
            <Button
              text={i18n.t('settings.disableChannelButton')}
              onPress={this.confirmPassword}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
