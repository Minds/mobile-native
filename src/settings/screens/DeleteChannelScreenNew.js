//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import { CommonStyle as CS } from '../../styles/Common';
import Button from '../../common/components/Button';
import Colors from '../../styles/Colors';
import SettingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Delete Channel Screen
 */
export default class DeleteChannelScreen extends Component {
  state = {
    showPassword: false,
    password: '',
  };

  onDelete = () => {
    if (!this.state.showPassword) return this.setState({ showPassword: true });

    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.deleteChannelConfirm'),
      [
        {
          text: i18n.t('yes'),
          onPress: () => SettingsService.delete(this.state.password),
        },
        { text: i18n.t('no') },
      ],
      { cancelable: false },
    );
  };

  setPassword = (password) => {
    this.setState({ password });
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
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <Text style={[theme.fontXXL, theme.bold]}>
            {i18n.t('settings.deleteChannel')}
          </Text>
          <Text
            style={[
              theme.fontL,
              theme.marginTop,
              theme.marginBottom2x,
              theme.colorSecondaryText,
            ]}>
            {i18n.t('settings.deleteDescription')}
          </Text>
          {this.state.showPassword && (
            <TextInput
              style={[
                theme.borderPrimary,
                theme.border,
                theme.padding2x,
                ThemedStyles.style.colorPrimaryText,
              ]}
              placeholder={i18n.t('auth.password')}
              placeholderTextColor={ThemedStyles.getColor('secondary_text')}
              autoFocus={true}
              autoCapitalize={'none'}
              onChangeText={this.setPassword}
              secureTextEntry={true}
            />
          )}
          <View style={theme.marginTop4x}>
            <Button
              text={i18n.t('settings.deleteChannelButton')}
              color={Colors.danger}
              textColor="white"
              inverted
              onPress={this.onDelete}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
