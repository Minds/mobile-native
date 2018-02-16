import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';

import { observer, inject } from 'mobx-react/native'
import { ComponentsStyle } from '../../styles/Components';
import { CommonStyle } from '../../styles/Common';
import Web3Service from '../services/Web3Service';
import number from '../../common/helpers/number';
import currency from '../../common/helpers/currency';
import Colors from '../../styles/Colors';

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

  gasFee() {
    const gasPrice = this.state.gasPrice || defaults.gasPrice,
      gasLimit = this.state.gasLimit || this.props.blockchainTransaction.estimateGasLimit || defaults.gasLimit;

    return gasLimit * gasPrice;
  }

  canAfford() {
    if (!this.props.blockchainTransaction.funds) {
      return true; // No info yet
    }

    const eth = this.props.blockchainTransaction.funds.eth,
      wei = Web3Service.web3.utils.toWei(`${eth}`, 'ether'),
      gwei = Web3Service.web3.utils.fromWei(wei, 'gwei')

    return gwei >= this.gasFee();
  }

  render() {
    const gasFeeUsd = this.props.blockchainTransaction.gweiPriceCents ?
      (this.gasFee() * this.props.blockchainTransaction.gweiPriceCents) / 100 :
      null;

    return (
      <Modal
        isVisible={ this.props.blockchainTransaction.isApproving }
        backdropColor="white"
        backdropOpacity={ 1 }
      >
        { this.props.blockchainTransaction.isApproving && <View style={ [ CommonStyle.flexContainer, CommonStyle.modalScreen ] }>
          <Text style={ CommonStyle.modalTitle }>Approve transaction</Text>

          <Text style={ CommonStyle.modalNote }>{ this.props.blockchainTransaction.approvalMessage }</Text>

          <View style={ CommonStyle.field }>
            <Text style={ CommonStyle.fieldLabel }>GAS PRICE (GWEI):</Text>

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

          {!!this.props.blockchainTransaction.weiValue && <View style={CommonStyle.field}>
            <Text style={CommonStyle.fieldLabel}>ETH TO BE TRANSFERRED:</Text>

            <TextInput
              editable={false}
              style={[CommonStyle.fieldTextInput, styles.nonEditable]}
              value={`${this.props.blockchainTransaction.weiValue / Math.pow(10, 18)}`}
            />
          </View>}

          {!!gasFeeUsd && <Text style={styles.gasFee}>
            MAX. GAS FEE: {currency(gasFeeUsd, 'usd')}
          </Text>}

          <View style={[CommonStyle.rowJustifyStart, { marginTop: 8 }]}>
            <View style={{ flex: 1 }}></View>
            <TouchableHighlight 
              underlayColor='transparent' 
              onPress={ this.reject.bind(this) } 
              style={[
                ComponentsStyle.button,
                { backgroundColor: 'transparent', marginRight: 4 },
              ]}>
              <Text style={[ CommonStyle.paddingLeft, CommonStyle.paddingRight ]}>Reject</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              underlayColor='transparent' 
              onPress={ this.approve.bind(this) } 
              style={[
                ComponentsStyle.button,
                ComponentsStyle.buttonAction,
                { backgroundColor: 'transparent' },
              ]}>
              <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>Approve</Text>
            </TouchableHighlight>
          </View>

          {!this.canAfford() && <View>
            <Text
              style={[styles.error]}
            >
              You currently have {number(this.props.blockchainTransaction.funds.eth, 0, 4)} ETH. This amount
              might be insufficient to cover the Ethereum network gas fee for the transaction. Try lowering the gas
              price.
            </Text>
          </View>}
        </View> }

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    marginTop: 20,
    color: '#c00',
    textAlign: 'center',
  },
  gasFee: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  nonEditable: {
    color: Colors.darkGreyed
  }
});
