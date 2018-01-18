import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

import Modal from 'react-native-modal';

import { observer, inject } from 'mobx-react/native'
import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';

@inject('keychain')
@observer
export default class KeychainModalScreen extends Component {
  state = {
    secret: ''
  };

  submit() {
    if (!this.state.secret) {
      return;
    }

    this.props.keychain.unlock(this.state.secret);
    this.setState({ secret: '' });
  }

  cancel() {
    this.props.keychain.cancel();
    this.setState({ secret: '' });
  }

  render() {
    return (
      <Modal
        isVisible={ this.props.keychain.isUnlocking }
        backdropColor="white"
        backdropOpacity={ 1 }
      >
        { this.props.keychain.isUnlocking && <View style={ [ CommonStyle.flexContainer, CommonStyle.modalScreen ] }>
          <Text style={ CommonStyle.viewTitle }>UNLOCK { this.props.keychain.unlockingKeychain.toUpperCase() } KEYCHAIN</Text>

          <TextInput
            style={ CommonStyle.fieldTextInput }
            placeholder='Password'
            secureTextEntry={ true }
            returnKeyType={ 'done' }
            onChangeText={ secret => this.setState({ secret }) }
            value={ this.state.secret || '' }
          />

          <Button
            disabled={ !this.state.secret }
            onPress={ () => this.submit() }
            title="OK"
          />

          <Button
            onPress={ () => this.cancel() }
            title="Cancel"
          />
        </View> }
      </Modal>
    );
  }
}
