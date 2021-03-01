import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

import { FlatList, View, Text, StyleProp, ViewStyle } from 'react-native';
import type FeedStore from '../../stores/FeedStore';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { observer, useLocalStore } from 'mobx-react';
import createFeedListLocalStore from './createFeedListLocalStore';
import { ComponentsStyle } from '../../../styles/Components';
import i18n from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import ErrorBoundary from '../ErrorBoundary';
import Activity from '../../../newsfeed/activity/Activity';
import TileElement from '../../../newsfeed/TileElement';
import Footer from './Footer';
import useLoadNewPosts from './useLoadNewPosts';

export type WrapperComponentProps<T> = {
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
  doNotCheckNewestPosts?: boolean;
};

type FeedListPropsType<T> = React.PropsWithChildren<WrapperComponentProps<T>>;

const FeedList = observer(
  forwardRef(<T extends object>(props: FeedListPropsType<T>, ref) => {
    const listRef = useRef<FlatList<T>>(null);
    const localStore = useLocalStore(createFeedListLocalStore);
    const theme = ThemedStyles.style;

    const newPosts = props.doNotCheckNewestPosts
      ? null
      : useLoadNewPosts(props.feedStore, listRef);

    /**
     * Scroll to top (called from ref)
     * @param {boolean} animated
     */
    const scrollToTop = (animated = true) => {
      if (listRef) {
        listRef.current?.scrollToOffset({ animated, offset: 0 });
      }
    };

    const onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      props.feedStore.scrollOffset = e.nativeEvent.contentOffset.y;
    };

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
    } = props;

    const ListComponent: React.ComponentType<any> = listComponent || FlatList;

    const onViewableItemsChanged = useCallback(
      (change: { viewableItems: any[]; changed: any[] }) => {
        change.viewableItems.forEach((item: { item: any }) => {
          props.feedStore.addViewed(item.item);
        });
        change.changed.forEach(
          (c: {
            item: { setVisible: (arg0: any) => void };
            isViewable: any;
          }) => {
            if (c.item.setVisible) {
              c.item.setVisible(c.isViewable);
            }
          },
        );
      },
      [props.feedStore],
    );

    /**
     * Load feed data
     */
    const loadMore = () => {
      if (props.feedStore.errorLoading) return;
      props.feedStore.loadMore();
    };

    /**
     * Refresh feed data
     */
    const refresh = () => {
      props.feedStore.refresh();
      if (props.afterRefresh) {
        props.afterRefresh();
      }
    };

    /**
     * Render activity
     */
    const defaultRenderActivity = useCallback(
      (row: { index: number; item: ActivityModel }) => {
        let isLast = props.feedStore.entities.length === row.index + 1;
        const entity = row.item;

        return (
          <ErrorBoundary
            message={i18n.t('errorShowActivity')}
            containerStyle={theme.hairLineBottom}>
            <Activity
              entity={entity}
              navigation={props.navigation}
              autoHeight={false}
              isLast={isLast}
              showCommentsOutlet={false}
            />
          </ErrorBoundary>
        );
      },
      [props.feedStore.entities.length, props.navigation, theme.hairLineBottom],
    );

    /**
     * Render tile
     */
    const defaultRenderTileActivity = useCallback(
      (row: { item: any }) => {
        const entity = row.item;
        return (
          <TileElement
            size={localStore.itemHeight}
            entity={entity}
            navigation={props.navigation}
          />
        );
      },
      [localStore.itemHeight, props.navigation],
    );

    /**
     * Imperative functionality of the component
     */
    useImperativeHandle(ref, () => ({
      scrollToTop: scrollToTop,
      listRef: listRef,
    }));

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

    /**
     * Key extractor for list items
     */
    const keyExtractor = (item: { boosted: any; urn: any }, index: any) => {
      return item.boosted ? `${item.urn}:${index}` : item.urn;
    };

    if (feedStore.isTiled) {
      renderRow = renderTileActivity || defaultRenderTileActivity;
    } else {
      renderRow = renderActivity || defaultRenderActivity;
    }

    const footer = () => <Footer {...props} />;

    return (
      <>
        {newPosts}
        <ListComponent
          ref={listRef}
          key={feedStore.isTiled ? 't' : 'f'}
          onLayout={localStore.onLayout}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          data={!props.hideItems ? feedStore.entities.slice() : []}
          renderItem={renderRow}
          keyExtractor={keyExtractor}
          onRefresh={refresh}
          refreshing={feedStore.refreshing}
          onEndReached={loadMore}
          // onEndReachedThreshold={0}
          numColumns={feedStore.isTiled ? 3 : 1}
          style={[
            ThemedStyles.style.flexContainer,
            ThemedStyles.style.backgroundPrimary,
          ]}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={7}
          // removeClippedSubviews={true}
          ListEmptyComponent={!props.hideItems ? empty : null}
          viewabilityConfig={localStore.viewOpts}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={onScroll}
          keyboardShouldPersistTaps="always"
          {...passThroughProps}
        />
      </>
    );
  }),
);

export default FeedList;
export type FeedListType<T> = ReturnType<typeof FeedList>;
