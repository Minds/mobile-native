//@ts-nocheck
import React, { Component } from 'react';

import { Text, View, FlatList, StyleSheet } from 'react-native';

import { observer, inject } from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import NavigationService from '../../../navigation/NavigationService';

import Touchable from '../../../common/components/Touchable';

import BlockchainWalletListItem from './BlockchainWalletListItem';
import i18n from '../../../common/services/i18n.service';

// Class

@inject('blockchainWallet')
@observer
export default class BlockchainWalletList extends Component {
  componentDidMount() {
    this.props.blockchainWallet.load();
  }

  createWalletAction = () => {
    NavigationService.navigate('BlockchainWallet', { create: true });
  };

  ItemPartial = ({ item }) => {
    if (!item) {
      return null;
    }

    return (
      <Touchable onPress={() => this.props.onSelect(item)}>
        <BlockchainWalletListItem item={item} />
      </Touchable>
    );
  };

  EmptyPartial = () => {
    return (
      <View style={style.emptyView}>
        <Text style={style.emptyViewText}>
          {i18n.t('blockchain.noWalletsAvailable')}
        </Text>

        {!this.props.disableCreation && (
          <Touchable onPress={this.createWalletAction}>
            <Text style={style.emptyViewTappableText}>
              {i18n.t('blockchain.tapToCreate')}
            </Text>
          </Touchable>
        )}
      </View>
    );
  };

  keyExtractor = (item) => item.address;

  render() {
    const wallets = this.props.blockchainWallet.getList(
      this.props.signableOnly,
      this.props.allowOffchain,
    );

    return (
      <FlatList
        data={wallets}
        ListEmptyComponent={this.EmptyPartial}
        renderItem={this.ItemPartial}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const style = StyleSheet.create({
  emptyView: {
    marginTop: 30,
  },
  emptyViewText: {
    marginBottom: 10,
    fontSize: 16,
    color: colors.darkGreyed,
    textAlign: 'center',
  },
  emptyViewTappableText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
});
