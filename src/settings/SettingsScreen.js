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

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import authService from './../auth/AuthService';
import { ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from './SettingsService';
import settingsStore from './SettingsStore';

import i18n from '../common/services/i18n.service';
import appStores from '../../AppStores';
import logService from '../common/services/log.service';
import storageService from '../common/services/storage.service';
import { observer } from 'mobx-react';
import ModalPicker from '../common/components/ModalPicker';
import ThemedStyles from '../styles/ThemedStyles';
import featuresService from '../common/services/features.service';

const ICON_SIZE = 24;

export default
@observer
class SettingsScreen extends Component {

  // static navigationOptions = {
  //   title: 'Settings',
  //   leftHandedInitial: false,
  // };

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

  setDarkMode = () => {
    if (ThemedStyles.theme) {
      ThemedStyles.setLight();
    } else {
      ThemedStyles.setDark();
    }
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
    const CS = ThemedStyles.style;
    const languages = i18n.getSupportedLocales();

    const list = [
      {
        name: i18n.t('language')+` (${i18n.getCurrentLocale()})`,
        icon: (<Icon name='flag' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.showLanguages();
        }
      },
      {
        name: i18n.t('auth.password'),
        icon: (<Icon name='security' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsPassword');
        }
      },
      {
        name: i18n.t('auth.email'),
        icon: (<Icon name='email' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsEmail');
        }
      },
      {
        name: i18n.t('settings.pushNotification'),
        icon: (<Icon name='notifications' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.props.navigation.navigate('NotificationsSettings');
        }
      },
      {
        name: i18n.t('settings.blockedChannels'),
        icon: (<Icon name='block' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsBlockedChannels');
        }
      },
      {
        name: i18n.t('settings.regenerateKey'),
        icon: (<Icon name='vpn-key' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        onPress: () => {
          this.props.navigation.navigate('SettingsRekey');
        }
      },
      {
        name: i18n.t('settings.logout'),
        icon: (<Icon name='power-settings-new' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]} />),
        onPress: () => {
          authService.logout();
        }
      },
      {
        name: i18n.t('settings.deactivate'),
        icon: (<Icon name='warning' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]} />),
        onPress: () => {
          this.props.navigation.push('DeleteChannel');
        }
      },
      {
        name: i18n.t('settings.deleteBlockchain'),
        icon: (<Icon name='warning' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]} />),
        onPress: this.wipeEthereumKeychainAction
      },

      // ListView used by log package is deprecated
      // {
      //   name: i18n.t('settings.logs'),
      //   icon: (<Icon name='list' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
      //   onPress: () => {
      //     this.props.navigation.push('Logs');
      //   }
      // },
      {
        name: i18n.t('settings.logOnlyErrors'),
        icon: (<Icon name='list' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        switch: {value: !settingsStore.appLog, onValueChange: this.appLogActivate},
        hideChevron: true,
      },
      {
        name: i18n.t('settings.leftHandedMode'),
        icon: (<MaterialCommunityIcons name='hand' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        switch: {value: settingsStore.leftHanded, onValueChange: this.leftHandedActivate},
        hideChevron: true,
      },
    ];

    if (featuresService.has('dark-mode')) {
      list.push({
        name: i18n.t('settings.darkMode'),
        icon: (<MaterialCommunityIcons name='hand' size={ICON_SIZE} style={[styles.icon, CS.colorPrimaryText]}/>),
        switch: {value: !!ThemedStyles.theme, onValueChange: this.setDarkMode},
        hideChevron: true,
      });
    }

    return (
        <ScrollView style={[styles.scrollView, CS.backgroundPrimary]}>
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
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                titleStyle={[CS.fontL, CS.colorPrimaryText, CS.paddingVertical2x]}
                containerStyle={styles.listItem}
                subtitle={l.subtitle}
                hideChevron ={l.hideChevron}
                switch={l.switch}
                leftIcon={l.icon}
                onPress= {l.onPress}
              />
            ))
          }
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
    flexDirection: 'column',
    flex:1
  },
  container: {
    flex: 1,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  listItem: {
    backgroundColor: 'transparent'
    //height:20
  },
  listTitle: {
    padding:8,
    fontFamily: 'Roboto',
  },
  icon: {
    alignSelf: 'center',
  },

  header: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    textAlignVertical: 'center',
    // backgroundColor: '#f4f4f4',
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
