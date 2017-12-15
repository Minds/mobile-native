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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

/**
 * Wallet screen
 */
export default class WalletScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
    <View style={{ flexDirection: 'row', paddingRight:10}}>
      <IonIcon name="ios-card" size={18} color='#444' style={{paddingRight: 10}} onPress={() => navigation.navigate('NotificationsSettings')} />
      <Text>PURCHASE</Text>
    </View>
    )
  });

  render() {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.mainContainer}>
          <Icon style={styles.icon} name="bank" size={100}/>
          <Text style={styles.points}>58231</Text>
          <Text style={styles.detail}>1 point = 1 view</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title} onPress={ () => this.props.navigation.navigate('WalletHistory')}>History</Text>
          <Text style={styles.subtitle} onPress={ () => this.props.navigation.navigate('WalletHistory')}>View your points</Text>
        </View>
        <View style={styles.datailsContainer}>
          <Text style={styles.title}>Purchase points</Text>
          <Text style={styles.subtitle}>Support Minds and buy points</Text>
        </View>
        <View style={styles.datailsContainer} >
          <Text style={styles.title} onPress={ () => this.props.navigation.navigate('BoostConsole')}>Boost Console</Text>
          <Text style={styles.subtitle} onPress={ () => this.props.navigation.navigate('BoostConsole')}>Accept or reject boosts made to you</Text>
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