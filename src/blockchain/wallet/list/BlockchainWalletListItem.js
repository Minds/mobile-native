import React, { Component } from 'react';

import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import BlockchainWalletService from '../BlockchainWalletService';

import number from '../../../common/helpers/number';
import abbrev from '../../../common/helpers/abbrev';

// Helpers
function aliasOrAddressExcerpt(item) {
  if (item.alias) {
    return item.alias;
  }

  return addressExcerpt(item.address);
}

function addressExcerpt(address, length = 5) {
  if (!address || (address.toLowerCase().indexOf('0x') !== 0)) {
    return address;
  }

  return `0×${address.substr(2, length)}...${address.substr(-length)}`;
}

// Class

export default class BlockchainWalletListItem extends Component {
  state = {
    tokens: null,
    eth: null
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

    const { tokens, eth } = await BlockchainWalletService.getFunds(this.props.item.address);

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
      return (<Text style={styles.value}>
        {`${value}`}
      </Text>);
    }

    let amount = number(value, 0, 4);

    if (value >= 1000) {
      amount = abbrev(Math.floor(value), 0);
    }

    return (
      <Text style={styles.value}>
        {`${amount}`}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <View>
          <View style={styles.headerContainer}>
            <Text style={[styles.label]}>
              {aliasOrAddressExcerpt(this.props.item).toUpperCase()}
            </Text>

            { this.props.item.remote ? 
              <Text style={[styles.tag, styles.tagPrimary]}>RECEIVER</Text>
              : null }

            { this.props.item.offchain ? 
              <Text style={[styles.tag, styles.tagPrimary]}>OFFCHAIN</Text>
              : null }
          </View>

          <View style={styles.subContainer}>
            { !this.props.item.privateKey && !this.props.item.offchain && !this.props.item.creditcard ? 
              <Text style={[styles.tag, { marginRight: 8, marginLeft: 0}]}>RECEIVE ONLY</Text>
              : null }

            { !this.props.item.creditcard && <Text style={styles.listAddress}>{addressExcerpt(this.props.item.address, 5)}</Text>}

            { this.props.item.creditcard && <Text style={styles.listAddress}>No tokens? No problem!</Text> }
          </View>

        </View>

        <View style={{ flexGrow: 1 }}></View>

        <View style={styles.valueContainer}>
          {this.displayValue(this.state.tokens, 'TOK')}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    paddingBottom: 3,
    fontSize: 16,
    fontWeight: '800',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginLeft: 3,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 3,
    paddingRight: 3,
    color: 'green',
    fontSize: 20,
    fontWeight: '800',
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
