//@ts-nocheck
import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

import { observer, inject } from 'mobx-react';

import TransparentButton from '../../../common/components/TransparentButton';

import { CommonStyle } from '../../../styles/Common';
import Web3Service from '../../services/Web3Service';
import { ComponentsStyle } from '../../../styles/Components';
import i18n from '../../../common/services/i18n.service';

import TextInput from '../../../common/components/TextInput';
import colors from '../../../styles/Colors';

function addressExcerpt(address) {
  return `0×${address.substr(2, 5)}...${address.substr(-5)}`;
}

@inject('blockchainWallet')
@observer
export default class BlockchainWalletImportScreen extends Component {
  state = {
    importingRemote: false,
    remoteAddress: '',
    privateKey: '',
  };

  componentWillMount() {
    const params = this.props.route.params || {};

    this.setState({
      importingRemote: !!params.address,
      remoteAddress: params.address || '',
      privateKey: '',
    });
  }

  canImport() {
    return this.props.blockchainWallet.canImport(this.state.privateKey);
  }

  importAction = async () => {
    const address = Web3Service.getAddressFromPK(this.state.privateKey);

    if (
      this.state.importingRemote &&
      address.toLowerCase() !== this.state.remoteAddress.toLowerCase()
    ) {
      Alert.alert(
        i18n.t('import'),
        i18n.t('blockchain.privateNotBelongToAddress', {
          address: addressExcerpt(this.state.remoteAddress),
        }),
        [{ text: i18n.t('ok') }],
        { cancelable: false },
      );

      return;
    }

    Alert.alert(
      i18n.t('import'),
      i18n.t('blockchain.importUsingPrivate', {
        address: addressExcerpt(address),
      }),
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yes'), onPress: () => this.import() },
      ],
      { cancelable: false },
    );
  };

  cancelAction = () => {
    this.props.navigation.goBack();
  };

  async import() {
    await this.props.blockchainWallet.import(this.state.privateKey);

    const params = this.props.route.params || {};

    if (params.onSuccess) {
      params.onSuccess();
    }

    this.props.navigation.goBack();
  }

  render() {
    return (
      <View
        style={[
          CommonStyle.flexContainer,
          CommonStyle.screen,
          CommonStyle.backgroundWhite,
        ]}>
        {this.state.importingRemote && (
          <Text style={CommonStyle.modalTitle}>
            {i18n.t('blockchain.importWalletFor', {
              address: addressExcerpt(this.state.remoteAddress),
            })}
          </Text>
        )}
        {!this.state.importingRemote && (
          <Text style={CommonStyle.modalTitle}>
            {i18n.t('blockchain.importWallet')}
          </Text>
        )}

        <Text style={styles.note}>
          {i18n.t('blockchain.enterPrivateBelow')}
        </Text>

        <View style={CommonStyle.field}>
          <TextInput
            style={[ComponentsStyle.input, styles.addressTextInput]}
            onChangeText={(privateKey) => this.setState({ privateKey })}
            value={this.state.privateKey}
            placeholder="1234567890abcdef…"
            multiline={true}
            maxLength={66}
          />
        </View>

        <View style={styles.actionBar}>
          <TransparentButton
            style={styles.actionButton}
            color={colors.darkGreyed}
            onPress={this.cancelAction}
            title={i18n.t('cancel')}
          />

          <TransparentButton
            disabled={!this.canImport()}
            style={styles.actionButton}
            color={colors.primary}
            onPress={this.importAction}
            title={i18n.t('import')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
    fontSize: 18,
    color: '#444',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    marginBottom: 10,
    color: '#aaa',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 5,
  },
  addressTextInput: {
    paddingTop: 16,
  },
});
