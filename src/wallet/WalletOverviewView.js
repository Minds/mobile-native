import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { observer, inject } from 'mobx-react/native'
import token from "../common/helpers/token";
import number from "../common/helpers/number";

import colors from '../styles/Colors';

@inject('wallet')
@observer
export default class WalletOverviewView extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {

    const duration = moment.duration(this.props.wallet.overview.nextPayout, 'seconds');
    const timer = moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
    return (
      <View style={styles.container}>
        <View style={ styles.view }>
          <View style={ styles.cell }>
            <Text style={ styles.titles }>Next Payout</Text>
            <Text style={ styles.amount }>{ timer }</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.titles }>Estimated Reward</Text>
            <Text style={ styles.amount }>{ token(this.props.wallet.overview.currentReward || 0, 18) }</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.titles }>Your Share</Text>
            <Text style={ styles.amount }>{  number((this.props.wallet.overview.yourShare || 0) * 100 ,2,4) }%</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.titles }>Your Score</Text>
            <Text style={ styles.amount }>{ number(this.props.wallet.overview.yourContribution || 0) }</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.titles }>Network Score</Text>
            <Text style={ styles.amount }>{ number(this.props.wallet.overview.totalNetworkContribution || 0) }</Text>
          </View>

          <View style={ styles.cell }>
          </View>
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
    backgroundColor: 'white',
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
    textAlign: 'right'
  },
  titles: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '800',
    color: '#444',
    flex: 1,
  }
});
