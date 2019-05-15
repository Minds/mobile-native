import React, {
  Component,
  Fragment
} from 'react';

import {
  StyleSheet,
  Platform,
  Text,
  FlatList,
  View,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import CenteredLoading from '../common/components/CenteredLoading';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';
import ErrorLoading from '../common/components/ErrorLoading';
import GroupsListItem from '../groups/GroupsListItem'
import ErrorBoundary from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';

/**
 * Discovery Feed Screen
 */
@inject('discovery', 'channel')
@observer
export default class DiscoveryFeedScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      'title': navigation.state.params.title || ''
    }
  }

  /**
   * Render
   */
  render() {
    const discovery = this.props.discovery;
    const list = discovery.list;

    let renderRow;
    switch (discovery.filters.type) {
      case 'lastchannels':
      case 'channels':
        renderRow = this.renderUser;
        break;
      case 'groups':
        renderRow = this.renderGroup;
        break;
      case 'blogs':
        renderRow = this.renderBlog;
        break;
      case 'activities':
      default:
        renderRow = this.renderActivity;
        break;
    }

    const footer = this.getFooter();

    const showFeed = this.props.navigation.state.params.showFeed;

    return (
      <FlatList
        data={list.entities.slice(showFeed)}
        renderItem={renderRow}
        ListFooterComponent={footer}
        ListEmptyComponent={this.getEmptyList()}
        keyExtractor={item => item.rowKey}
        onEndReached={this.loadFeed}
        initialNumToRender={3}
        style={[CS.backgroundWhite, CS.flexContainer]}
        horizontal={false}
        windowSize={9}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps={'handled'}
      />
    )
  }

  /**
   * Get empty list
   */
  getEmptyList() {
    if (!this.props.discovery.list.loaded || this.props.discovery.loading || this.props.discovery.list.errorLoading) return null;
    return (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Text style={ComponentsStyle.emptyComponentMessage}>{i18n.t('discovery.nothingToShow')}</Text>
        </View>
      </View>
    );
  }

  /**
   * Get list footer
   */
  getFooter() {
    const discovery = this.props.discovery;

    if (discovery.loading && !discovery.list.refreshing) {
      return (
        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    if (!discovery.list.errorLoading) return null;

    const message = discovery.list.entities.length ?
      i18n.t('cantLoadMore') :
      i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.tryAgain}/>
  }

  /**
   * Try Again
   */
  tryAgain = () => {
    if (this.props.discovery.searchtext) {
      this.props.discovery.search(this.props.discovery.searchtext);
    } else {
      this.loadFeed(null, true);
    }
  }

  /**
   * Load feed data
   */
  loadFeed = (e, force = false) => {
    const type = this.props.discovery.filters.type;
    if (
      this.props.discovery.filters.type == 'lastchannels' ||
      (this.props.discovery.list.errorLoading && !force)
    ) {
      return;
    }

    const limit = this.state.showFeed ? 12 : (type == 'images' || type == 'videos' ? 24 : 12);

    this.props.discovery.loadList(false, false, limit);
  }

  /**
   * Render user row
   */
  renderUser = (row) => {
    return (

      <ErrorBoundary containerStyle={CS.hairLineBottom}>
        <DiscoveryUser store={this.props.discovery.stores['channels']} entity={row} navigation={this.props.navigation} hideButtons={this.props.discovery.filters.type == 'lastchannels'} />
      </ErrorBoundary>
    );
  }

  /**
   * Render activity item
   */
  renderActivity = (row) => {
    return (
      <ErrorBoundary containerStyle={CS.hairLineBottom}>
        <Activity entity={row.item} navigation={this.props.navigation} autoHeight={false} newsfeed={this.props.discovery}/>
      </ErrorBoundary>
    );
  }

  /**
   * Render blog item
   */
  renderBlog = (row) => {
    return (
      <View style={styles.blogCardContainer}>
        <ErrorBoundary containerStyle={CS.hairLineBottom}>
          <BlogCard entity={row.item} navigation={this.props.navigation} />
        </ErrorBoundary>
      </View>
    );
  }

  /**
   * Render group item
   */
  renderGroup = (row) => {
    const item = row.item;
    return (
      <ErrorBoundary containerStyle={CS.hairLineBottom}>
        <GroupsListItem group={row.item} onPress={() => this.navigateToGroup(row.item)}/>
      </ErrorBoundary>
    )
  }

  /**
   * Navigate to group
   * @param {GroupModel} group
   */
  navigateToGroup(group) {
    this.props.navigation.push('GroupView', { group: group })
  }
}

const styles = StyleSheet.create({
  blogCardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  },
});
