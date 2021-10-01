//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Button from '../../common/components/Button';
import SettingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';

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
        <KeyboardAvoidingView
          style={[theme.flexContainer]}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <MText
            style={[
              theme.fontL,
              theme.marginTop,
              theme.marginBottom2x,
              theme.colorSecondaryText,
            ]}>
            {i18n.t('settings.deleteDescription')}
          </MText>
          <View style={theme.marginTop4x}>
            <Button
              text={i18n.t('settings.deleteChannelButton')}
              onPress={this.confirmPassword}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
