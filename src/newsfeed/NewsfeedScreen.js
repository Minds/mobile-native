import React, { Component } from 'react';
import {
  FlatList,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';

/**
 * News Feed Screen
 */
@inject('newsfeed')
export default class NewsfeedScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  render() {
    const newsfeed = this.props.newsfeed;

    return (
      <NewsfeedList newsfeed={newsfeed} navigation={this.props.navigation}/>
    );
  }
}