import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { toJS } from 'mobx';

import { observer, inject } from 'mobx-react/native'

import BlockchainWalletList from '../list/BlockchainWalletList';

import { CommonStyle } from '../../../styles/Common';

import BlockchainWalletSelectorStore from '../BlockchainWalletSelectorStore';
import currency from '../../../common/helpers/currency';
import BlockchainApiService from '../../BlockchainApiService';

@inject('blockchainWallet', 'blockchainWalletSelector', 'checkoutModal')
@observer
export default class BlockchainWalletModalScreen extends Component {
  async select(wallet) {
    const opts = this.props.blockchainWalletSelector.opts;

    if (!wallet) {
      this.cancel();
      return;
    }

    let payload;

    if (opts.offchain && wallet.address == 'offchain') {
      payload = {
        type: 'offchain'
      };
    } else if (opts.buyable && wallet.address == 'creditcard') {
      const ccOpts = {};

      if (opts.confirmTokenExchange) {
        try {
          const usd = await BlockchainApiService.getRate('tokens') * opts.confirmTokenExchange;
          ccOpts.confirmMessage = `You will be charged ${currency(usd, 'usd')} for ${currency(opts.confirmTokenExchange, 'tokens')}.`;
        } catch (e) {
          ccOpts.confirmMessage = `We couldn't determine the charges for ${currency(opts.confirmTokenExchange, 'tokens')}.`;
        }
      }

      const ccPayload = await this.props.checkoutModal.show(ccOpts);

      if (ccPayload === null) {
        return;
      }

      payload = {
        type: 'creditcard',
        token: ccPayload
      }
    } else {
      if (opts.signable && !wallet.privateKey) {
        return;
      }

      payload = {
        type: 'onchain',
        wallet: toJS(wallet)
      }
    }

    this.props.blockchainWalletSelector.select(payload);
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

  selectAction = wallet => this.select(wallet);

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
          onSelect={this.selectAction}
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
