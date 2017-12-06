import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import {
  NavigationActions
} from 'react-navigation';

import { List, ListItem } from 'react-native-elements';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import settingsService from './SettingsService';

export default class SettingsScreen extends Component {
  state = {
    categories: []
  }

  componentWillMount() {
    settingsService.loadCategories()
      .then(categories => {
        this.setState({
          categories: categories
        });
      })
  }

  render() {
    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.header}>Password</Text>
        <FormLabel>Current Password</FormLabel>
        <FormInput/>
        <FormLabel>New Password</FormLabel>
        <FormInput />
        <FormLabel>Confirm New Password</FormLabel>
        <FormInput />
        <Text style={styles.header}>Email</Text>
        <FormLabel>Current Email</FormLabel>
        <FormInput />
        <Text style={styles.header}>Payment Methods</Text>
        <View style={styles.cardcontainer}>
          <Text style={styles.creditcardtext}>ADD A NEW CARD</Text>
          <Button backgroundColor="#4690D6"
            title='ADD' icon={{ name: 'ios-card', type: 'ionicon'}} />
        </View>
        <Text style={styles.header}>Recurring Payments</Text>
        <Text style={[styles.header, {marginTop:20}]}>Categories</Text>
        <List containerStyle={{ flex: 1}}>
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
        <Text style={[styles.header, { marginTop: 20 }]}>Deactivate Channel</Text>
        <View style={styles.deactivate}>
          <Button raised backgroundColor="#f53d3d"
            title='DEACTIVATE' icon={{ name: 'ios-warning', type: 'ionicon' }} />
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