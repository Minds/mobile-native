import React, { Component } from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  FlashList,
  FlashListProps,
  ListRenderItem,
  ViewToken,
} from '@shopify/flash-list';
import Animated from 'react-native-reanimated';

import { observer } from 'mobx-react';
import Activity from '~/newsfeed/activity/Activity';
import TileElement from '~/newsfeed/TileElement';
import { ComponentsStyle } from '~/styles/Components';
import ErrorLoading from './ErrorLoading';
import ErrorBoundary from './ErrorBoundary';

import type FeedStore from '../stores/FeedStore';
import ActivityIndicator from './ActivityIndicator';
import MText from './MText';
import ActivityModel from '~/newsfeed/ActivityModel';
import type BaseModel from '../BaseModel';
import { IS_IOS } from '~/config/Config';
import { withFeedStoreProvider } from '../contexts/feed-store.context';
import sp from '~/services/serviceProvider';
import { InjectItem } from './FeedListInjectedItem';

const { height } = Dimensions.get('window');
const drawAhead = height;
const itemHeight = height / 3;

export type FeedListPropsType<T extends BaseModel> = {
  feedStore: FeedStore<T>;
  overrideItemLayout?: FlashListProps<T>['overrideItemLayout'];
  renderTileActivity?: ListRenderItem<T>;
  renderActivity?: ListRenderItem<T>;
  emptyMessage?: React.ReactElement;
  bottomComponent?: React.ReactNode;
  header?: React.ReactElement;
  listComponent?: React.ComponentType;
  navigation: any;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  hideContent?: boolean;
  stickyHeaderHiddenOnScroll?: boolean;
  onEndReachedThreshold?: number;
  stickyHeaderIndices?: number[];
  placeholder?: React.ComponentType<any> | null | undefined;
  /**
   * a function to call on refresh. this replaces the feedList default refresh function
   */
  onRefresh?: () => Promise<any>;
  /**
   * refreshing state. overwrites the feedList's refreshing
   */
  refreshing?: boolean;
  onScrollBeginDrag?: () => void;
  onMomentumScrollEnd?: () => void;
  afterRefresh?: () => void;
  onScroll?: (e: any) => void;
  refreshControlTintColor?: string;
  onEndReached?: () => void;
  testID?: string;
  estimatedItemSize?: number;
  displayBoosts?: 'none' | 'distinct';
};

/**
 * News feed list component
 */
@withFeedStoreProvider
@observer
export class FeedList<T extends BaseModel> extends Component<
  FeedListPropsType<T>
> {
  AnimatedFlashList: any;
  listRef = React.createRef<FlashList<T>>();
  cantShowActivity: string = '';
  viewOpts = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.cantShowActivity = sp.i18n.t('errorShowActivity');
    this.AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
  }

  /**
   * Scroll to top
   * @param {boolean} animated
   */
  scrollToTop(animated = true) {
    if (this.listRef.current) {
      this.listRef.current.scrollToOffset({ animated, offset: 0 });
    }
  }

  scrollToOffset(args) {
    if (this.listRef.current) {
      this.listRef.current.scrollToOffset(args);
    }
  }

  /**
   * moves scroll offset up and down
   **/
  wiggle() {
    const DISTANCE = 25;
    const currentScrollOffset = this.props.feedStore.scrollOffset;

    this.listRef.current?.scrollToOffset({
      animated: true,
      offset: currentScrollOffset - DISTANCE,
    });
    setTimeout(() => {
      this.listRef.current?.scrollToOffset({
        animated: true,
        offset: currentScrollOffset,
      });
    }, 150);
  }

  get empty(): React.ReactElement | null {
    if (this.props.feedStore.loaded && !this.props.feedStore.refreshing) {
      if (this.props.emptyMessage) {
        return this.props.emptyMessage;
      } else {
        return (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <MText style={ComponentsStyle.emptyComponentMessage}>
                {sp.i18n.t('newsfeed.empty')}
              </MText>
            </View>
          </View>
        );
      }
    }
    return null;
  }

  getType(item: ActivityModel | InjectItem) {
    const isActivity = item instanceof ActivityModel;
    return item instanceof InjectItem
      ? item.type
      : isActivity && item.hasVideo()
      ? 'video'
      : isActivity && item.hasImage()
      ? 'image'
      : 'row';
  }

  /**
   * Key extractor for list items
   */
  keyExtractor = (item: { boosted: any; urn: any }, index: any) => {
    return item instanceof InjectItem
      ? `${item.type}${index}`
      : item.boosted
      ? `${item.urn}:${index}`
      : item.urn;
  };

  /**
   * Returns the placeholder element
   */
  getPlaceholder() {
    if (this.props.placeholder) {
      const PlaceHolder = this.props.placeholder;

      return React.isValidElement(PlaceHolder) ? PlaceHolder : <PlaceHolder />;
    }
    return null;
  }

  /**
   * Get footer
   */
  getFooter = observer((): React.ReactElement | null => {
    if (this.props.placeholder && !this.props.feedStore.loaded) {
      return this.getPlaceholder();
    }
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
  });

  /**
   * Get error loading component
   */
  getErrorLoading() {
    const message = this.props.feedStore.entities.length
      ? sp.i18n.t('cantLoadMore')
      : sp.i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadFeedForce} />;
  }

  /**
   * On viewable item changed
   */
  onViewableItemsChanged = (change: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    change.viewableItems.forEach((item: { item: any }) =>
      item?.item?.sendViewed?.(),
    );
    change.changed.forEach(
      (c: { item: { setVisible: (arg0: any) => void }; isViewable: any }) =>
        c.item?.setVisible?.(c.isViewable),
    );
  };

  /**
   * Load feed data
   */
  loadMore = () => {
    if (this.props.feedStore.errorLoading) {
      return;
    }
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
  refresh = async () => {
    if (this.props.onRefresh) {
      await this.props.onRefresh();
    } else {
      await this.props.feedStore.refresh();
    }

    if (this.props.afterRefresh) {
      this.props.afterRefresh();
    }
  };

  /**
   * returns refreshing based on props or feedStore
   */
  get refreshing() {
    return typeof this.props.refreshing === 'boolean'
      ? this.props.refreshing
      : this.props.feedStore.refreshing;
  }

  /**
   * Render activity
   */
  renderActivity: ListRenderItem<T> = (row: {
    index: number;
    item: any;
    target: string;
  }) => {
    const entity = row.item;
    const InjectedComponent =
      entity instanceof InjectItem ? entity.component : null;
    return (
      <ErrorBoundary
        message={this.cantShowActivity}
        containerStyle={sp.styles.style.borderBottomHair}>
        <View style={sp.styles.style.alignSelfCenterMaxWidth}>
          {entity instanceof InjectItem && InjectedComponent ? (
            <InjectedComponent {...row} />
          ) : (
            <Activity
              entity={entity}
              navigation={this.props.navigation}
              displayBoosts={this.props.displayBoosts}
              autoHeight={false}
            />
          )}
        </View>
      </ErrorBoundary>
    );
  };

  /**
   * Render tile
   */
  renderTileActivity: ListRenderItem<T> = (row: { item: any }) => {
    const entity = row.item;
    return (
      <TileElement
        size={itemHeight}
        entity={entity}
        navigation={this.props.navigation}
      />
    );
  };

  /**
   * Render component
   */
  render() {
    let renderRow: ListRenderItem<T>;

    const {
      feedStore,
      renderTileActivity,
      renderActivity,
      header,
      ...passThroughProps
    } = this.props;

    if (feedStore.isTiled) {
      renderRow = renderTileActivity || this.renderTileActivity;
    } else {
      renderRow = renderActivity || this.renderActivity;
    }

    const items: Array<any> = !this.props.hideContent
      ? feedStore.entities.slice()
      : [];

    const AnimatedFlashList = this.AnimatedFlashList;

    return (
      <View testID={this.props.testID} style={containerStyle}>
        <AnimatedFlashList
          estimatedItemSize={this.props.estimatedItemSize || 450}
          ref={this.listRef}
          key={feedStore.isTiled ? 't' : 'f'}
          ListHeaderComponent={header}
          ListFooterComponent={!this.props.hideContent ? this.getFooter : null}
          drawDistance={drawAhead}
          data={items}
          renderItem={renderRow}
          keyExtractor={this.keyExtractor}
          refreshing={this.refreshing} // on Android it throws an invariant error (it shouldn't be necessary as we are using RefreshControl)
          refreshControl={
            <RefreshControl
              refreshing={this.refreshing}
              onRefresh={this.refresh}
              progressViewOffset={IS_IOS ? 0 : 80}
              tintColor={sp.styles.getColor('Link')}
              colors={[sp.styles.getColor('Link')]}
            />
          }
          disableAutoLayout={true}
          onEndReached={this.loadMore}
          getItemType={this.getType}
          onEndReachedThreshold={5} // 5 times the visible list height
          numColumns={feedStore.isTiled ? 3 : 1}
          ListEmptyComponent={!this.props.hideContent ? this.empty : null}
          viewabilityConfig={this.viewOpts}
          onViewableItemsChanged={this.onViewableItemsChanged}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
          testID="feedlistCMP"
          {...passThroughProps}
          keyboardDismissMode="on-drag"
          onScroll={this.props.onScroll}
        />
        {this.props.bottomComponent}
      </View>
    );
  }
}

const footerStyle = sp.styles.combine('centered', 'padding3x');
const containerStyle = sp.styles.combine('flexContainer', {
  overflow: 'hidden',
});

export default FeedList;
