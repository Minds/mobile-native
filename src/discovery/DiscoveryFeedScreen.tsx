import React, {
  Component,
  Fragment
} from 'react';

import {
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
} from 'mobx-react'

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
import FeedList from '../common/components/FeedList';
import FallbackBoundary from './FallbackBoundary';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Discovery Feed Screen
 */
@observer
@inject('discovery')
export default class DiscoveryFeedScreen extends Component {

  /**
   * Render activity
   */
  renderActivity = row => {
    let isLast = this.props.discovery.feedStore.list.entities.length == row.index + 1;
    const entity = row.item;

    const boundaryText =
      this.props.discovery.feedStore.list.fallbackIndex === row.index
        ? i18n.t('newsfeed.olderThan', {
            period: this.props.discovery.filters.period,
          })
        : undefined;

    return (
      <ErrorBoundary message={this.cantShowActivity} containerStyle={CS.hairLineBottom}>
        {boundaryText && <FallbackBoundary title={boundaryText}/>}
        <Activity
          entity={entity}
          newsfeed={this.props.feedStore}
          navigation={this.props.navigation}
          autoHeight={false}
          isLast={isLast}
        />
      </ErrorBoundary>
    )
  }

  /**
   * Render
   */
  render() {
    const store = this.props.discovery.feedStore.list;

    return (
      <FeedList
        renderActivity={this.renderActivity}
        feedStore={store}
        ListFooterComponent={this.getFooter}
        keyExtractor={this.keyExtractor}
        initialNumToRender={3}
        style={[ThemedStyles.style.backgroundSecondary, CS.flexContainer]}
        navigation={this.props.navigation}
        horizontal={false}
        maxToRenderPerBatch={3}
        windowSize={11}
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
   * Key extractor
   */
  keyExtractor = item => item.urn;

  /**
   * Get list footer
   */
  getFooter = () => {
    const store = this.props.discovery.feedStore;

    if (store.loading && !store.list.refreshing) {
      return (
        <View style={[CS.flexContainer, CS.centered, CS.padding3x]}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    if (!store.list.errorLoading) return null;

    const message = store.list.entities.length ?
      i18n.t('cantLoadMore') :
      i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.tryAgain}/>
  }

  /**
   * Try Again
   */
  tryAgain = () => {
    this.loadFeed(null, true);
  }

  /**
   * Load feed data
   */
  loadFeed = (e, force = false) => {
    if (this.props.discovery.feedStore.list.errorLoading && !force) {
      return;
    }

    this.props.discovery.feedStore.loadList(false, false, 12);
  }
}

