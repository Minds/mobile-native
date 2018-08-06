import React, {Component} from 'react';

import {StyleSheet, View} from 'react-native';
import {default as WalletOverviewIcon, Icons} from './icon/WalletOverviewIcon';

export default class WalletOverviewView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <WalletOverviewIcon
          icon={Icons.votes}
        />
        <WalletOverviewIcon
          icon={Icons.comments}
        />
        <WalletOverviewIcon
          icon={Icons.subscribers}
        />
        <WalletOverviewIcon
          icon={Icons.reminds}
        />
        <WalletOverviewIcon
          icon={Icons.referrals}
        />
        <WalletOverviewIcon
          icon={Icons.onchain_transactions}
        />
        <WalletOverviewIcon
          icon={Icons.checkins}
        />
        <WalletOverviewIcon
          icon={Icons.development}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    flexWrap: 'wrap',
  },
});
