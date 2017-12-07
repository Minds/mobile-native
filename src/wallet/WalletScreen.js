import React, {
  Component
} from 'react';

import {
  Image,
  Text,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';

import { MINDS_URI } from '../config/Config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Wallet screen
 */
export default class WalletScreen extends Component {

  render() {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.mainContainer}>
          <Icon style={styles.icon} name="bank" size={100}/>
          <Text style={styles.points}>58231</Text>
          <Text style={styles.detail}>1 point = 1 view</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>View your points</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title}>Purchase points</Text>
          <Text style={styles.subtitle}>Support Minds and buy points</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title}>Boost Console</Text>
          <Text style={styles.subtitle}>Accept or reject boosts made to you</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title}>Plan Subscriptions</Text>
          <Text style={styles.subtitle}>Check your currently active plan subscriptions</Text>
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
    //flex:1,
    alignItems: 'center',
  },
  screen: {
    // alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
  }
});