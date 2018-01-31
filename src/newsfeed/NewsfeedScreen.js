import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import { View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';
import BoostsCarousel from './boosts/BoostsCarousel';
import Topbar from './topbar/Topbar';

/**
 * News Feed Screen
 */
@inject('newsfeed', 'tabs', 'user')
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
    this.props.newsfeed.loadBoosts();

    // on tap news feed again refresh
    this.disposeState = this.props.tabs.onState((state) => {
      if (!state.previousScene) return;
      if (state.previousScene.key == "Newsfeed" && state.previousScene.key == state.scene.route.key) {
        this.props.newsfeed.refresh();
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.navigation.state.params && nextProps.navigation.state.params.prepend)
      nextProps.newsfeed.prepend(nextProps.navigation.state.params.prepend);
  }

  /**
   * Dispose autorun of tabstate
   */
  componentWillUnmount() {
    this.disposeState();
  }

  render() {
    const newsfeed = this.props.newsfeed;

    if (!newsfeed.list.loaded) {
      return <CenteredLoading/>
    }

    const header = (
      <View>
        <Topbar />
        { false ? 
          <BoostsCarousel boosts={newsfeed.boosts} navigation={this.props.navigation} store={newsfeed} me={this.props.user.me}/>
          : null }
      </View>
    );

    return (
      <NewsfeedList newsfeed={newsfeed} header={header} navigation={this.props.navigation}/>
    );
  }
}
