import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { observer, inject } from 'mobx-react/native'
import token from "../../common/helpers/token";
import number from "../../common/helpers/number";

@inject('wallet')
@observer
export default class WalletBalanceTokens extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }
 
  render() {

    let addresses = null;
    
    if (this.props.wallet.addresses) { 
      addresses = (
        <View style={styles.addressesContainer}>
          { this.props.wallet.addresses.map((address, i) => {
            return (<View style={styles.addressesRow} key={i}>
              <View style={ styles.addressColumn }>
                <Text style={ styles.addressesLabel }>{ address.label } Address</Text>
                <Text style={ styles.addressesAddress } ellipsizeMode='tail' numberOfLines={1} selectable>{ address.address }</Text>
              </View>
              <View style={ styles.addressColumn }>
                <Text style={ styles.addressesBalance }>{ number(token(address.balance, 18),3) }</Text>
              </View>
            </View>);
          })}
        </View>
      );
    };

    return (
      <View style={ styles.container }>
        <View style={ styles.view }>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.logo}
            source={require('../../assets/logos/bulb.png')}
          />
          <Text style={ styles.amount }>{ this.props.wallet.formattedBalance }</Text>
          <Text style={ styles.currency }>Tokens</Text>
          <View style={{ flex: 1 }}></View>
          
        </View>

        { addresses }
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
    color: '#444',
  },
  addressesAddress: {
    fontSize: 8,
    color: '#888',
  },
  addressesBalance: {
    textAlign: 'right',
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Roboto',
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
    color: '#444',
  }
});
