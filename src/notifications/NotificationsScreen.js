import React, { Component } from 'react';

import { Text, View, FlatList } from 'react-native';

import { observer, inject } from 'mobx-react';

import MIcon from 'react-native-vector-icons/MaterialIcons';

import CaptureFab from '../capture/CaptureFab';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';
import ErrorBoundary from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';
import TopbarNew from '../topbar/TopbarNew';
import ThemedStyles from '../styles/ThemedStyles';
import OnFocus from '../common/components/helper/OnFocus';

/**
 * Notification Screen
 */
export default
@inject('notifications', 'user')
@observer
class NotificationsScreen extends Component {
  /**
   * On screen focus
   */
  onFocus = () => {
    this.props.notifications.list.clearList();
    this.props.notifications.refresh();
    this.props.notifications.setUnread(0);
  };

  /**
   * On component mount
   */
  componentDidMount() {
    this.initialLoad();
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
  }

  /**
   * Render screen
   */
  render() {
    let body;
    const me = this.props.user.me;
    const list = this.props.notifications.list;
    let empty = null;

    if (list.loaded && !list.refreshing) {
      let filter = '';
      let design = null;

      if (this.props.notifications.filter != 'all') {
        filter = this.props.notifications.filter.substr(0, this.props.notifications.filter.length - 1);
      }

      if (me && me.hasBanner && !me.hasBanner()) { //TODO: check for avatar too
        design = <Text
          style={ComponentsStyle.emptyComponentLink}
          onPress={() => this.props.navigation.push('Channel', { username: 'me' })}
          >
          {i18n.t('newsfeed.designYourChannel')}
        </Text>
      }

      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <MIcon name="notifications" size={72} color='#444' />
            <Text style={ComponentsStyle.emptyComponentMessage}>{i18n.t('notification.dontHave')}</Text>
            {design}
            <Text
              style={ComponentsStyle.emptyComponentLink}
              onPress={() => this.props.navigation.navigate('Capture')}
              >
              {i18n.t('createAPost')}
            </Text>
          </View>
        </View>);
    }

    body = (
      <FlatList
        data={list.entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={this.keyExtractor}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
        ListEmptyComponent={empty}
        ListHeaderComponent={<NotificationsTopbar/>}
        // onEndReachedThreshold={0.05}
        initialNumToRender={12}
        stickyHeaderIndices={[0]}
        windowSize={8}
        refreshing={list.refreshing}
        style={[ThemedStyles.style.backgroundSecondary, CS.flexContainer]}
      />
    );

    return (
      <View style={CS.flexContainer}>
        <OnFocus onFocus={this.onFocus}/>
        <TopbarNew title={i18n.t('tabTitleNotifications')}/>
        {body}
        {/* <CaptureFab navigation={this.props.navigation} /> */}
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
  refresh = () => {
    this.props.notifications.refresh();
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
      <ErrorBoundary message="Can't show this notification" containerStyle={CS.hairLineBottom}>
        <Notification entity={entity} navigation={this.props.navigation}/>
      </ErrorBoundary>
    );
  }
}