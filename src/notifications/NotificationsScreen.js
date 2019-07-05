import React, {
  Component
} from 'react';

import {
  Text,
  View,
  FlatList,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import stores from '../../AppStores';
import CaptureFab from '../capture/CaptureFab';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';
import NotificationsTabIcon from './NotificationsTabIcon';
import ErrorBoundary from '../common/components/ErrorBoundary';
import CenteredLoading from '../common/components/CenteredLoading';
import i18n from '../common/services/i18n.service';

/**
 * Notification Screen
 */
@inject('notifications', 'user')
@observer
export default class NotificationsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <NotificationsTabIcon tintColor={tintColor}/>
    ),
    headerRight: <Icon name="ios-options" size={18} color='#444' style={CS.padding2x} onPress={() => navigation.navigate('NotificationsSettings')} />,
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      // tab button tapped again?
      if (navigation.isFocused()) {
        stores.notifications.refresh();
        stores.notifications.setUnread(0);
        return;
      }
      defaultHandler();
    }
  });

  /**
   * On component mount
   */
  componentWillMount() {
    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      // ignore back navigation
      if (s.action.type === 'Navigation/NAVIGATE' && s.action.routeName === 'Notifications') {
        //this.props.notifications.loadList(true);
        this.props.notifications.setUnread(0);
      }
    });

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
    this.disposeEnter.remove();
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
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        onEndReached={this.loadMore}
        ListEmptyComponent={empty}
        ListHeaderComponent={<NotificationsTopbar/>}
        // onEndReachedThreshold={0.05}
        initialNumToRender={12}
        stickyHeaderIndices={[0]}
        windowSize={8}
        refreshing={list.refreshing}
        style={CS.backgroundWhite}
      />
    );

    return (
      <View style={CS.flexContainer}>
        {body}
        <CaptureFab navigation={this.props.navigation} />
      </View>
    );
  }

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.notifications.refresh();
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.notifications.loadList()
  }

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