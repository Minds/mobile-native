import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Picker,
  Alert,
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { logout } from './../auth/LoginService';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from './SettingsService';

import i18nService from '../common/services/i18n.service';
import BlockchainWalletStore from '../blockchain/wallet/BlockchainWalletStore';

const ICON_SIZE = 24;

export default class SettingsScreen extends Component {
  state = {
    categories: [],
  }

  componentWillMount() {
    settingsService.loadCategories()
      .then(categories => {
        this.setState({
          categories: categories,
          language: i18nService.getCurrentLocale()
        });
      })
  }

  changeLanguage = (val) => {
    i18nService.setLocale(val);
    this.setState({ language: val })
  }

  onPressNotifications = () => {
    this.props.navigation.navigate('NotificationsSettings');
  }

  onPressLogout = () => {
    logout();
    const loginAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })

    this.props.navigation.dispatch(loginAction);
  }

  wipeEthereumKeychainAction = () => {
    const _confirm3 = async (confirmation) => {
      await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

      await BlockchainWalletStore._DANGEROUS_wipe(confirmation);

      Alert.alert('Wiped', `Your Ethereum keychain was completely removed.`);
    };

    const _confirm2 = async () => {
      await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

      Alert.alert(
        'Are you 100% sure?',
        `Please, confirm once again that you REALLY want to delete your keychain from this phone. There's no UNDO!`,
        [
          { text: 'No', style: 'cancel' },
          { text: `Yes, I'm 100% sure`, onPress: () => _confirm3(true) },
        ],
        { cancelable: false }
      );
    };

    Alert.alert(
      'Are you sure?',
      `This will delete your Ethereum keychain from this phone. Ensure you backed up the private keys. If you didn't you can lose access to all your funds. There's NO UNDO!`,
      [
        { text: 'No', style: 'cancel' },
        { text: `Yes, I'm sure`, onPress: () => _confirm2() },
      ],
      { cancelable: false }
    );
  };

  render() {
    const languages = i18nService.getSupportedLocales();

    const list = [
      {
        name: 'Password',
        icon: (<Icon name='security' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsPassword');
        }
      },
      {
        name: 'Email',
        icon: (<Icon name='email' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsEmail');
        }
      },
      {
        name: 'Push Notifications',
        icon: (<Icon name='notifications' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('NotificationsSettings');
        }
      },
      {
        name: 'Logout',
        icon: (<Icon name='power-settings-new' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          logout();
          const loginAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Login' })
            ]
          })

          this.props.navigation.dispatch(loginAction);
        }
      },
      {
        name: 'Deactivate',
        icon: (<Icon name='warning' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          alert('Please deactivate your account on the desktop');
        }
      },
      {
        name: 'Delete blockchain keychain',
        icon: (<Icon name='warning' size={ICON_SIZE} style={ styles.icon } />),
        onPress: this.wipeEthereumKeychainAction
      },
    ];

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <List containerStyle={styles.container}>
            {
              list.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  titleStyle={styles.listTitle}
                  containerStyle={styles.listItem}
                  switchButton={l.switchButton}
                  hideChevron ={l.hideChevron}
                  leftIcon={l.icon}
                  onPress= {l.onPress}
                  noBorder
                />
              ))
            }
          </List>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  scrollViewContainer: {
  },
  container: {
    flex: 1,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8,
    //height:20
  },
  listTitle: {
    padding:8,
    fontFamily: 'Roboto',
  },
  icon: {
    color: '#455a64',
    alignSelf: 'center',
  },

  header: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    textAlignVertical: 'center',
    backgroundColor: '#f4f4f4',
    width: '100%',
    //height: 40,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  cardcontainer: {
    height: 60,
    paddingTop:5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  creditcardtext: {
    textAlignVertical: 'center',
    height: 48,
    paddingLeft: 20,
  },
  deactivate: {
    paddingTop: 20,
    paddingBottom: 20,
    width:220
  }
});
