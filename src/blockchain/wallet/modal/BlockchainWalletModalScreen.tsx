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

import { observer, inject } from 'mobx-react'

import BlockchainWalletList from '../list/BlockchainWalletList';

import { CommonStyle } from '../../../styles/Common';

import { getStores } from '../../../../AppStores';
import currency from '../../../common/helpers/currency';
import BlockchainApiService from '../../BlockchainApiService';
import i18n from '../../../common/services/i18n.service';

@inject('blockchainWallet', 'blockchainWalletSelector')
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
    } else {
      if (opts.signable && !wallet.privateKey) {
        return;
      }

      let type;

      switch(opts.currency) {
        case 'tokens':
          type = 'onchain';
          break;
        case 'eth':
          type = 'eth';
          break;
        default:
          throw new Error('BlockchainWalletModal: currency not supported '+ opts.currency);
      }

      payload = {
        type,
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
        <Icon size={36} name="ios-close" onPress={() => getStores().blockchainWalletSelector.cancel()} style={styles.navHeaderIcon}/>
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
