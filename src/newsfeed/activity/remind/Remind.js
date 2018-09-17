import React, {
  Component
} from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../../../config/Config';

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
import BlogCard from '../../../blogs/BlogCard';
import BlogModel from '../../../blogs/BlogModel';
import Poster from './../../Poster';

export default class RemindModal extends Component {

  render() {
    const ShowComponent = this.props.entity.subtype == 'blog' ? BlogCard : Activity;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.posterWrapper}>
          <Poster isRemind={true} closeAction={this.props.onClose} guid={this.props.entity.guid} />
        </View>
        <View style={styles.bodyContainer}>
          <ShowComponent hideTabs={true} entity={this.props.entity} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column'
  },
  posterWrapper: {
    flex:1,
    paddingLeft:8
  },
  bodyContainer: {
    flex:4,
    paddingTop:5
  }
});