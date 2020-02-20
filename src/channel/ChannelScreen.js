import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react'

import { Icon } from 'react-native-elements';

import ChannelHeader from './header/ChannelHeader';
import Toolbar from './toolbar/Toolbar';
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
import i18n from '../common/services/i18n.service';
import FeedList from '../common/components/FeedList';
import { FLAG_VIEW } from '../common/Permissions';
import SubscriptionButton from './subscription/SubscriptionButton';
import SubscriptionRequestList from './subscription/SubscriptionRequestList';

/**
 * Channel Screen
 */
export default
@inject('channel', 'subscriptionRequest')
@observer
class ChannelScreen extends Component {
  /**
   * State
   */
  state = {
    guid: null,
  };

  /**
   * Load data on mount
   */
  async componentWillMount() {
    this.disposeEnter = this.props.navigation.addListener('focus', () => {
      const params = this.props.route.params;
      const store = this.props.channel.store(this.guid);
      if (params && params.prepend) {
        if (store.channel && store.channel.isOwner && store.channel.isOwner()) {
          store.feedStore.feedStore.prepend(params.prepend);
        }
        // we clear the parameter to prevent prepend it again on goBack
        this.props.navigation.setParams({prepend: null});
      }
    });

    try {
      await this.initialLoad();
    } catch (err) {
      logService.exception('[ChannelScreen]', err);
    }
  }

  /**
   * Initial load
   */
  async initialLoad() {
    const params = this.props.route.params;

    if (params.entity) {
      // load channel from endpoint
      this.loadChannel(params.entity);

    } else if (params.username) {
      await this.loadByUsername(params.username);
    } else if (params.guid) {
      await this.loadChannel(params.guid);
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    if (this.disposeEnter) {
      this.disposeEnter();
    }
    this.props.channel.garbageCollect();
    this.props.channel.store(this.guid).markInactive();
  }

  /**
   * Load channel
   * @param {string|UserModel} channelOrGuid
   */
  async loadChannel(channelOrGuid) {
    const isModel = channelOrGuid instanceof UserModel;
    const guid = isModel ? channelOrGuid.guid : channelOrGuid;
    const store = this.props.channel.store(guid);

    try {
      const channel = await store.load(isModel ? channelOrGuid : undefined);

      if (channel) {
        // check permissions
        if (!this.checkCanView(channel)) return;

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

    store.feedStore.refresh();
  }

  /**
   * Check if the current user can view this channel
   * @param {UserModel} channel
   */
  checkCanView(channel) {
    // if the channel obj doesn't have the permissions loaded return true
    if (channel.isClosed() || !channel.permissions.permissions) {
      return true
    }

    if (!channel.can(FLAG_VIEW, true)) {
      this.props.navigation.goBack();
      return false;
    }
    return true;
  }

  //TODO: make a reverse map so we can cache usernames
  async loadByUsername(username) {
    try {

      // get store by name and load channel
      const store = await this.props.channel.storeByName(username);
      this.setState({ guid: store.channel.guid });

      // check permissions
      if (!this.checkCanView(store.channel)) return;

      // load feed now
      store.feedStore.loadFeed();

    } catch (err) {
      Alert.alert(
        i18n.t('attention'),
        i18n.t('channel.notFound'),
        [{ text: i18n.t('ok'), onPress: () => this.props.navigation.goBack() }],
        { cancelable: false }
      );
    }
  }

  get guid() {
    const params = this.props.route.params;

    let guid = params.entity ? params.entity.guid : params.guid;

    return guid || this.state.guid;
  }

  /**
   * navigate to create post
   */
  createPost = () => {
    this.props.navigation.navigate('Capture');
  }

  getHeader(store) {
    const feed    = store.feedStore;
    const channel = store.channel;
    const rewards = store.rewards;
    const showClosed = channel.isClosed() && !channel.subscribed && !channel.isOwner();

    return (
      <View>
        <ChannelHeader
          styles={styles}
          store={store}
          navigation={this.props.navigation}
        />

        {!channel.blocked && !showClosed &&
          <Toolbar
            feed={feed}
            subscriptionRequest={this.props.subscriptionRequest}
            channel={channel}
            hasRewards={rewards.merged && rewards.merged.length}
          />
        }

        {!!channel.blocked &&
          <View style={styles.blockView}>
            <Text style={styles.blockText}>{i18n.t('channel.blocked',{username: channel.username})}</Text>

            <Touchable onPress={this.toggleBlock}>
              <Text style={styles.blockTextLink}>{i18n.t('channel.tapUnblock')}</Text>
            </Touchable>
          </View>
        }
        {!!showClosed && !channel.blocked  &&
          <View style={styles.blockView}>
            <Text style={styles.blockText}>{i18n.t('channel.isClosed')}</Text>
            <SubscriptionButton channel={channel} />
          </View>
        }
      </View>
    );
  }

  /**
   * Toggle block channel
   */
  toggleBlock = () => {
    this.props.channel.store(this.guid).channel.toggleBlock();
  }

  /**
   * Nav to prev screen
   */
  goBack = () => {
    this.props.navigation.goBack();
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

    /**
     * We check in the render method in order to observe the changes of the channels permissions
     * this is needed because in some cases the channel is shown using the owner of an activity
     * while we refresh the channel's data from the server
     */
    if (!this.checkCanView(store.channel)) return null;

    const feed    = store.feedStore;
    const channel = store.channel;
    const rewards = store.rewards;
    const guid    = this.guid;
    const isOwner = guid == session.guid;
    const isClosed = channel.isClosed() && !channel.subscribed && !channel.isOwner();

    let emptyMessage = null;

    if (channel.is_mature && !channel.mature_visibility) {
      return (
        <View style={[CommonStyle.flexColumnCentered]}>
          <Text style={[CommonStyle.centered, CommonStyle.colorDarkGreyed, CommonStyle.fontXL]}>
            {i18n.t('channel.mature')}
          </Text>
          <View style={[CommonStyle.rowJustifyCenter, CommonStyle.paddingTop2x]}>
            <Button
              text={i18n.t('goback')}
              onPress={() => this.props.navigation.goBack()}
            />
            {!GOOGLE_PLAY_STORE && <Button
              inverted={true}
              text={i18n.t('view')}
              onPress={() => channel.toggleMatureVisibility()}
            />}
          </View>
        </View>
      );
    }

    // channel header
    const header = this.getHeader(store);

    let renderActivity = null, body = null;

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
           {i18n.t('channel.createFirstPost')}
          </Text>
          <Button text={i18n.t('create')} onPress={this.createPost} />
        </View>
      );
    }

    body = feed.filter != 'requests' ?
      <FeedList
        feedStore={feed.feedStore}
        renderActivity={renderActivity}
        header={header}
        navigation={this.props.navigation}
        emptyMessage={emptyMessage}
      /> :
      <SubscriptionRequestList
        ListHeaderComponent={header}
        style={[CommonStyle.flexContainer]}
      />

    return (
      <View style={CommonStyle.flexContainer} testID="ChannelScreen">
        { (!channel.blocked && !isClosed) ? body : header }
        <SafeAreaView style={styles.gobackicon}>
          <Icon raised color={colors.primary} size={22} name='arrow-back' onPress={this.goBack}/>
        </SafeAreaView>
        <CaptureFab navigation={this.props.navigation} testID="captureFab"/>
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
    justifyContent: 'flex-start',
    //width: 150,
    alignSelf:'flex-start'
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
    fontSize: 14,
    color: '#999'
  },
  name: {
    fontWeight: '700',
    fontFamily: 'Roboto',
    fontSize: 22,
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
