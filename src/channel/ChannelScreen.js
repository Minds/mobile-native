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
    //grab stale channel data for quick load
    if (this.props.navigation.state.params.entity)
      this.props.channel.store(this.props.navigation.state.params.entity.guid)
        .setChannel(this.props.navigation.state.params.entity);
  }

  componentDidMount() {
    this.props.channel.store(this.guid).load();
    this.props.channel.store(this.guid).loadFeeds();
    //this.props.channel.loadrewards(this.guid);
  }

  componentWillUnmount() {
    this.props.channel.garbageCollect();
    this.props.channel.store(this.guid).markInactive();
  }

  get guid(){
    return this.props.navigation.state.params.guid;
  }

  /**
   * Render
   */
  render() {
    const feed = this.props.channel.store(this.guid).feedStore;
    const channel     = this.props.channel.store(this.guid).channel;
    const rewards     = this.props.channel.store(this.guid).rewards;
    const guid        = this.guid;

    if (!channel.guid) {
      return (
        <CenteredLoading />
      );
    }

    let carousel = null;

    // carousel only visible if we have data
    /*if (rewards.merged && rewards.merged.length && channelfeed.showrewards) {
      carousel = (
        <View style={styles.carouselcontainer}>
          <RewardsCarousel rewards={rewards.merged} />
        </View>
      );
    }*/

    // channel header
    const header = (
      <View>
        <ChannelHeader styles={styles} me={this.props.user.me} channel={this.props.channel.store(this.guid)} navigation={this.props.navigation} />
        <Toolbar feed={feed} hasRewards={rewards.merged && rewards.merged.length}/>
        {carousel}
        <Icon color="white" containerStyle={styles.gobackicon} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()} />
      </View>
    );

    return (
      <NewsfeedList newsfeed={feed} guid={guid} header={header} navigation={this.props.navigation} />
    );
  }
}

// style
const styles = StyleSheet.create({
  gobackicon: {
    position: 'absolute',
    left: 0,
    top: 16,
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
    width: 150,
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
    fontWeight: '800',
    fontSize: 20,
    letterSpacing: 0.5,
    color: '#444',
  },
  countertitle: {
    color: '#666',
    fontSize: 10
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
    color: '#444',
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
  bluebutton: {
    marginRight: 8,
  },
});