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

/**
 * Delete Channel Screen
 */
export default class DeleteChannelScreen extends Component {

  state = {
    showPassword: false,
    password: ''
  }

  onDisable = () => {
    Alert.alert(
      'Atention',
      'Your account will be disabled. Are you sure you want to proceed?',
      [{ text: 'Yes', onPress: () => SettingsService.disable()}, { text: 'No'}],
      { cancelable: false }
    );
  }

  onDelete = () => {
    if (!this.state.showPassword) return this.setState({showPassword: true});

    Alert.alert(
      'Atention',
      'Your account and all data related to it will be deleted permanently. Are you sure you want to proceed?',
      [{ text: 'Yes', onPress: () => SettingsService.delete(this.state.password)}, { text: 'No'}],
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
      <ScrollView style={[CS.flexContainer, CS.backgroundWhite, CS.padding2x]}>
        <KeyboardAvoidingView style={[CS.flexContainer]} behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <Text style={[CS.fontXXL]}>Disable Channel</Text>
          <Text style={[CS.fontM, CS.fontThin, CS.marginTop, CS.marginBottom2x]}>Disabling your account will make your profile invisible. You will also not receive emails or notifications. Your username will be reserved in case you return to Minds.</Text>
          <Button text="Disable" color={Colors.danger} inverted onPress={this.onDisable}/>
          <Text style={[CS.fontXXL, CS.marginTop3x]}>Delete Channel</Text>
          <Text style={[CS.fontM, CS.fontThin, CS.marginTop, CS.marginBottom2x]}>Warning: This is not reversible and will result in permanent loss of your channel and all of your data. Your channel will not be recoverable. Your username will be released back to the public.</Text>
          {this.state.showPassword &&
            <TextInput
              style={[CS.borderGreyed, CS.borderRadius10x, CS.border, CS.padding2x]}
              placeholder="type your password"
              autoFocus={true}
              autoCapitalize={'none'}
              onChangeText={this.setPassword}
              secureTextEntry={true}
            />
          }
          <Button text="Delete" color={Colors.danger} inverted onPress={this.onDelete}/>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}