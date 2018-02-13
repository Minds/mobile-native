import React, {
  Component
} from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../../../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View
} from 'react-native';

import Activity from './../Activity';
import Poster from './../../Poster';

export default class RemindModal extends Component {

  render() {
    return (
      <ScrollView style={{flex:1, flexDirection:'column'}}>
        <View style={{flex:1}}>
          <Poster isRemind={true} closeAction={this.props.onClose} guid={this.props.entity.guid} />
        </View>
        <View style={{flex:4}}>
          <Activity hideTabs={true} entity={this.props.entity} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex:1,
    paddingTop: 10,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});