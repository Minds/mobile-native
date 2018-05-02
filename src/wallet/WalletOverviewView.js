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
            <Text style={ styles.amount }>{ timer }</Text>
            <Text style={ styles.titles }>Next Payout</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.amount }>{ token(this.props.wallet.overview.currentReward, 18) }</Text>
            <Text style={ styles.titles }>Estimated Reward</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.amount }>{ number(this.props.wallet.overview.totalNetworkContribution) }</Text>
            <Text style={ styles.titles }>Network Score</Text>
          </View>
        </View>
        <View style={ styles.view }>
          <View style={ styles.cell }>
            <Text style={ styles.amount }>{  number(this.props.wallet.overview.yourShare,2) }%</Text>
            <Text style={ styles.titles }>Your Share</Text>
          </View>

          <View style={ styles.cell }>
            <Text style={ styles.amount }>{ number(this.props.wallet.overview.yourContribution) }</Text>
            <Text style={ styles.titles }>Your Score</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  cell: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center'
  },
  titles: {
    fontSize: 12,
    fontWeight: '300',
    color: '#333'
  }
});
