import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { observer, inject } from 'mobx-react/native'

import BlockchainWalletList from '../list/BlockchainWalletList';

import { CommonStyle } from '../../../styles/Common';

import BlockchainWalletSelectorStore from '../BlockchainWalletSelectorStore';

@inject('blockchainWallet', 'blockchainWalletSelector')
@observer
export default class BlockchainWalletModalScreen extends Component {
  select(wallet) {
    const opts = this.props.blockchainWalletSelector.opts;

    if (
      wallet ||
      (opts.offchain && wallet.address == 'offchain') ||
      (opts.buyable && wallet.address == 'creditcard') ||
      (opts.signable && wallet.privateKey)
    ) {
      this.props.blockchainWalletSelector.select(wallet);
    }
  }

  cancel() {
    this.props.blockchainWalletSelector.cancel();
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={CommonStyle.backgroundWhite}>
        <Icon size={36} name="ios-close" onPress={() => BlockchainWalletSelectorStore.cancel()} style={styles.navHeaderIcon}/>
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  });

  render() {
    const opts = this.props.blockchainWalletSelector.opts;

    return (
      <View style={[ CommonStyle.flexContainer, CommonStyle.backgroundWhite ]}>

        <View style={{ paddingLeft: 16, paddingRight: 16 }}>
          <Text style={CommonStyle.modalTitle}>{
            this.props.blockchainWalletSelector.selectMessage ?
              this.props.blockchainWalletSelector.selectMessage :
              'Select a wallet'
          }</Text>
        </View>

        <BlockchainWalletList
          onSelect={wallet => this.select(wallet)}
          signableOnly={opts.signable}
          allowOffchain={opts.offchain}
          allowCreditCard={opts.buyable}
        />
  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navHeaderIcon: {
    alignSelf: 'flex-end',
    padding: 10
  },
});
