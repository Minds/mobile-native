//@ts-nocheck
//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import token from '../../common/helpers/token';
import number from '../../common/helpers/number';
import i18n from '../../common/services/i18n.service';
import colors from '../../styles/Colors';

@inject('wallet')
@observer
export default class WalletBalanceTokens extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  componentWillMount() {
    this.disposeEnter = this.props.navigation.addListener('focus', () => {
      this.triggerRender(this.props.wallet);
    });
  }

  triggerRender(wallet) {
    wallet.ledger.list.clearList();
    wallet.refresh(true);
  }

  /**
   * On component unmount
   */
  componentWillUnmount() {
    // clear data to free memory

    this.props.wallet.ledger.list.clearList();

    if (this.disposeEnter) {
      this.disposeEnter();
    }
  }

  render() {
    let addresses = null;

    if (this.props.wallet.addresses) {
      addresses = (
        <View style={styles.addressesContainer}>
          {this.props.wallet.addresses.map((address, i) => {
            return (
              <View style={styles.addressesRow} key={i}>
                <View style={styles.addressColumn}>
                  <Text style={styles.addressesLabel}>
                    {address.label} {i18n.t('wallet.address')}
                  </Text>
                  <Text
                    style={styles.addressesAddress}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    selectable>
                    {address.address}
                  </Text>
                </View>
                <View style={styles.addressColumn}>
                  <Text style={styles.addressesBalance}>
                    {number(token(address.balance, 18), 3)}
                  </Text>
                  {address.address != 'offchain' && (
                    <Text
                      style={[
                        styles.addressesBalance,
                        styles.addressesEthBalance,
                      ]}>
                      {address.ethBalance ? number(address.ethBalance, 3) : 0}{' '}
                      ETH
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Image
            resizeMode={'contain'}
            style={styles.logo}
            source={require('../../assets/logos/bulb.png')}
          />
          <Text style={styles.amount}>
            {this.props.wallet.formattedBalance}
          </Text>
          <Text style={styles.currency}>{i18n.t('tokens')}</Text>
          <View style={{ flex: 1 }}></View>
        </View>

        {addresses}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    //borderBottomWidth: 1,
    //borderBottomColor: '#eee',
  },
  addressesRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  addressColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  addressesLabel: {
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  addressesAddress: {
    fontSize: 8,
  },
  addressesBalance: {
    textAlign: 'right',
    color: colors.primary,
    fontSize: 16,
    // fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
  },
  addressesEthBalance: {
    fontSize: 12,
    fontWeight: '400',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 16,
    marginBottom: 16,
  },
  amount: {
    fontSize: 45,
    fontWeight: '600',
    fontFamily: 'Roboto',
    color: colors.primary,
  },
  currency: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
});
