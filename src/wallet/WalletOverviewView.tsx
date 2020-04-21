//@ts-nocheck
import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import token from '../common/helpers/token';
import number from '../common/helpers/number';
import i18n from '../common/services/i18n.service';

@inject('wallet', 'user')
@observer
export default class WalletOverviewView extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    const duration = moment.duration(
      this.props.wallet.overview.nextPayout,
      'seconds',
    );
    const timer = moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <View style={styles.cell}>
            <Text style={styles.titles}>{i18n.t('wallet.nextPayout')}</Text>
            <Text style={styles.amount}>{timer}</Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>
              {i18n.t('wallet.estimatedReward')}
            </Text>
            <Text style={styles.amount}>
              {token(this.props.wallet.overview.currentReward || 0, 18)}
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>{i18n.t('wallet.yourShare')}</Text>
            <Text style={styles.amount}>
              {number((this.props.wallet.overview.yourShare || 0) * 100, 2, 4)}%
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>{i18n.t('wallet.yourScore')}</Text>
            <Text style={styles.amount}>
              {number(this.props.wallet.overview.yourContribution || 0)}
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>{i18n.t('wallet.networkScore')}</Text>
            <Text style={styles.amount}>
              {number(this.props.wallet.overview.totalNetworkContribution || 0)}
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>
              {i18n.t('wallet.yourRewardFactor')}
            </Text>
            <Text style={styles.amount}>
              {number(this.props.wallet.overview.yourRewardFactor || 1, 0, 1)}x
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.titles}>{i18n.t('wallet.yourUserState')}</Text>
            <Text style={styles.amount}>{this.props.user.me.user_state}</Text>
          </View>

          <View style={styles.cell}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  view: {
    flex: 1,
  },
  cell: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  amount: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '700',
    color: '#7ed321',
    textAlign: 'right',
  },
  titles: {
    fontFamily: 'Roboto',
    fontSize: 12,
    // fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
    flex: 1,
  },
});
