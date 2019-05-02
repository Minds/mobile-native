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
  SafeAreaView,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { Icon } from 'react-native-elements'

import RewardsCarousel from './carousel/RewardsCarousel';
import ChannelHeader from './header/ChannelHeader';
import Toolbar from './toolbar/Toolbar';
import NewsfeedList from '../newsfeed/NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';
import Button from '../common/components/Button';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';
import CaptureFab from '../capture/CaptureFab';
import { CommonStyle } from '../styles/Common';
import UserModel from './UserModel';
import Touchable from '../common/components/Touchable';
import session from '../common/services/session.service';
import logService from '../common/services/log.service';
import { GOOGLE_PLAY_STORE } from '../config/Config';

/**
 * Channel Screen
 */
@inject('channel')
@observer
export default class ChannelScreen extends Component {

  state = {
    guid: null
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
  async componentWillMount() {
    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      const params = this.props.navigation.state.params;
      const store = this.props.channel.store(this.guid);
      if (params && params.prepend) {
        store.feedStore.stores.feed.list.prepend(params.prepend);
        // we clear the parameter to prevent prepend it again on goBack
        this.props.navigation.setParams({prepend: null});
      }
    });

    try {
      await this.initialLoad();
    } catch (e) {
      logService.exception(e);
    }
  }

  async initialLoad() {
    const params = this.props.navigation.state.params;

    if (params.entity) {
      //grab stale channel data for quick load
      this.props.channel.store(params.entity.guid)
        .setChannel(params.entity);
      // load channel from endpoint
      this.loadChannel(params.entity.guid);

    } else if (params.username) {
      await this.loadByUsername(params.username);
    } else if (params.guid) {
      await this.loadChannel(params.guid);
    }
  }

  componentWillUnmount() {
    this.disposeEnter.remove();
    this.props.channel.garbageCollect();
    this.props.channel.store(this.guid).markInactive();
  }

  async loadChannel(guid) {
    let isOwner = guid == session.guid;
    const store = this.props.channel.store(guid);

    try {
      const channel = await store.load();
      if (channel) {
        this.props.channel.addVisited(channel);
      }
    } catch (err) {

      Alert.alert(
        'Attention',
        err.message || 'Error loading channel, please try again later.',
        [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
        { cancelable: false }
      );
      return false;
    }

    if(isOwner) {
      store.feedStore.refresh();
    } else {
      store.feedStore.loadFeed();
    }
  }

  //TODO: make a reverse map so we can cache usernames
  async loadByUsername(username) {
    try {

      // get store by name and load channel
      const store = await this.props.channel.storeByName(username);
      this.setState({ guid: store.channel.guid });
      // load feed now
      store.feedStore.loadFeed();

    } catch(err) {
      Alert.alert(
        'Attention',
        'Channel not found',
        [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
        { cancelable: false }
      );
    };
  }

  get guid() {
    const params = this.props.navigation.state.params;

    let guid = params.entity ? params.entity.guid : params.guid;

    return guid || this.state.guid;
  }

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
    const store = this.props.channel.store(this.guid);

    if (!this.guid || !store.channel.guid) {
      return (
        <CenteredLoading />
      );
    }

    const feed    = store.feedStore;
    const channel = store.channel;
    const rewards = store.rewards;
    const guid    = this.guid;
    const isOwner = guid == session.guid;

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

    if (channel.is_mature && !channel.mature_visibility) {
      return (
        <View style={[CommonStyle.flexColumnCentered]}>
          <Text style={[CommonStyle.centered, CommonStyle.colorDarkGreyed, CommonStyle.fontXL]}>
            This channel contains mature content
          </Text>
          <View style={[CommonStyle.rowJustifyCenter, CommonStyle.paddingTop2x]}>
            <Button
              text="GO BACK"
              onPress={() => this.props.navigation.goBack()}
            />
            {!GOOGLE_PLAY_STORE && <Button
              inverted={true}
              text="VIEW"
              onPress={() => channel.toggleMatureVisibility()}
            />}
          </View>
        </View>
      );
    }

    // channel header
    const header = (
      <View>
        <ChannelHeader
          styles={styles}
          channel={store}
          navigation={this.props.navigation}
        />

        {!channel.blocked && <Toolbar feed={feed} hasRewards={rewards.merged && rewards.merged.length}/>}
        {carousel}
        <SafeAreaView style={styles.gobackicon}>
          <Icon raised color={colors.primary} size={22} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
        </SafeAreaView>

        {!!channel.blocked && <View style={styles.blockView}>
          <Text style={styles.blockText}>You have blocked @{channel.username}</Text>

          <Touchable onPress={() => this.props.channel.store(this.guid).toggleBlock()}>
            <Text style={styles.blockTextLink}>Tap to unblock</Text>
          </Touchable>
        </View>}
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

    const emptyRender = () => <View />;

    return (
      <View style={CommonStyle.flexContainer}>
        {!channel.blocked && <NewsfeedList
          newsfeed={feed}
          renderActivity={renderActivity}
          guid={guid}
          header={header}
          navigation={this.props.navigation}
          emptyMessage={emptyMessage}
        />}

        {/* Not using FlatList breaks header layout */}
        {channel.blocked && <FlatList
          style={{ flex: 1, backgroundColor: '#fff' }}
          ListHeaderComponent={header}
          data={[]}
          renderItem={emptyRender}
        />}

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
    top: 16
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
    flex:1,
  },
  buttonscol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    //width: 150,
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
    backgroundColor: '#eee',
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
  blockView: {
    alignItems: 'center',
  },
  blockText: {
    padding: 20,
    paddingTop: 0,
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 1,
  },
  blockTextLink: {
    padding: 20,
    paddingTop: 0,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    color: colors.primary
  },
});
