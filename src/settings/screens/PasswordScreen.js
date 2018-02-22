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

import session from './../../common/services/session.service';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from '../SettingsService';
import i18nService from '../../common/services/i18n.service';

export default class SettingsScreen extends Component {

  render() {
    
    return (
      <View style={styles.container}>
        <FormLabel>{i18nService.t('settings.currentPassword')}</FormLabel>
        <FormInput/>
        <FormLabel>{i18nService.t('settings.newPassword')}</FormLabel>
        <FormInput />
        <FormLabel>{i18nService.t('settings.confirmNewPassword')}</FormLabel>
        <FormInput />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  language: {
    marginLeft: 10,
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
