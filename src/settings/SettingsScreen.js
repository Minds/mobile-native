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
  StackActions,
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import authService from './../auth/AuthService';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from './SettingsService';
import settingsStore from './SettingsStore';

import i18n from '../common/services/i18n.service';
import appStores from '../../AppStores';
import logService from '../common/services/log.service';
import storageService from '../common/services/storage.service';
import { observer } from 'mobx-react/native';
import ModalPicker from '../common/components/ModalPicker';

const ICON_SIZE = 24;

@observer
export default class SettingsScreen extends Component {

  static navigationOptions = {
    title: 'Settings',
    leftHandedInitial: false,
  };

  state = {
    showLanguages: false,
  }

  componentWillMount() {

    this.setState({
      language: i18n.getCurrentLocale()
    });
  }

  appLogActivate = () => {
    settingsStore.setAppLog(!settingsStore.appLog);
  }

  leftHandedActivate = () => {
    settingsStore.setLeftHanded(!settingsStore.leftHanded);
  }

  wipeEthereumKeychainAction = () => {
    const _confirm3 = async (confirmation) => {
      await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

      await appStores.blockchainWallet._DANGEROUS_wipe(confirmation);

      Alert.alert(i18n.t('attention'), i18n.t('settings.keychainRemoved'));
    };

    const _confirm2 = async () => {
      await new Promise(r => setTimeout(r, 500)); // Modals have a "cooldown"

      Alert.alert(
        i18n.t('settings.confirmMessage'),
        i18n.t('settings.confirmDeleteKeychain2'),
        [
          { text: i18n.t('no'), style: 'cancel' },
          { text: i18n.t('yesImSure'), onPress: () => _confirm3(true) },
        ],
        { cancelable: false }
      );
    };

    Alert.alert(
      i18n.t('settings.confirmMessage'),
      i18n.t('settings.confirmDeleteKeychain1'),
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yesImSure'), onPress: () => _confirm2() }
      ],
      { cancelable: false }
    );
  };

  render() {
    const languages = i18n.getSupportedLocales();

    const list = [
      {
        name: i18n.t('language')+` (${i18n.getCurrentLocale()})`,
        icon: (<Icon name='flag' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.showLanguages();
        }
      },
      {
        name: i18n.t('auth.password'),
        icon: (<Icon name='security' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsPassword');
        }
      },
      {
        name: i18n.t('auth.email'),
        icon: (<Icon name='email' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsEmail');
        }
      },
      {
        name: i18n.t('settings.pushNotification'),
        icon: (<Icon name='notifications' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('NotificationsSettings');
        }
      },
      {
        name: i18n.t('settings.blockedChannels'),
        icon: (<Icon name='block' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsBlockedChannels');
        }
      },
      {
        name: i18n.t('settings.regenerateKey'),
        icon: (<Icon name='vpn-key' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsRekey');
        }
      },
      {
        name: i18n.t('settings.logout'),
        icon: (<Icon name='power-settings-new' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          authService.logout();
          const loginAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Login' })
            ]
          })

          this.props.navigation.dispatch(loginAction);
        }
      },
      {
        name: i18n.t('settings.deactivate'),
        icon: (<Icon name='warning' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          this.props.navigation.push('DeleteChannel');
        }
      },
      {
        name: i18n.t('settings.deleteBlockchain'),
        icon: (<Icon name='warning' size={ICON_SIZE} style={ styles.icon } />),
        onPress: this.wipeEthereumKeychainAction
      },
      {
        name: i18n.t('settings.logs'),
        icon: (<Icon name='list' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.push('Logs');
        }
      },
      {
        name: i18n.t('settings.logOnlyErrors'),
        icon: (<Icon name='list' size={ICON_SIZE} style={ styles.icon }/>),
        switchButton: true,
        hideChevron: true,
        switched: !settingsStore.appLog,
        onSwitch: this.appLogActivate
      },
      {
        name: i18n.t('settings.leftHandedMode'),
        icon: (<MaterialCommunityIcons name='hand' size={ICON_SIZE} style={ styles.icon }/>),
        switchButton: true,
        hideChevron: true,
        switched: settingsStore.leftHanded,
        onSwitch: this.leftHandedActivate
      },
    ];

    return (
      <ScrollView style={styles.scrollView}>
        <ModalPicker
          onSelect={this.languageSelected}
          onCancel={this.cancel}
          show={this.state.showLanguages}
          title={i18n.t('language')}
          valueField="value"
          labelField="name"
          value={this.state.language}
          items={languages}
        />
        <View style={styles.scrollViewContainer}>
          <List containerStyle={styles.container}>
            {
              list.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  titleStyle={styles.listTitle}
                  containerStyle={styles.listItem}
                  subtitle={l.subtitle}
                  switchButton={l.switchButton}
                  hideChevron ={l.hideChevron}
                  onSwitch={l.onSwitch}
                  switched={l.switched}
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

  showLanguages = () => {
    this.setState({showLanguages: true});
  }

  /**
   * Language selected
   */
  languageSelected = (language) => {
    this.setState({language, showLanguages: false});
    i18n.setLocale(language);
  }

  cancel = () => {
    this.setState({showLanguages: false});
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
