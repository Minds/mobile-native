import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { observer, inject } from 'mobx-react/native'
import token from "../common/helpers/token";

@inject('wallet')
@observer
export default class WalletOverviewView extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    return (
      <View style={ styles.view }>
        <View style={ styles.cell }>
          <Text style={ styles.amount }>{ this.props.wallet.rewardsFormatted }</Text>
          <Text style={ styles.currency }>REWARDS</Text>
        </View>

        <View style={ styles.cell }>
          <Text style={ styles.amount }>{ this.props.wallet.tokensFormatted }</Text>
          <Text style={ styles.currency }>COINS</Text>
        </View>

        <View style={ styles.cell }>
          <Text style={ styles.amount }>{ this.props.wallet.moneyFormatted }</Text>
          <Text style={ styles.currency }>MONEY</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2196f3',
  },
  cell: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  },
  currency: {
    fontSize: 10,
    fontWeight: '300',
    color: '#fff'
  }
});
