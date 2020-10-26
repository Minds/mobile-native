//@ts-nocheck
import React, { Component } from 'react';

import { Text, View, StyleSheet } from 'react-native';

import BlockchainWalletService from '../BlockchainWalletService';
import i18n from '../../../common/services/i18n.service';
import number from '../../../common/helpers/number';
import abbrev from '../../../common/helpers/abbrev';
import colors from '../../../styles/Colors';
import ThemedStyles from '../../../styles/ThemedStyles';

// Helpers
function aliasOrAddressExcerpt(item) {
  if (item.alias) {
    return item.alias;
  }

  return addressExcerpt(item.address);
}

function addressExcerpt(address, length = 5) {
  if (!address || address.toLowerCase().indexOf('0x') !== 0) {
    return address;
  }

  return `0×${address.substr(2, length)}...${address.substr(-length)}`;
}

// Class

export default class BlockchainWalletListItem extends Component {
  state = {
    tokens: null,
    eth: null,
  };

  componentWillMount() {
    this.loadFunds();
  }

  async loadFunds() {
    if (this.props.item.address === 'creditcard') {
      return;
    }

    this.setState({
      tokens: null,
      eth: null,
    });

    const { tokens, eth } = await BlockchainWalletService.getFunds(
      this.props.item.address,
    );

    this.setState({
      tokens,
      eth,
    });
  }

  displayValue(value, currency) {
    if (value === null) {
      return value;
    }

    if (isNaN(value)) {
      return (
        <Text
          style={[
            styles.value,
            ThemedStyles.style.colorGreen,
          ]}>{`${value}`}</Text>
      );
    }

    let amount = number(value, 0, 4);

    if (value >= 1000) {
      amount = abbrev(Math.floor(value), 0);
    }

    return (
      <Text
        style={[
          styles.value,
          ThemedStyles.style.colorGreen,
        ]}>{`${amount}`}</Text>
    );
  }

  displayETH(value) {
    if (value === null) {
      return value;
    }

    let amount = number(value, 0, 4);

    if (value >= 1000) {
      amount = abbrev(Math.floor(value), 0);
    }

    return <Text style={styles.eth}>{`${amount}`} ETH</Text>;
  }

  render() {
    const theme = ThemedStyles.style;
    return (
      <View
        style={[
          theme.padding2x,
          theme.paddingVertical4x,
          theme.rowStretch,
          theme.borderBottomHair,
          theme.borderPrimary,
        ]}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={[styles.label]}>
              {aliasOrAddressExcerpt(this.props.item).toUpperCase()}
            </Text>

            {this.props.item.remote ? (
              <Text style={[styles.tag, styles.tagPrimary]}>
                {i18n.t('blockchain.receiver').toUpperCase()}
              </Text>
            ) : null}

            {this.props.item.offchain ? (
              <Text style={[styles.tag, styles.tagPrimary]}>
                {i18n.t('blockchain.offchain').toUpperCase()}
              </Text>
            ) : null}
          </View>

          <View style={styles.subContainer}>
            {!this.props.item.privateKey &&
            !this.props.item.offchain &&
            !this.props.item.creditcard ? (
              <Text style={[styles.tag, { marginRight: 8, marginLeft: 0 }]}>
                {i18n.t('blockchain.receivaOnly')}
              </Text>
            ) : null}

            {!this.props.item.creditcard && (
              <Text style={styles.listAddress}>
                {addressExcerpt(this.props.item.address, 5)}
              </Text>
            )}

            {this.props.item.creditcard && (
              <Text style={styles.listAddress}>
                {i18n.t('blockchain.noTokensNoProblem')}
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexGrow: 1 }}></View>

        <View style={[styles.valueContainer, ThemedStyles.style.colorGreen]}>
          {this.displayValue(this.state.tokens, 'TOK')}
          {!this.props.item.offchain && this.displayETH(this.state.eth)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    paddingBottom: 3,
    fontSize: 16,
    // fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
    letterSpacing: 1,
  },
  listAliasHighlight: {
    fontWeight: '700',
    color: colors.primary,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  listAddress: {
    paddingTop: 1,
    paddingBottom: 1,
    color: colors.darkGreyed,
    fontSize: 12,
  },
  valueContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    marginLeft: 3,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
  eth: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'right',
  },
  tag: {
    padding: 1,
    paddingLeft: 4,
    paddingRight: 4,
    borderWidth: 1,
    //borderColor: colors.primary,
    borderColor: '#aaa',
    borderRadius: 3,
    //color: colors.primary,
    color: '#aaa',
    marginLeft: 8,
    letterSpacing: 0.25,
    fontSize: 11,
  },
  tagPrimary: {
    borderColor: colors.primary,
    color: colors.primary,
  },
  listIconViewLeft: {
    marginRight: 3,
  },
  listIconView: {
    marginLeft: 3,
  },
});
