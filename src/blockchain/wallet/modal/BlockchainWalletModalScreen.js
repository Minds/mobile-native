import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  BackHandler,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { toJS } from 'mobx';

import { observer, inject } from 'mobx-react/native'

import BlockchainWalletList from '../list/BlockchainWalletList';

import { CommonStyle } from '../../../styles/Common';

import appStores from '../../../../AppStores';
import currency from '../../../common/helpers/currency';
import BlockchainApiService from '../../BlockchainApiService';
import i18n from '../../../common/services/i18n.service';

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
          ccOpts.confirmMessage = i18n.t('blockchain.walletConfirmMessage', {currency: currency(usd, 'usd'), tokens: currency(opts.confirmTokenExchange, 'tokens')});
        } catch (e) {
          ccOpts.confirmMessage = i18n.t('blockchain.walletNotDeterminedMessage', {tokens: currency(opts.confirmTokenExchange, 'tokens')});
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

  onBackPress = e => {
    this.cancel();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={CommonStyle.backgroundWhite}>
        <Icon size={36} name="ios-close" onPress={() => appStores.blockchainWalletSelector.cancel()} style={styles.navHeaderIcon}/>
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
              i18n.t('blockchain.selectWallet')
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
