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
  Alert,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CaptureFab from '../capture/CaptureFab';
import WalletOverviewView from './WalletOverviewView';
import WalletBalanceTokens from './balances/WalletBalanceTokens';
import WalletScoresView from './WalletScoresView';

import { CommonStyle } from '../styles/Common';
import FeaturesService from '../common/services/features.service';
import shareService from "../share/ShareService";
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Wallet screen
 */
@inject('wallet', 'user')
@observer
export default class WalletScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
    <View style={{ flexDirection: 'row', paddingRight:10}}>
      {/*<IonIcon name="ios-card" size={18} color='#444' style={{paddingRight: 10}} onPress={() => navigation.navigate('NotificationsSettings')} />
      <Text>PURCHASE</Text>*/}
    </View>
    )
  });

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <CIcon name="bank" size={24} color={tintColor} />
    )
  }

  componentWillMount() {
    if (FeaturesService.has('crypto')) {
      this.disposeEnter = this.props.navigation.addListener('focus', async () => {
        if ((await this.props.wallet.canShowOnboarding()) && (!this.props.user.hasRewards() || !this.props.user.hasEthWallet())) {
          setImmediate(() => {
            this.props.navigation.navigate('WalletOnboarding');
          });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.disposeEnter)
      this.disposeEnter();
  }

  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <ScrollView style={ ThemedStyles.style.backgroundSecondary }
          keyboardShouldPersistTaps='always'>
          <WalletBalanceTokens navigation={this.props.navigation}/>
          <WalletOverviewView />
          <WalletScoresView />
          <View>

            <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Transactions')} >
              <View style={styles.iconContainer}>
                <Icon name="history" size={24} style={ ThemedStyles.style.colorIcon } />
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{i18n.t('wallet.transactionsTitle')}</Text>
                <Text style={styles.subtitle}>{i18n.t('wallet.transactionsDescription')}</Text>
              </View>
            </TouchableOpacity>

            { FeaturesService.has('crypto') && <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Withdraw')} >
              <View style={styles.iconContainer}>
                <Icon name="local-atm" size={24} style={ ThemedStyles.style.colorIcon } />
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{i18n.t('wallet.withdrawTitle')}</Text>
                <Text style={styles.subtitle}>{i18n.t('wallet.withdrawDescription')}</Text>
              </View>
            </TouchableOpacity> }

            <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Contributions')} >
              <View style={styles.iconContainer}>
                <Icon name="stars" size={24} style={ ThemedStyles.style.colorIcon } />
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{i18n.t('wallet.contributionsTitle')}</Text>
                <Text style={styles.subtitle}>{i18n.t('wallet.contributionsDescription')}</Text>
              </View>
            </TouchableOpacity>

            {FeaturesService.has('crypto') && <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('BlockchainWallet') }>
              <View style={styles.iconContainer}>
                <Icon name="settings" size={24} style={ ThemedStyles.style.colorIcon } />
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{i18n.t('wallet.addressesTitle')}</Text>
                <Text style={styles.subtitle}>{i18n.t('wallet.addressesDescription')}</Text>
              </View>
            </TouchableOpacity>}

            <TouchableOpacity style={styles.itemContainer} onPress={ () => shareService.invite(this.props.user.me.guid)} >
              <View style={styles.iconContainer}>
                <Icon name="share" size={24} style={ ThemedStyles.style.colorIcon } />
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{i18n.t('wallet.inviteFriend')}</Text>
                <Text style={styles.subtitle}>{i18n.t('wallet.inviteFriendDescription')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <CaptureFab navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    paddingTop: 0,
    fontSize: 13,
    paddingTop: 20,
  },
  iconContainer: {
    width: 36,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  points: {
    paddingTop: 20,
    color: 'green',
    paddingTop: 0,
    fontSize: 35,
  },
  title: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  subtitle: {
    fontSize: 12,
  },
  itemContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  item: {
    flex: 1,
  },
  datailsContainer: {
    padding: 16,
  }
});
