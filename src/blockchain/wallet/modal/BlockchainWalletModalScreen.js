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
    if (!wallet || (this.props.blockchainWalletSelector.signableOnly && !wallet.privateKey)) {
      return;
    }

    this.props.blockchainWalletSelector.select(wallet);
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
          signableOnly={this.props.blockchainWalletSelector.signableOnly}
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
