import React, {
  Component
} from 'react';

import {
  Text,
  ScrollView,
  ListView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';

import WalletOverviewView from './WalletOverviewView';
import WalletBalanceRewards from './balances/WalletBalanceRewards';
import WalletBalanceTokens from './balances/WalletBalanceTokens';
import WalletBalanceUSD from './balances/WalletBalanceUSD';

/**
 * Wallet screen
 */
export default class WalletScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
    <View style={{ flexDirection: 'row', paddingRight:10}}>
      {/*<IonIcon name="ios-card" size={18} color='#444' style={{paddingRight: 10}} onPress={() => navigation.navigate('NotificationsSettings')} />
      <Text>PURCHASE</Text>*/}
    </View>
    )
  });

  render() {
    return (
      <ScrollView style={ styles.mainContainer }>
        <WalletBalanceTokens />
        <WalletBalanceRewards />
        <WalletBalanceUSD />

        <View>
         {/* <View style={styles.datailsContainer}>
            <Text style={styles.title} onPress={ () => this.props.navigation.navigate('WalletHistory')}>History</Text>
            <Text style={styles.subtitle} onPress={ () => this.props.navigation.navigate('WalletHistory')}>View your points</Text>
          </View>

          <View style={styles.datailsContainer}>
            <Text style={styles.title}>Purchase points</Text>
            <Text style={styles.subtitle}>Support Minds and buy points</Text>
          </View>*/}

          <View style={styles.datailsContainer} >
            <Text style={styles.title} onPress={ () => this.props.navigation.navigate('BoostConsole')}>Boost Console</Text>
            <Text style={styles.subtitle} onPress={ () => this.props.navigation.navigate('BoostConsole')}>Accept or reject boosts made to you</Text>
          </View>

          <View style={styles.datailsContainer} >
            <Text style={styles.title} onPress={ () => this.props.navigation.navigate('TokensRewards')}>Rewards & Contributions</Text>
            <Text style={styles.subtitle} onPress={ () => this.props.navigation.navigate('TokensRewards')}>Check and rewards and daily contribution scores</Text>
          </View>

          <View style={styles.datailsContainer}>
            <Text style={styles.title}>Plan Subscriptions</Text>
            <Text style={styles.subtitle}>Check your currently active plan subscriptions</Text>
          </View>

          <TouchableOpacity onPress={ () => this.props.navigation.navigate('BlockchainSettings') }>
            <View style={styles.datailsContainer}>
              <Text style={styles.title}>Token Settings</Text>
              <Text style={styles.subtitle}>Configure your wallet and other token related settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    paddingTop: 0,
    fontSize: 13,
    paddingTop: 20,
    color: '#888',
  },
  icon: {
    paddingTop: 20,
  },
  points: {
    paddingTop: 20,
    color: 'green',
    paddingTop: 0,
    fontSize: 35,
  },
  title: {
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#888'
  },
  datailsContainer: {
    padding: 20
  },
  mainContainer: {
    backgroundColor: '#fff'
  }
});
