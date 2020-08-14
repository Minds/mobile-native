//@ts-nocheck
import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { toJS } from 'mobx';

import { observer, inject } from 'mobx-react';

import BlockchainWalletList from '../list/BlockchainWalletList';

import { CommonStyle } from '../../../styles/Common';

import { getStores } from '../../../../AppStores';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        type: 'offchain',
      };
    } else {
      if (opts.signable && !wallet.privateKey) {
        return;
      }

      let type;

      switch (opts.currency) {
        case 'tokens':
          type = 'onchain';
          break;
        case 'eth':
          type = 'eth';
          break;
        default:
          throw new Error(
            'BlockchainWalletModal: currency not supported ' + opts.currency,
          );
      }

      payload = {
        type,
        wallet: toJS(wallet),
      };
    }

    this.props.blockchainWalletSelector.select(payload);
  }

  cancel() {
    this.props.blockchainWalletSelector.cancel();
  }

  onBackPress = (e) => {
    this.cancel();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  selectAction = (wallet) => this.select(wallet);

  render() {
    const opts = this.props.blockchainWalletSelector.opts;
    const theme = ThemedStyles.style;

    return (
      <SafeAreaView
        style={[CommonStyle.flexContainer, theme.backgroundSecondary]}>
        <View>
          <Icon
            size={36}
            name="ios-chevron-back-outline"
            onPress={() => {
              getStores().blockchainWalletSelector.cancel();
              this.props.navigation.goBack();
            }}
            style={ThemedStyles.style.colorIcon}
          />
        </View>
        <View style={theme.paddingHorizontal3x}>
          <Text style={[theme.subTitleText, theme.marginVertical3x]}>
            {this.props.blockchainWalletSelector.selectMessage
              ? this.props.blockchainWalletSelector.selectMessage
              : i18n.t('blockchain.selectWallet')}
          </Text>
        </View>

        <BlockchainWalletList
          onSelect={this.selectAction}
          signableOnly={opts.signable}
          allowOffchain={opts.offchain}
        />
      </SafeAreaView>
    );
  }
}
