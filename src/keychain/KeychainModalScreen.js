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

@inject('keychain')
@observer
export default class KeychainModalScreen extends Component {
  state = {
    secret: '',
    secretConfirmation: '',
  };

  submit() {
    if (!this.canSubmit()) {
      return;
    }

    this.props.keychain.unlock(this.state.secret);
    this.setState({ secret: '' });
  }

  cancel() {
    this.props.keychain.cancel();
    this.setState({ secret: '' });
  }

  canSubmit() {
    if (!this.props.keychain.unlockingExisting) {
      return !!this.state.secret && this.state.secret === this.state.secretConfirmation;
    }

    return !!this.state.secret;
  }

  render() {
    return (
      <Modal
        isVisible={this.props.keychain.isUnlocking}
        backdropColor="white"
        backdropOpacity={1}
      >
        {this.props.keychain.isUnlocking && <View style={[ CommonStyle.flexContainer, CommonStyle.modalScreen ]}>
          {this.props.keychain.unlockingExisting && <Text style={CommonStyle.modalTitle}>
            Unlock {this.props.keychain.unlockingKeychain} keychain
          </Text>}

          {!this.props.keychain.unlockingExisting && <Text style={CommonStyle.modalTitle}>
            Setup {this.props.keychain.unlockingKeychain} keychain
          </Text>}

          {!this.props.keychain.unlockingExisting && <Text style={styles.note}>
            Enter a password that will encrypt the {this.props.keychain.unlockingKeychain} keychain.
            Remember the password or you will be unable to read/write from it.
          </Text>}

          <TextInput
            style={ComponentsStyle.input}
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={secret => this.setState({ secret })}
            value={this.state.secret || ''}
          />

          {!this.props.keychain.unlockingExisting && <TextInput
            style={[ComponentsStyle.input, styles.confirmField]}
            placeholder='Confirm Password'
            secureTextEntry={true}
            onChangeText={secretConfirmation => this.setState({ secretConfirmation })}
            value={this.state.secretConfirmation || ''}
          />}

          {this.props.keychain.unlockingAttempts > 0 && <Text style={[ styles.note, styles.error ]}>
            The password you entered is invalid.
          </Text>}

          <View style={[CommonStyle.rowJustifyStart, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}></View>
            <TouchableHighlight 
              underlayColor='transparent' 
              onPress={ this.cancel.bind(this) } 
              style={[
                ComponentsStyle.button,
                { backgroundColor: 'transparent', marginRight: 4 },
              ]}>
              <Text style={[ CommonStyle.paddingLeft, CommonStyle.paddingRight ]}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              underlayColor='transparent' 
              onPress={ this.submit.bind(this) } 
              style={[
                ComponentsStyle.button,
                ComponentsStyle.buttonAction,
                { backgroundColor: 'transparent' },
              ]}>
              <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>Confirm</Text>
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
