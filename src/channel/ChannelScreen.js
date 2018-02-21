import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  Image,
  View,
  Alert,
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
import channelService from './ChannelService';
import CenteredLoading from '../common/components/CenteredLoading';
import Button from '../common/components/Button';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';
import CaptureFab from '../capture/CaptureFab';
import { CommonStyle } from '../styles/Common';



/**
 * Channel Screen
 */
@inject('user')
@inject('channel')
@observer
export default class ChannelScreen extends Component {

  state = {
    edit: false,
    guid: ''
  };

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

    if (this.props.navigation.state.params.username) {
      this.loadByUsername(this.props.navigation.state.params.username);
    }
  }

  componentDidMount() {
    if(this.guid){
      this.props.channel.store(this.guid).load()
        .then(channel => {
          // add visited channels
          if (channel) this.props.channel.addVisited(channel);
        });

      this.props.channel.store(this.guid).feedStore.loadFeed();
    }
    //this.props.channel.loadrewards(this.guid);
  }

  componentWillUnmount() {
    this.props.channel.garbageCollect();
    this.props.channel.store(this.guid).markInactive();
  }

  //TODO: make a reverse map so we can cache usernames
  async loadByUsername(username) {
    try {
      let response = await channelService.load(username);

      this.setState({ guid: response.channel.guid });
      this.props.channel.store(response.channel.guid)
        .setChannel(response.channel);
      //this.props.channel.store(response.channel.guid).loadFeeds();
    } catch(err) {
      Alert.alert(
        'Atention',
        'Channel not found',
        [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
        { cancelable: false }
      );
    };
  }

  get guid(){
    return this.props.navigation.state.params.guid ? this.props.navigation.state.params.guid: this.state.guid;
  }

  onEditAction = async payload => {
    if (this.state.edit) {
      await this.props.channel.store(this.guid).save(payload);
      this.setState({ edit: false });
      this.props.channel.store(this.guid).load();
      this.props.user.load();
    } else {
      this.setState({ edit: true });
    }
  };

  /**
   * navigate to create post
   */
  createPost = () => {
    this.props.navigation.navigate('Capture');
  }

  /**
   * Render
   */
  render() {
    const feed    = this.props.channel.store(this.guid).feedStore;
    const channel = this.props.channel.store(this.guid).channel;
    const rewards = this.props.channel.store(this.guid).rewards;
    const guid    = this.guid;
    const isOwner = guid == this.props.user.me.guid;

    if (!channel.guid) {
      return (
        <CenteredLoading />
      );
    }

    let emptyMessage = null;
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
        <ChannelHeader
          styles={styles}
          me={this.props.user.me}
          channel={this.props.channel.store(this.guid)}
          navigation={this.props.navigation}
          edit={this.state.edit}
          onEdit={this.onEditAction}
        />

        <Toolbar feed={feed} hasRewards={rewards.merged && rewards.merged.length}/>
        {carousel}
        <Icon raised color={colors.primary} containerStyle={styles.gobackicon} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()} />
      </View>
    );

    let renderActivity = null

    // is a blog? use blog card to render
    if(feed.filter == 'blogs') {
      renderActivity = (row) => {
        return <BlogCard entity={row.item} navigation={this.props.navigation}/>
      }
    }

    // is owner? show custom empty message
    if (isOwner) {
      emptyMessage = (
        <View style={CommonStyle.centered}>
          <Text style={[CommonStyle.fontXL, CommonStyle.textCenter, CommonStyle.padding2x]}>
            Create your first post
          </Text>
          <Button text="Create" onPress={this.createPost} />
        </View>
      );
    }

    return (
      <View style={CommonStyle.flexContainer}>
        <NewsfeedList
          newsfeed={feed}
          renderActivity={renderActivity}
          guid={guid}
          header={header}
          navigation={this.props.navigation}
          emptyMessage={emptyMessage}
        />
        <CaptureFab navigation={this.props.navigation} />
      </View>
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
    flex: 1,
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
    fontWeight: '700',
    fontFamily: 'Roboto',
    fontSize: 20,
    letterSpacing: 0.5,
    marginRight: 8,
    color: '#444',
  },
  nameTextInput: {
    color: '#444',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ececec',
    padding: 3,
    fontWeight: '700',
    fontFamily: 'Roboto',
    fontSize: 20,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  briefdescription: {
    fontSize: 13,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#777',
    fontFamily: 'Roboto',
  },
  briefdescriptionTextInputView: {
    marginTop: 20,
    marginBottom: 20,
    padding: 8,
    paddingTop: 3,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ececec',
  },
  briefdescriptionTextInput: {
    maxHeight: 100,
    fontSize: 13,
    color: '#777',
    fontFamily: 'Roboto',
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
  wrappedAvatar: {
    height: 110,
    width: 110,
    borderRadius: 55
  },
  wrappedAvatarOverlayView: {
    borderRadius: 55,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
  bluebutton: {
    marginRight: 8,
  },
  tapOverlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
