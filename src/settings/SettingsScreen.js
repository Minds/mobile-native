import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Picker
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import session from './../common/services/session.service';
import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from './SettingsService';

import i18nService from '../common/services/i18n.service';

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


  onPressLogout = () => {
    session.logout();
    const loginAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })

    this.props.navigation.dispatch(loginAction);
  }

  render() {
    const languages = i18nService.getSupportedLocales();

    const optlist = [
      {
        name: 'Autoplay videos',
        switchButton: true,
      }, {
        name: 'Points animation',
        switchButton: true,
      }
    ];

    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.header}>{i18nService.t('language')}</Text>
        <Picker
          selectedValue={this.state.language}
          onValueChange={this.changeLanguage}
          style={styles.language}>
          {
            languages.map(lang => {
              return <Picker.Item label={lang.name} value={lang.value} key={lang.value}/>
            })
          }
        </Picker>
        <Text style={styles.header}>{i18nService.t('settings.options')}</Text>
        <List containerStyle={{ flex: 1, borderTopWidth: 0, borderBottomWidth: 0 }}>
          {
            optlist.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                titleStyle={{ padding: 8 }}
                style={styles.listItem}
                switchButton={l.switchButton}
                hideChevron={true}
                onPress={l.onPress}
              />
            ))
          }
        </List>
        <Text style={styles.header}>{i18nService.t('auth.password')}</Text>
        <FormLabel>{i18nService.t('settings.currentPassword')}</FormLabel>
        <FormInput/>
        <FormLabel>{i18nService.t('settings.newPassword')}</FormLabel>
        <FormInput />
        <FormLabel>{i18nService.t('settings.confirmNewPassword')}</FormLabel>
        <FormInput />
        <Text style={styles.header}>Email</Text>
        <FormLabel>{i18nService.t('settings.currentEmail')}</FormLabel>
        <FormInput />
        <Text style={styles.header}>{i18nService.t('settings.paymentMethods')}</Text>
        <View style={styles.cardcontainer}>
          <Text style={styles.creditcardtext}>{i18nService.t('settings.addCard')}</Text>
          <Button backgroundColor="#4690D6"
            title={i18nService.t('settings.add')} icon={{ name: 'ios-card', type: 'ionicon'}} />
        </View>
        <Text style={styles.header}>{i18nService.t('settings.recurringPayments')}</Text>
        <Text style={[styles.header, { marginTop: 20 }]}>{i18nService.t('categories')}</Text>
        <List containerStyle={{ flex: 1, borderTopWidth: 0, borderBottomWidth: 0}}>
          {
            this.state.categories.map((l, i) => (
              <ListItem
              key={i}
              title={l.label}
              hideChevron={true}
              />
            ))
          }
        </List>
        <Text style={[styles.header, { marginTop: 20 }]}>{i18nService.t('settings.logout')}</Text>
        <View style={styles.deactivate}>
          <Button raised backgroundColor="#4690D6"
            title={i18nService.t('settings.logout')} onPress={ () => {this.onPressLogout()}}/>
        </View>
        <Text style={[styles.header, { marginTop: 20 }]}>{i18nService.t('settings.deactivateChannel')}</Text>
        <View style={styles.deactivate}>
          <Button raised backgroundColor="#f53d3d"
            title={i18nService.t('settings.deactivate')} icon={{ name: 'ios-warning', type: 'ionicon' }} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  language: {
    marginLeft: 10,
  },
  header: {
    paddingLeft: 20,
    textAlignVertical: 'center',
    backgroundColor: '#f4f4f4',
    width: '100%',
    height: 40,
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
    width:180
  }
});