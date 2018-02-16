import React, { Component } from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import { View } from 'react-native';

import { Icon } from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons';

import NewsfeedList from './NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';
import BoostsCarousel from './boosts/BoostsCarousel';
import Topbar from './topbar/Topbar';
import CaptureFab from '../capture/CaptureFab';

/**
 * News Feed Screen
 */
@inject('newsfeed', 'tabs', 'user')
@observer
export default class NewsfeedScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <IonIcon name="md-home" size={24} color={tintColor} />
    )
  }

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.navigate('Capture');
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

    const header = (
      <View>
        <Topbar />           
        { false ?
          <BoostsCarousel boosts={newsfeed.boosts} navigation={this.props.navigation} store={newsfeed} me={this.props.user.me}/>
          : null }
      </View>
    );

    return (
      <View style={{flex:1}}>
        <CaptureFab navigation={this.props.navigation}/>
        <NewsfeedList newsfeed={newsfeed} header={header} navigation={this.props.navigation}/>
      </View>
    );
  }
}
