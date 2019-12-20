import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import Modal from 'react-native-modal';

import { observer, inject } from 'mobx-react/native'
import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';
import i18n from '../common/services/i18n.service';

@inject('keychain')
@observer
export default class KeychainModalScreen extends Component {
  state = {
    secret: '',
    secretConfirmation: '',
  };

  submit = () => {
    if (!this.canSubmit()) {
      return;
    }

    this.props.keychain.unlock(this.state.secret);
    this.setState({ secret: '' });
  }

  cancel = () => {
    this.props.keychain.cancel();
    this.setState({ secret: '' });
  }

  canSubmit() {
    if (!this.props.keychain.unlockingExisting) {
      return !!this.state.secret && this.state.secret === this.state.secretConfirmation;
    }

    return !!this.state.secret;
  }

  renderBody() {
    if (this.props.keychain.unlockingExisting) {
      return (
        <View>
          <Text style={CommonStyle.modalTitle}>
            {i18n.t('keychain.unlockMessage', {keychain: this.props.keychain.unlockingKeychain})}
          </Text>
          <TextInput
            style={ComponentsStyle.input}
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={secret => this.setState({ secret })}
            value={this.state.secret || ''}
          />
        </View>
      )
    } else {
      return (
        <View>
          <Text style={CommonStyle.modalTitle}>
            {i18n.t('keychain.setupMessage', {keychain: this.props.keychain.unlockingKeychain})}
          </Text>
          <Text style={styles.note}>
            {i18n.t('keychain.encryptMessage', {keychain: this.props.keychain.unlockingKeychain}) + '\n' + i18n.t('keychain.encryptMessage1')}
          </Text>
          <TextInput
            style={ComponentsStyle.input}
            placeholder={i18n.t('auth.password')}
            secureTextEntry={true}
            onChangeText={secret => this.setState({ secret })}
            value={this.state.secret || ''}
          />
          <TextInput
            style={[ComponentsStyle.input, styles.confirmField]}
            placeholder={i18n.t('auth.confirmpassword')}
            secureTextEntry={true}
            onChangeText={secretConfirmation => this.setState({ secretConfirmation })}
            value={this.state.secretConfirmation || ''}
          />
          { (this.state.secret !== this.state.secretConfirmation) && <Text style={[ styles.note, styles.error ]}>
            {i18n.t('auth.confirmPasswordError')}
          </Text>}
        </View>
      )
    }
  }

  render() {

    const body = this.renderBody();

    return (
      <Modal
        isVisible={this.props.keychain.isUnlocking}
        backdropColor="white"
        backdropOpacity={1}
      >
        {this.props.keychain.isUnlocking && <View style={[ CommonStyle.flexContainer, CommonStyle.modalScreen ]}>
          {body}
          {this.props.keychain.unlockingAttempts > 0 && <Text style={[ styles.note, styles.error ]}>
            {i18n.t('auth.invalidPassword')}
          </Text>}

          <View style={[CommonStyle.rowJustifyStart, { marginTop: 8 }]}>
            <View style={CommonStyle.flexContainer}></View>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={ this.cancel }
              style={[
                ComponentsStyle.button,
                { backgroundColor: 'transparent', marginRight: 4 },
              ]}>
              <Text style={[ CommonStyle.paddingLeft, CommonStyle.paddingRight ]}>{i18n.t('cancel')}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='transparent'
              onPress={ this.submit }
              style={[
                ComponentsStyle.button,
                ComponentsStyle.buttonAction,
                { backgroundColor: 'transparent' },
              ]}>
              <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>{i18n.t('confirm')}</Text>
            </TouchableHighlight>
          </View>
        </View>}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    fontSize: 12,
    marginBottom: 10,
    color: '#aaa',
  },
  error: {
    marginTop: 10,
    color: '#c00',
    textAlign: 'center',
  },
  confirmField: {
    marginTop: 5
  }
});
