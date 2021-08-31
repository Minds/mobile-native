import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleProp,
  ViewStyle,
  RefreshControl,
} from 'react-native';
import { observer } from 'mobx-react';

import Activity from '../../newsfeed/activity/Activity';
import TileElement from '../../newsfeed/TileElement';
import { ComponentsStyle } from '../../styles/Components';
import ErrorLoading from './ErrorLoading';
import ErrorBoundary from './ErrorBoundary';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import type FeedStore from '../stores/FeedStore';
import type ActivityModel from '../../newsfeed/ActivityModel';
import ActivityIndicator from './ActivityIndicator';

type PropsType = {
  feedStore: FeedStore;
  renderTileActivity?: Function;
  renderActivity?: Function;
  emptyMessage?: React.ReactNode;
  header?: React.ReactNode;
  listComponent?: React.ComponentType;
  navigation: any;
  style?: StyleProp<ViewStyle>;
  hideItems?: boolean;
  ListEmptyComponent?: React.ReactNode;
  onRefresh?: () => void;
  afterRefresh?: () => void;
  onScroll?: (e: any) => void;
  refreshControlTintColor?: string;
};

/**
 * News feed list component
 */
@observer
export default class FeedList<T> extends Component<PropsType> {
  listRef?: FlatList<T>;
  cantShowActivity: string = '';
  viewOpts = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };
  state = {
    itemHeight: 0,
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
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
   * moves scroll offset up and down
   **/
  wiggle() {
    const DISTANCE = 25;
    const currentScrollOffset = this.props.feedStore.scrollOffset;

    this.listRef?.scrollToOffset({
      animated: true,
      offset: currentScrollOffset - DISTANCE,
    });
    setTimeout(() => {
      this.listRef?.scrollToOffset({
        animated: true,
        offset: currentScrollOffset,
      });
    }, 150);
  }

  /**
   * Set list reference
   */
  setListRef = (r: FlatList<T> | undefined) => (this.listRef = r);

  onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    this.props.feedStore.scrollOffset = e.nativeEvent.contentOffset.y;

    this.props.onScroll?.(e);
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

    return (
      <ListComponent
        containerStyle={ThemedStyles.style.paddingBottom10x}
        ref={this.setListRef}
        key={feedStore.isTiled ? 't' : 'f'}
        onLayout={this.onLayout}
        ListHeaderComponent={header}
        ListFooterComponent={this.getFooter}
        data={!this.props.hideItems ? feedStore.entities.slice() : []}
        renderItem={renderRow}
        keyExtractor={this.keyExtractor}
        onRefresh={this.refresh}
        refreshing={feedStore.refreshing}
        onEndReached={this.loadMore}
        refreshControl={
          Boolean(this.props.refreshControlTintColor) && (
            <RefreshControl
              tintColor={this.props.refreshControlTintColor}
              refreshing={feedStore.refreshing}
              onRefresh={this.refresh}
            />
          )
        }
        // onEndReachedThreshold={0}
        numColumns={feedStore.isTiled ? 3 : 1}
        style={style}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={9}
        // removeClippedSubviews={true}
        ListEmptyComponent={!this.props.hideItems ? empty : null}
        viewabilityConfig={this.viewOpts}
        onViewableItemsChanged={this.onViewableItemsChanged}
        keyboardShouldPersistTaps="always"
        testID="feedlistCMP"
        {...passThroughProps}
        onScroll={this.onScroll}
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
  getFooter = () => {
    if (this.props.feedStore.loading && !this.props.feedStore.refreshing) {
      return (
        <View style={footerStyle} testID="ActivityIndicatorView">
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (this.props.feedStore.errorLoading) {
      return this.getErrorLoading();
    }
    return null;
  };

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
      item.item.sendViewed();
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
    if (this.props.afterRefresh) {
      this.props.afterRefresh();
    }
  };

  /**
   * Render activity
   */
  renderActivity = (row: { index: number; item: ActivityModel }) => {
    const entity = row.item;

    return (
      <ErrorBoundary
        message={this.cantShowActivity}
        containerStyle={ThemedStyles.style.borderBottomHair}>
        <Activity
          entity={entity}
          navigation={this.props.navigation}
          autoHeight={false}
          showCommentsOutlet={false}
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

const style = ThemedStyles.combine('flexContainer', 'bgPrimaryBackground');

const footerStyle = ThemedStyles.combine('centered', 'padding3x');
