//@ts-nocheck
import React, { Component } from 'react';

import { Text, View, FlatList } from 'react-native';

import { observer, inject } from 'mobx-react';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';
import ErrorBoundary from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';
import Topbar from '../topbar/Topbar';
import ThemedStyles from '../styles/ThemedStyles';
import OnFocus from '../common/components/helper/OnFocus';
import CenteredLoading from '../common/components/CenteredLoading';

/**
 * Notification Screen
 */
@inject('notifications', 'user')
@observer
class NotificationsScreen extends Component {
  headerIndex = [0];

  /**
   * On screen focus
   */
  onFocus = () => {
    // when return to the screen reload only if there are new notifications
    if (this.props.notifications.unread > 0) {
      this.props.notifications.refresh();
      this.props.notifications.setUnread(0);
    }
  };

  /**
   * On component mount
   */
  componentDidMount() {
    this.disposeTabPress = this.props.navigation.addListener(
      //@ts-ignore
      'tabPress',
      this.refresh,
    );
  }

  /**
   * Initial load
   */
  async initialLoad() {
    try {
      await this.props.notifications.readLocal();
    } finally {
      await this.props.notifications.loadList(true);
    }
  }

  /**
   * On component unmount
   */
  componentWillUnmount() {
    // clear data to free memory
    this.props.notifications.list.clearList();

    if (this.disposeTabPress) {
      this.disposeTabPress();
    }
  }

  /**
   * Render screen
   */
  render() {
    const me = this.props.user.me;
    const list = this.props.notifications.list;
    let empty = null;

    if (list.loaded && !list.refreshing) {
      let design = null;

      if (me && me.hasBanner && !me.hasBanner()) {
        //TODO: check for avatar too
        design = (
          <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() =>
              this.props.navigation.push('Channel', { username: 'me' })
            }>
            {i18n.t('newsfeed.designYourChannel')}
          </Text>
        );
      }

      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <MIcon name="notifications" size={72} color="#444" />
            <Text style={ComponentsStyle.emptyComponentMessage}>
              {i18n.t('notification.dontHave')}
            </Text>
            {design}
            <Text
              style={ComponentsStyle.emptyComponentLink}
              onPress={() => this.props.navigation.navigate('Capture')}>
              {i18n.t('createAPost')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={CS.flexContainer}>
        <OnFocus onFocus={this.onFocus} />
        <Topbar
          title={i18n.t('tabTitleNotifications')}
          navigation={this.props.navigation}
          refreshFeed={this.onFocus}
        />
        <FlatList
          data={list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          ListEmptyComponent={this.props.notifications.loading ? null : empty}
          ListHeaderComponent={<NotificationsTopbar />}
          ListFooterComponent={
            this.props.notifications.loading && !list.refreshing ? (
              <CenteredLoading />
            ) : null
          }
          // onEndReachedThreshold={0.05}
          initialNumToRender={12}
          stickyHeaderIndices={this.headerIndex}
          windowSize={8}
          refreshing={list.refreshing}
          style={[ThemedStyles.style.backgroundPrimary, CS.flexContainer]}
        />
      </View>
    );
  }

  /**
   * Key extractor
   */
  keyExtractor = (item, index) =>
    `${item.time_created}:${item.from.guid}:${
      item.entity ? item.entity.guid + index : index
    }`;

  /**
   * Clear and reload
   */
  refresh = async () => {
    await this.props.notifications.loadRemoteOrLocal();
    this.props.notifications.setUnread(0);
  };

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.notifications.loadList();
  };

  /**
   * render row
   * @param {object} row
   */
  renderRow = (row) => {
    const entity = row.item;
    return (
      <ErrorBoundary
        message="Can't show this notification"
        containerStyle={CS.hairLineBottom}>
        <Notification entity={entity} navigation={this.props.navigation} />
      </ErrorBoundary>
    );
  };
}

export default NotificationsScreen;
