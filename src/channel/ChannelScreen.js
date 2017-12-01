import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  Button
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../config/Config';

import abbrev from '../common/helpers/abbrev';
import RewardsCarousel from './carousel/RewardsCarousel';

import ChannelHeader from './header/ChannelHeader';

/**
 * Channel Screen
 */
@inject('channel')
@observer
export default class ChannelScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  /**
   * Load data on mount
   */
  componentWillMount() {
    const guid = this.props.navigation.state.params.guid;
    this.props.channel.load(guid);
    this.props.channel.loadrewards(guid);
  }

  /**
   * Render
   */
  render() {
    const channel = this.props.channel.channel;
    const rewards = this.props.channel.rewards;

    if (!channel.guid) {
      return (
        <ActivityIndicator size={'large'} />
      );
    }

    return (
      <ScrollView style={styles.container}>
        <ChannelHeader styles={styles} channel={channel} />
        <RewardsCarousel rewards={rewards} styles={styles}/>
        <View style={styles.body}>
        </View>
      </ScrollView>
    );
  }
}

// style
const styles = StyleSheet.create({
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  body: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#aaa',
    paddingLeft: 15,
    paddingRight: 15,
  },
  rewardicon: {
    color: '#0071ff',
    width: 30
  },
  rewardamount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  rewarddesc: {
    color: '#999'
  },
  carousel: {
    flex: 1,
  },
  carouselitems: {
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 190,
  },
  briefdescription: {
    fontSize: 12,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#919191'
  },
  headercontainer: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
  },
  username: {
    fontSize: 10,
    color: '#999'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  countertitle: {
    color: '#666',
    fontSize: 10
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row'
  },
  counter: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 135,
    height: 110,
    width: 110,
    borderRadius: 55
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  }
});