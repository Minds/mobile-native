//@ts-nocheck
import React, { Component } from 'react';
import { View, Alert } from 'react-native';

import { observer, inject } from 'mobx-react';

import { CommonStyle } from '../../styles/Common';

import BlockchainWalletService from './BlockchainWalletService';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ActionSheet from 'react-native-actionsheet';

import BlockchainWalletList from './list/BlockchainWalletList';
import colors from '../../styles/Colors';
import i18n from '../../common/services/i18n.service';

@inject('blockchainWallet', 'blockchainWalletSelector')
@observer
export default class BlockchainWalletScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const _create = async () => {
      const address = await BlockchainWalletService.create();
      navigation.navigate('BlockchainWalletDetails', { address, new: true });
    };

    const _import = () => {
      navigation.navigate('BlockchainWalletImport');
    };

    const handleActionSheetSelection = (i) => {
      switch (i) {
        case 1:
          _create();
          break;
        case 2:
          _import();
          break;
      }
    };

    return {
      title: i18n.t('blockchain.walletAddresses'),
      headerRight: () => (
        <View style={CommonStyle.rowJustifyStart}>
          <Icon
            name="add"
            size={26}
            color={colors.primary}
            style={CommonStyle.paddingRight2x}
            onPress={() => this.ActionSheet.show()}
          />

          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            options={[i18n.t('cancel'), i18n.t('create'), i18n.t('import')]}
            onPress={(i) => {
              handleActionSheetSelection(i);
            }}
            cancelButtonIndex={0}
          />
        </View>
      ),
    };
  };

  async componentDidMount() {
    await this.props.blockchainWallet.load(true);
  }

  createAction = () => {
    Alert.alert(
      'Create',
      `Create a new wallet?`,
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yes'), onPress: () => this.create() },
      ],
      { cancelable: false },
    );
  };

  detailsAction = ({ address }) => {
    this.props.navigation.navigate('BlockchainWalletDetails', { address });
  };

  render() {
    return (
      <View style={[CommonStyle.flexContainer]}>
        <BlockchainWalletList
          onSelect={this.detailsAction}
          disableCreation={true}
          allowOffchain={true}
        />
      </View>
    );
  }
}
