import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import { observer, inject } from 'mobx-react/native'
import token from "../../common/helpers/token";

@inject('wallet')
@observer
export default class WalletBalanceUSD extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }
 
  render() {
    return (
      <TouchableHighlight underlayColor={'white'}>
        <View style={ styles.view }>
          <Text style={ styles.currency }>USD</Text>
          <View style={{ flex: 1 }}></View>
          <Text style={ styles.amount }>{ this.props.wallet.moneyFormatted }</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  currency: {
    fontSize: 24,
    fontWeight: '800',
    color: '#444',
  }
});
