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
  Button
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { Icon } from 'react-native-elements'
import { MINDS_URI } from '../config/Config';

import RewardsCarousel from './carousel/RewardsCarousel';
import ChannelHeader from './header/ChannelHeader';
import Toolbar from './toolbar/Toolbar';
import NewsfeedList from '../newsfeed/NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';

/**
 * Channel Screen
 */
@inject('user')
@inject('channel')
@inject('channelfeed')
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
    const guid = this.getGuid();
    this.props.channel.load(guid);
    this.props.channelfeed.setGuid(guid);
    this.props.channelfeed.loadFeed();
    this.props.channel.loadrewards(guid);
  }

  componentWillUnmount() {
    this.props.channelfeed.clearFeed();
    this.props.channel.clear();
  }

  getGuid(){
    return this.props.navigation.state.params.guid;
  }

  /**
   * Render
   */
  render() {
    const channel     = this.props.channel.channel;
    const rewards     = this.props.channel.rewards;
    const channelfeed = this.props.channelfeed;
    const guid        = this.getGuid();

    if (!channel.guid) {
      return (
        <CenteredLoading />
      );
    }

    let carousel = null;

    // carousel only visible if we have data
    if (rewards.merged && rewards.merged.length && channelfeed.showrewards) {
      carousel = (
        <View style={styles.carouselcontainer}>
          <RewardsCarousel rewards={rewards.merged} />
        </View>
      );
    }

    // channel header
    const header = (
      <View>
        <ChannelHeader styles={styles} me={this.props.user.me} channel={this.props.channel} navigation={this.props.navigation} />
        <Toolbar hasRewards={rewards.merged && rewards.merged.length}/>
        {carousel}
        <Icon color="white" containerStyle={styles.gobackicon} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()} />
      </View>
    );

    return (
      <NewsfeedList newsfeed={channelfeed} guid={guid} header={header} navigation={this.props.navigation} />
    );
  }
}

// style
const styles = StyleSheet.create({
  gobackicon: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  namecol: {
    flex:1
  },
  namecontainer: {
    flexDirection: 'row',
    flex:1
  },
  buttonscol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
    alignSelf:'flex-end'
  },
  carouselcontainer: {
    flex: 1,
    paddingBottom: 20
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
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
  },
});