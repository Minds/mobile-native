//@ts-nocheck
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {default as WalletOverviewIcon, Icons} from './icon/WalletOverviewIcon';
import {inject} from "mobx-react";
import {observer} from "mobx-react";

@inject('wallet')
@observer
export default class WalletScoresView extends Component {
/*  componentDidMount() {
    this.props.wallet.refresh();
  }*/

  render() {
    return (
      <View style={styles.container}>
        <WalletOverviewIcon
          icon={Icons.votes}
          overview={this.props.wallet.overview}
        />
        <WalletOverviewIcon
          icon={Icons.comments}
          overview={this.props.wallet.overview}
        />
        <WalletOverviewIcon
          icon={Icons.subscribers}
          overview={this.props.wallet.overview}
        />
        <WalletOverviewIcon
          icon={Icons.reminds}
          overview={this.props.wallet.overview}
        />
        <WalletOverviewIcon
          icon={Icons.referrals}
          overview={this.props.wallet.overview}
        />
        <WalletOverviewIcon
          icon={Icons.onchain_transactions}
        />
        <WalletOverviewIcon
          icon={Icons.checkins}
          overview={this.props.wallet.overview}
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
