//@ts-nocheck
import React, {
  Component
} from 'react';

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
export default class DeleteChannelScreenNew extends Component {

  state = {
    showPassword: false,
    password: ''
  }

  onDisable = () => {
    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.disableChannelConfirm'),
      [{ text: i18n.t('yes'), onPress: () => SettingsService.disable()}, { text: i18n.t('no')}],
      { cancelable: false }
    );
  }

  onDelete = () => {
    if (!this.state.showPassword) return this.setState({showPassword: true});

    Alert.alert(
      i18n.t('attention'),
      i18n.t('settings.deleteChannelConfirm'),
      [{ text: i18n.t('yes'), onPress: () => SettingsService.delete(this.state.password)}, { text: i18n.t('no')}],
      { cancelable: false }
    );
  }

  setPassword = (password) => {
    this.setState({password});
  }

  /**
   * Render
   */
  render() {
    return (
      <ScrollView style={[CS.flexContainer, CS.padding2x]}>
        <KeyboardAvoidingView style={[CS.flexContainer]} behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <Text style={[CS.fontXXL]}>{i18n.t('settings.disableChannel')}</Text>
          <Text style={[CS.fontL, CS.marginTop, CS.marginBottom2x]}>{i18n.t('settings.disableDescription')}</Text>
          <Button text="Disable" color={Colors.danger} textColor="white" inverted onPress={this.onDisable}/>
          <Text style={[CS.fontXXL, CS.marginTop3x]}>{i18n.t('settings.deleteChannel')}</Text>
          <Text style={[CS.fontM, CS.marginTop, CS.marginBottom2x]}>{i18n.t('settings.deleteDescription')}</Text>
          {this.state.showPassword &&
            <TextInput
              style={[CS.borderGreyed, CS.borderRadius10x, CS.border, CS.padding2x, ThemedStyles.style.colorPrimaryText]}
              placeholder={i18n.t('auth.password')}
              placeholderTextColor={ThemedStyles.getColor('secondary_text')}
              autoFocus={true}
              autoCapitalize={'none'}
              onChangeText={this.setPassword}
              secureTextEntry={true}
            />
          }
          <Button text={i18n.t('delete')} color={Colors.danger} textColor="white" inverted onPress={this.onDelete}/>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}