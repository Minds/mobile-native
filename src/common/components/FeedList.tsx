import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { observer } from 'mobx-react';

import Activity from '../../newsfeed/activity/Activity';
import TileElement from '../../newsfeed/TileElement';
import { CommonStyle as CS } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import ErrorLoading from './ErrorLoading';
import ErrorBoundary from './ErrorBoundary';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import type FeedStore from '../stores/FeedStore';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { ChannelTabType } from '../../channel/v2/createChannelStore';

type PropsType = {
  feedStore: FeedStore;
  renderTileActivity?: Function;
  renderActivity?: Function;
  emptyMessage?: React.ReactNode;
  header?: React.ReactNode;
  listComponent?: React.ComponentType;
  navigation: any;
  style?: StyleProp<ViewStyle>;
  tab?: ChannelTabType;
};

/**
 * News feed list component
 */
@observer
export default class FeedList<T> extends Component<PropsType> {
  listRef?: FlatList<T>;
  cantShowActivity: string = '';
  viewOpts = {
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 300,
  };
  state = {
    itemHeight: 0,
    viewed: [],
  };

  /**
   * On list mount
   */
  componentWillMount() {
    this.cantShowActivity = i18n.t('errorShowActivity');
  }

  /**
   * Adjust tiles to 1/cols size
   */
  onLayout = (e: { nativeEvent: { layout: { width: any } } }) => {
    const width = e.nativeEvent.layout.width;
    this.setState({
      itemHeight: width / 3,
    });
  };

  /**
   * Scroll to top
   * @param {boolean} animated
   */
  scrollToTop(animated = true) {
    if (this.listRef) {
      this.listRef.scrollToOffset({ animated, offset: 0 });
    }
  }

  /**
   * Set list reference
   */
  setListRef = (r: FlatList<T> | undefined) => (this.listRef = r);

  onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    this.props.feedStore.scrollOffset = e.nativeEvent.contentOffset.y;
  };

  /**
   * Render component
   */
  render() {
    let renderRow: Function;
    let empty: React.ReactNode = null;

    const {
      feedStore,
      renderTileActivity,
      renderActivity,
      emptyMessage,
      header,
      listComponent,
      ...passThroughProps
    } = this.props;

    const ListComponent: React.ComponentType<any> = listComponent || FlatList;

    if (feedStore.isTiled) {
      renderRow = renderTileActivity || this.renderTileActivity;
    } else {
      renderRow = renderActivity || this.renderActivity;
    }

    // empty view
    if (feedStore.loaded && !feedStore.refreshing) {
      if (emptyMessage) {
        empty = emptyMessage;
      } else {
        empty = (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <Text style={ComponentsStyle.emptyComponentMessage}>
                {i18n.t('newsfeed.empty')}
              </Text>
            </View>
          </View>
        );
      }
    }

    const footer = this.getFooter();

    const renderList = !this.props.tab || this.props.tab === 'feed';

    return (
      <ListComponent
        ref={this.setListRef}
        key={feedStore.isTiled ? 't' : 'f'}
        onLayout={this.onLayout}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        data={renderList ? feedStore.entities.slice() : []}
        renderItem={renderRow}
        keyExtractor={this.keyExtractor}
        onRefresh={this.refresh}
        refreshing={feedStore.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        numColumns={feedStore.isTiled ? 3 : 1}
        style={[
          ThemedStyles.style.flexContainer,
          ThemedStyles.style.backgroundPrimary,
        ]}
        initialNumToRender={6}
        windowSize={11}
        // removeClippedSubviews={true}
        ListEmptyComponent={renderList ? empty : null}
        viewabilityConfig={this.viewOpts}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onScroll={this.onScroll}
        keyboardShouldPersistTaps="always"
        {...passThroughProps}
      />
    );
  }

  /**
   * Key extractor for list items
   */
  keyExtractor = (item: { boosted: any; urn: any }, index: any) => {
    return item.boosted ? `${item.urn}:${index}` : item.urn;
  };

  /**
   * Get footer
   */
  getFooter() {
    if (this.props.feedStore.loading && !this.props.feedStore.refreshing) {
      return (
        <View
          style={[CS.centered, CS.padding3x]}
          testID="ActivityIndicatorView">
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (this.props.feedStore.errorLoading) {
      return this.getErrorLoading();
    }
    return null;
  }

  /**
   * Get error loading component
   */
  getErrorLoading() {
    const message = this.props.feedStore.entities.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadFeedForce} />;
  }

  /**
   * On viewable item changed
   */
  onViewableItemsChanged = (change: {
    viewableItems: any[];
    changed: any[];
  }) => {
    change.viewableItems.forEach((item: { item: any }) => {
      this.props.feedStore.addViewed(item.item);
    });
    change.changed.forEach(
      (c: { item: { setVisible: (arg0: any) => void }; isViewable: any }) => {
        if (c.item.setVisible) {
          c.item.setVisible(c.isViewable);
        }
      },
    );
  };

  /**
   * Load feed data
   */
  loadMore = () => {
    if (this.props.feedStore.errorLoading) return;
    this.props.feedStore.loadMore();
  };

  /**
   * Force feed load
   */
  loadFeedForce = () => {
    this.props.feedStore.reload();
  };

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.feedStore.refresh();
  };

  /**
   * Render activity
   */
  renderActivity = (row: { index: number; item: ActivityModel }) => {
    let isLast = this.props.feedStore.entities.length === row.index + 1;
    const entity = row.item;

    return (
      <ErrorBoundary
        message={this.cantShowActivity}
        containerStyle={CS.hairLineBottom}>
        <Activity
          entity={entity}
          navigation={this.props.navigation}
          autoHeight={false}
          isLast={isLast}
          showCommentsOutlet={true}
        />
      </ErrorBoundary>
    );
  };

  /**
   * Render tile
   */
  renderTileActivity = (row: { item: any }) => {
    const entity = row.item;
    return (
      <TileElement
        size={this.state.itemHeight}
        entity={entity}
        navigation={this.props.navigation}
      />
    );
  };
}
