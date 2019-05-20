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
@inject('discovery')
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
    const list = this.props.discovery.feedStore.list;

    return (
      <FlatList
        data={list.entities}
        renderItem={this.renderActivity}
        ListFooterComponent={this.getFooter}
        keyExtractor={this.keyExtractor}
        onEndReached={this.loadFeed}
        initialNumToRender={3}
        style={[CS.backgroundWhite, CS.flexContainer]}
        horizontal={false}
        maxToRenderPerBatch={3}
        windowSize={3}
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
  keyExtractor = item => item.rowKey;

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

    const message = discovery.list.entities.length ?
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
}

const styles = StyleSheet.create({
  blogCardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  },
});
