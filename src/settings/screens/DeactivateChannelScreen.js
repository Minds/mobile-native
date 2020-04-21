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

  /**
   * Render
   */
  render() {
    return (
      <ScrollView style={[CS.flexContainer, CS.padding2x]}>
        <KeyboardAvoidingView
          style={[CS.flexContainer]}
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <Text style={[CS.fontXXL, CS.bold]}>
            {i18n.t('settings.disableChannel')}
          </Text>
          <Text
            style={[
              CS.fontL,
              CS.marginTop,
              CS.marginBottom2x,
              CS.colorSecondaryText,
            ]}>
            {i18n.t('settings.disableDescription')}
          </Text>
          <View style={CS.marginTop4x}>
            <Button
              text={i18n.t('settings.disableChannelButton')}
              color={ThemedStyles.getColor('alert')}
              textColor="white"
              inverted
              onPress={this.onDisable}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
