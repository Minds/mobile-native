import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';
import Poster from './Poster';
import CenteredLoading from '../common/components/CenteredLoading';

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

    if (!newsfeed.list.loaded) {
      return (
        <CenteredLoading/>
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
