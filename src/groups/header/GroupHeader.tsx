//@ts-nocheck
import React, { Component } from 'react';

import { Image, View, StyleSheet, Alert } from 'react-native';

import { observer, inject } from 'mobx-react';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SmartImage from '../../common/components/SmartImage';

import { MINDS_CDN_URI, MINDS_LINK_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import Toolbar from '../../common/components/toolbar/Toolbar';
import i18n from '../../common/services/i18n.service';
import { FLAG_JOIN } from '../../common/Permissions';
import Button from '../../common/components/Button';
import ThemedStyles from '../../styles/ThemedStyles';
import ShareService from '../../share/ShareService';
import ActivityIndicator from '../../common/components/ActivityIndicator';
import type GroupsBarStore from '../GroupsBarStore';
import GroupViewStore from '../GroupViewStore';
import DismissKeyboard from '../../common/components/DismissKeyboard';
import AnimatedSearch from './AnimatedSearch';
import BottomSheet from '../../common/components/bottom-sheet/BottomSheet';
import MenuItem from '../../common/components/bottom-sheet/MenuItem';
import BottomSheetButton from '../../common/components/bottom-sheet/BottomSheetButton';
import MText from '../../common/components/MText';

type PropsTypes = {
  groupsBar: GroupsBarStore;
  store: GroupViewStore;
};

/**
 * Group Header
 */
@inject('groupsBar')
@observer
export default class GroupHeader extends Component<PropsTypes> {
  state = {
    openingGathering: false,
  };
  avatarStyle: any;
  userAvatarStyle: any;
  refActionSheet = React.createRef();

  constructor(props) {
    super(props);
    this.avatarStyle = ThemedStyles.combine(
      props.styles.avatar,
      'bcolorPrimaryBackground',
    );
    this.userAvatarStyle = ThemedStyles.combine(
      props.styles.userAvatar,
      'bcolorPrimaryBackground',
    );
  }

  componentDidMount() {
    const group = this.props.store.group;
    this.props.groupsBar.markAsRead(group, 'activity');
  }

  /**
   * Get Group Banner
   */
  getBannerFromGroup() {
    const group = this.props.store.group;
    if (!group) {
      return null;
    }
    return (
      MINDS_CDN_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime
    );
  }

  /**
   * Share group
   */
  share = () => {
    if (this.props.store.group !== null) {
      ShareService.share(
        this.props.store.group.name,
        MINDS_LINK_URI + `groups/profile/${this.props.store.group.guid}/feed`,
      );
    }
  };

  /**
   * Get Group Avatar
   */
  getAvatar() {
    const group = this.props.store.group;
    return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    const store = this.props.store;
    const group = store.group;

    const buttonProps = {
      onPress: !group['is:member'] ? store.join : store.leave,
      text: i18n.t(!group['is:member'] ? 'join' : 'leave'),
    };

    return (
      <Button
        {...buttonProps}
        accessibilityLabel={i18n.t('groups.subscribeMessage')}
        containerStyle={ThemedStyles.style.marginLeft}
        textStyle={actionButtonStyle}
        loading={store.saving}
        disabled={store.saving}
        xSmall
      />
    );
  }

  /**
   * Get Gathering Button
   */
  getGatheringButton() {
    const theme = ThemedStyles.style;
    if (this.state.openingGathering) {
      return <ActivityIndicator style={theme.paddingRight} size="large" />;
    }

    if (this.props.store.group['videoChatDisabled'] === 0) {
      return (
        <Icon
          name="videocam"
          size={32}
          style={[theme.paddingRight, theme.marginRight, theme.colorIconActive]}
          onPress={this.joinGathering}
        />
      );
    }
    return null;
  }

  joinGathering = () => {
    const group = this.props.store.group;
    this.setState({ openingGathering: true });
    setTimeout(() => this.setState({ openingGathering: false }), 1500);
    this.props.navigation.navigate('Gathering', { entity: group });
  };

  /**
   * Render Tabs
   */
  renderToolbar() {
    const group = this.props.store.group;
    // const conversation = {
    //   text: i18n.t('conversation').toUpperCase(),
    //   icon: 'ios-chatboxes',
    //   iconType: 'ion',
    //   value: 'conversation',
    // };
    const typeOptions = [
      { text: i18n.t('feed').toUpperCase(), icon: 'list', value: 'feed' },
      {
        text: i18n.t('description').toUpperCase(),
        icon: 'short-text',
        value: 'desc',
      },
      {
        text: i18n.t('members').toUpperCase(),
        badge: abbrev(group['members:count'], 0),
        value: 'members',
      },
    ];

    // if (group.conversationDisabled !== 1) {
    //   typeOptions.push(conversation);
    // }

    return (
      <View>
        <Toolbar
          options={typeOptions}
          initial={this.props.store.tab}
          onChange={this.onTabChange}
          containerStyle={ThemedStyles.style.bcolorPrimaryBorder}
        />
        <AnimatedSearch store={this.props.store} />
      </View>
    );
  }

  clearSearch = () => {
    this.props.store.setSearch('');
  };

  /**
   * On tab change
   */
  onTabChange = tab => {
    const group = this.props.store.group;

    switch (tab) {
      case 'feed':
        // clear list without mark loaded flag
        if (this.props.store.list) {
          this.props.store.refresh(group.guid);
          this.props.groupsBar.markAsRead(group, 'activity');
        }
        break;
      case 'desc':
        this.props.store.list && this.props.store.list.clearList(false);
        break;
      case 'members':
        this.props.store.loadMembers();
        break;
      case 'conversation':
        if (group.conversationDisabled) return;

        this.props.groupsBar.markAsRead(group, 'conversation');
        break;
      default:
        break;
    }

    this.props.store.setTab(tab);
  };

  renderAvatars = () => {
    const topMembers = this.props.store.topMembers;

    if (topMembers.length) {
      return topMembers.map(t => (
        <Image
          source={t.getAvatarSource()}
          key={t.guid}
          style={this.userAvatarStyle}
        />
      ));
    } else {
      return null;
    }
  };

  toggleConversation = async () => {
    this.refActionSheet.current?.dismiss();
    try {
      await this.props.store.group.toggleConversationDisabled();
    } catch (err) {
      console.error(err);
      this.showError();
    }
  };

  getActionSheet() {
    return (
      <View style={stylesheet.rightToolbar}>
        <Icon
          name="more-vert"
          onPress={this.showActionSheet}
          size={26}
          style={ThemedStyles.style.colorPrimaryText}
        />
        <BottomSheet ref={this.refActionSheet} title={i18n.t('actions')}>
          {this.props.store.group.conversationDisabled ? (
            <MenuItem
              title={i18n.t('groups.enableConversations')}
              iconName="message-outline"
              iconType="material-community"
              onPress={this.toggleConversation}
            />
          ) : (
            <MenuItem
              title={i18n.t('groups.disableConversations')}
              iconName="message-lock-outline"
              iconType="material-community"
              onPress={this.toggleConversation}
            />
          )}

          <BottomSheetButton
            text={i18n.t('cancel')}
            onPress={this.hideActionSheet}
          />
        </BottomSheet>
      </View>
    );
  }

  showActionSheet = async () => {
    this.refActionSheet.current?.present();
  };
  hideActionSheet = async () => {
    this.refActionSheet.current?.dismiss();
  };

  toggleSearch = () => {
    this.props.store.toggleSearch();
  };

  /**
   * Show an error message
   */
  showError() {
    Alert.alert(
      i18n.t('sorry'),
      i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
      [{ text: i18n.t('ok'), onPress: () => {} }],
      { cancelable: false },
    );
  }

  /**
   * Render Header
   */
  render() {
    const theme = ThemedStyles.style;
    const group = this.props.store.group;
    const styles = this.props.styles;

    const avatar = { uri: this.getAvatar() };
    const iurl = { uri: this.getBannerFromGroup() };
    const actionSheet = group['is:owner'] ? this.getActionSheet() : null;
    return (
      <DismissKeyboard>
        <View>
          {Boolean(iurl.uri) && (
            <SmartImage
              source={iurl}
              style={styles.banner}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          <View style={styles.headertextcontainer}>
            <View style={styles.avatarContainer}>
              <View style={avatarContainersStyle}>{this.renderAvatars()}</View>
            </View>
            <View style={theme.rowJustifyCenter}>
              <View style={styles.namecol}>
                <MText style={styles.name}>{group.name}</MText>
              </View>
              <View style={styles.buttonscol}>
                <Icon
                  name="search"
                  size={25}
                  onPress={this.toggleSearch}
                  style={iconStyle}
                />
                <Icon
                  name="share"
                  size={25}
                  style={iconStyle}
                  onPress={this.share}
                />
                {!this.props.store.group?.conversationDisabled && (
                  <Icon
                    name="chat-bubble-outline"
                    size={25}
                    style={iconStyle}
                    onPress={this.props.onPressComment}
                  />
                )}
                {/* {group.can(FLAG_JOIN_GATHERING) && this.getGatheringButton()} */}
                {group.can(FLAG_JOIN) && this.getActionButton()}
              </View>
            </View>
            {actionSheet}
          </View>
          <View style={stylesheet.avatarContainer}>
            <Image source={avatar} style={this.avatarStyle} />
          </View>
          {this.renderToolbar()}
        </View>
      </DismissKeyboard>
    );
  }
}

const stylesheet = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    left: 15,
    top: 115,
    elevation: 10,
    width: 112,
    height: 112,
    borderRadius: 55,
    zIndex: 10000,
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    bottom: 60,
    right: 10,
    position: 'absolute',
  },
});

const iconStyle = ThemedStyles.combine(
  'paddingRight',
  'marginRight',
  'colorSecondaryText',
);

const avatarContainersStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'flexContainer',
);
const actionButtonStyle = ThemedStyles.combine('marginLeft', 'marginRight');
