//@ts-nocheck
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react';

@inject('wallet')
@observer
export default class BlockchainSettingsOverviewView extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    return (
      <View style={styles.view}>
        <View>
          <Text style={styles.amount}>{this.props.wallet.tokensFormatted}</Text>
          <Text style={styles.currency}>COINS</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  amount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
  },
  currency: {
    fontSize: 15,
    fontWeight: '300',
    color: '#fff',
  },
});
