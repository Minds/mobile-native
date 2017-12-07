import React, { Component } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';
import Poster from './Poster';
/**
 * News Feed Screen
 */
@inject('newsfeed')
@observer
export default class NewsfeedScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  /**
   * Load data on mount
   */
  componentWillMount() {
    this.props.newsfeed.loadFeed();
  }


  render() {
    const newsfeed = this.props.newsfeed;

    if (!newsfeed.loaded) {
      return (
        <View style={styles.activitycontainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    const poster = (
      <Poster/>
    );

    return (
      <NewsfeedList newsfeed={newsfeed} header={poster} navigation={this.props.navigation}/>
    );
  }
}

const styles = {
  activitycontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  }
}