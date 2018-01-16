import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Alert
} from 'react-native';

import Modal from 'react-native-modal';

import { observer, inject } from 'mobx-react/native'
import { ComponentsStyle } from '../../styles/Components';
import { CommonStyle } from '../../styles/Common';

const defaults = {
  gasPrice: 1, // TODO: Read from Minds settings
  gasLimit: 0
};

@inject('blockchainTransaction')
@observer
export default class BlockchainTransactionModalScreen extends Component {
  state = {
    ready: true, // TODO: If async data is fetch, use this flag
    gasPrice: 1,
    gasLimit: ''
  };

  approve() {
    Alert.alert(
      'Approve Transaction',
      `Are you sure? There's no UNDO.`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, approve!', onPress: () => this._confirmApprove() }
      ]
    );
  }

  _confirmApprove() {
    this.props.blockchainTransaction.approveTransaction({
      gasPrice: this.state.gasPrice || defaults.gasPrice,
      gasLimit: this.state.gasLimit || this.props.blockchainTransaction.estimateGasLimit || defaults.gasLimit
    });
  }

  reject() {
    this.props.blockchainTransaction.rejectTransaction();
  }

  render() {
    return (
      <Modal
        isVisible={ this.props.blockchainTransaction.isApproving }
        backdropColor="white"
        backdropOpacity={ 1 }
      >
        { this.props.blockchainTransaction.isApproving && <View style={ [ CommonStyle.flexContainer, CommonStyle.modalScreen ] }>
          <Text style={ CommonStyle.viewTitle }>APPROVE ETHEREUM TRANSACTION</Text>

          <Text>{ this.props.blockchainTransaction.approvalMessage }</Text>

          <View style={ CommonStyle.field }>
            <Text style={ CommonStyle.fieldLabel }>GAS PRICE:</Text>

            <TextInput
              style={ CommonStyle.fieldTextInput }
              placeholder={ `Gas price (default: ${ defaults.gasPrice })` }
              returnKeyType={ 'next' }
              onChangeText={ gasPrice => this.setState({ gasPrice }) }
              value={ `${this.state.gasPrice}` }
            />
          </View>

          <View style={ CommonStyle.field }>
            <Text style={ CommonStyle.fieldLabel }>GAS LIMIT:</Text>

            <TextInput
              style={ CommonStyle.fieldTextInput }
              placeholder={ `Gas limit (default: ${ this.props.blockchainTransaction.estimateGasLimit || defaults.gasLimit })` }
              returnKeyType={ 'done' }
              onChangeText={ gasLimit => this.setState({ gasLimit }) }
              value={ `${this.state.gasLimit}` }
            />
          </View>

          <Button
            disabled={ !this.state.ready }
            onPress={ () => this.approve() }
            title="Approve"
          />

          <Button
            onPress={ () => this.reject() }
            title="Reject"
          />
        </View> }
      </Modal>
    );
  }
}
