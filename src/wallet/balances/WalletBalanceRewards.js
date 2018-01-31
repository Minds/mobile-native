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
import colors from '../../styles/Colors';

@inject('wallet')
@observer
export default class WalletBalanceRewards extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }
 
  render() {
    return (
      <TouchableHighlight onPress={ () => alert(123) } underlayColor={'white'}>
        <View style={ styles.view }>
          <Text style={ styles.currency }>Credits</Text>
          <View style={{ flex: 1 }}></View>
          <Text style={ styles.amount }>{ this.props.wallet.rewardsFormatted }</Text>
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
