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

export default class EmailScreen extends Component {

  render() {
    const languages = i18nService.getSupportedLocales();

    const optlist = [
      {
        name: 'Points animation',
        switchButton: true,
      }
    ];

    return (
      <View style={styles.container}>
        <FormLabel>{i18nService.t('settings.currentEmail')}</FormLabel>
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
});
