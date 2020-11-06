//@ts-nocheck
import React, { Component } from 'react';

import { Text, Image, View, StyleSheet, Alert } from 'react-native';

import { observer, inject } from 'mobx-react';
import { debounce } from 'lodash';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';

import { MINDS_CDN_URI, MINDS_LINK_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import Toolbar from '../../common/components/toolbar/Toolbar';
import { CommonStyle } from '../../styles/Common';
import CenteredLoading from '../../common/components/CenteredLoading';
import SearchView from '../../common/components/SearchView';
import i18n from '../../common/services/i18n.service';
import { FLAG_JOIN } from '../../common/Permissions';
import Button from '../../common/components/Button';
import ThemedStyles from '../../styles/ThemedStyles';
import ShareService from '../../share/ShareService';
import ActivityIndicator from '../../common/components/ActivityIndicator';

/**
 * Group Header
 */
@inject('groupsBar')
@observer
export default class GroupHeader extends Component {
  state = {
    openingGathering: false,
  };

  componentDidMount() {
    const group = this.props.store.group;
    this.props.groupsBar.markAsRead(group, 'activity');
  }

  /**
   * Get Group Banner
   */
  getBannerFromGroup() {
    const group = this.props.store.group;
    return (
      MINDS_CDN_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime
    );
  }

  /**
   * Share group
   */
  share = () => {
    ShareService.share(
      this.props.store.group.name,
      MINDS_LINK_URI + `groups/profile/${this.props.store.group.guid}/feed`,
    );
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

    if (store.saving) return <CenteredLoading />;

    if (!group['is:member']) {
      return (
        <Button
          onPress={store.join}
          accessibilityLabel={i18n.t('groups.subscribeMessage')}
          containerStyle={[
            CommonStyle.rowJustifyCenter,
            CommonStyle.marginLeft,
          ]}
          textStyle={[CommonStyle.marginLeft, CommonStyle.marginRight]}
          icon="ios-flash"
          text={i18n.t('join')}
          loading={store.saving}
        />
      );
    } else {
      return (
        <Button
          onPress={store.leave}
          accessibilityLabel={i18n.t('groups.leaveMessage')}
          containerStyle={[
            CommonStyle.rowJustifyCenter,
            CommonStyle.marginLeft,
          ]}
          textStyle={[CommonStyle.marginLeft, CommonStyle.marginRight]}
          icon="ios-flash"
          text={i18n.t('leave')}
          loading={store.saving}
        />
      );
    }
  }

  /**
   * Get Gathering Button
   */
  getGatheringButton() {
    const theme = ThemedStyles.style;
    if (this.state.openingGathering) {
      return (
        <ActivityIndicator style={CommonStyle.paddingRight} size="large" />
      );
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

  setMemberSearch = debounce((q) => {
    this.props.store.setMemberSearch(q);
  }, 300);

  /**
   * Render Tabs
   */
  renderToolbar() {
    const group = this.props.store.group;
    const conversation = {
      text: i18n.t('conversation').toUpperCase(),
      icon: 'ios-chatboxes',
      iconType: 'ion',
      value: 'conversation',
    };
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

    if (group.conversationDisabled !== 1) {
      typeOptions.push(conversation);
    }

    const searchBar =
      this.props.store.tab == 'members' ? (
        <SearchView
          containerStyle={[
            CommonStyle.flexContainer,
            CommonStyle.hairLineBottom,
          ]}
          placeholder={i18n.t('discovery.search')}
          onChangeText={this.setMemberSearch}
        />
      ) : null;

    return (
      <View>
        <Toolbar
          options={typeOptions}
          initial={this.props.store.tab}
          onChange={this.onTabChange}
        />
        {searchBar}
      </View>
    );
  }

  /**
   * On tab change
   */
  onTabChange = (tab) => {
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
    const styles = this.props.styles;

    if (topMembers.length) {
      return topMembers.map((t) => (
        <Image
          source={t.getAvatarSource()}
          key={t.guid}
          style={styles.userAvatar}
        />
      ));
    } else {
      return null;
    }
  };

  getActionSheet() {
    let options = [i18n.t('cancel')];
    options.push(
      this.props.store.group.conversationDisabled
        ? i18n.t('groups.enableConversations')
        : i18n.t('groups.disableConversations'),
    );
    return (
      <View style={stylesheet.rightToolbar}>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={26}
          style={stylesheet.icon}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          options={options}
          onPress={(i) => {
            this.handleActionSheetSelection(options[i]);
          }}
          cancelButtonIndex={0}
        />
      </View>
    );
  }

  async showActionSheet() {
    this.ActionSheet.show();
  }

  async handleActionSheetSelection(option) {
    switch (option) {
      case i18n.t('groups.disableConversations'):
      case i18n.t('groups.enableConversations'):
        try {
          await this.props.store.group.toggleConversationDisabled();
        } catch (err) {
          console.error(err);
          this.showError();
        }
    }
  }

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
      <View>
        <FastImage
          source={iurl}
          style={styles.banner}
          resizeMode={FastImage.resizeMode.cover}
        />
        {actionSheet}
        <View style={styles.headertextcontainer}>
          <View style={styles.avatarContainer}>
            <View
              style={[CommonStyle.rowJustifyStart, CommonStyle.flexContainer]}>
              {this.renderAvatars()}
            </View>
          </View>
          <View style={CommonStyle.rowJustifyCenter}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{group.name.toUpperCase()}</Text>
            </View>
            <View style={styles.buttonscol}>
              <Icon
                name="share"
                size={28}
                style={[
                  theme.paddingRight,
                  theme.marginRight,
                  theme.colorIconActive,
                ]}
                onPress={this.share}
              />
              {/* {group.can(FLAG_JOIN_GATHERING) && this.getGatheringButton()} */}
              {group.can(FLAG_JOIN) && this.getActionButton()}
            </View>
          </View>
        </View>
        <Image source={avatar} style={styles.avatar} />
        {this.renderToolbar()}
      </View>
    );
  }
}

const stylesheet = StyleSheet.create({
  rightToolbar: {
    alignSelf: 'flex-end',
    bottom: 126,
    right: 10,
  },
  icon: {
    color: '#888',
  },
});
