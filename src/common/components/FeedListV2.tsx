import React, { useCallback } from 'react';
import { View, ViewToken } from 'react-native';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { FlashList, FlashListProps } from '@shopify/flash-list';

import ActivityModel from '~/newsfeed/ActivityModel';
import Activity from '~/newsfeed/activity/Activity';
import type FeedStore from '~/common/stores/FeedStore';
import type BaseModel from '~/common/BaseModel';
import { InjectItem } from '~/common/components/FeedList';
import i18n from '~/common/services/i18n.service';
import ErrorLoading from '~/common/components/ErrorLoading';
import MText from '~/common/components/MText';
import { ComponentsStyle } from '~/styles/Components';
import CenteredLoading from '~/common/components/CenteredLoading';

type PlaceholderType =
  | React.ComponentType<any>
  | React.ReactElement
  | null
  | undefined;

export type FeedListPropsType<T extends BaseModel> = {
  feedStore: FeedStore<T>;
  hideContent?: boolean;
  emptyMessage?: React.ReactElement;
  onRefresh?: () => Promise<any>;
  afterRefresh?: () => void;
  displayBoosts?: 'none' | 'distinct';
  placeholder?: PlaceholderType;
} & Omit<
  FlashListProps<T>,
  'data' | 'getItemType' | 'keyExtractor' | 'renderItem'
>;

function FeedList<T extends BaseModel>(
  props: FeedListPropsType<T>,
  ref: React.Ref<FlashList<T>>,
) {
  const {
    displayBoosts,
    hideContent,
    placeholder,
    emptyMessage,
    refreshing,
    feedStore,
    ...other
  } = props;

  const navigation = useNavigation();

  const items: Array<any> = !hideContent ? feedStore.entities.slice() : [];

  const renderActivity = useCallback(
    (row: { index: number; item: any; target: string }) => {
      const entity = row.item;
      return (
        <Activity
          entity={entity}
          displayBoosts={displayBoosts}
          navigation={navigation}
          autoHeight={false}
        />
      );
    },
    [navigation, displayBoosts],
  );

  const footerRender = useCallback(
    () => <Footer feedStore={feedStore} Placeholder={placeholder} />,
    [feedStore, placeholder],
  );

  const emptyRender = useCallback(
    () => <Empty feedStore={feedStore} emptyMessage={emptyMessage} />,
    [feedStore, emptyMessage],
  );

  return (
    <FlashList
      estimatedItemSize={450}
      data={items}
      refreshing={
        typeof refreshing === 'boolean' ? refreshing : feedStore.refreshing
      }
      onEndReachedThreshold={5}
      renderItem={renderActivity}
      keyExtractor={keyExtractor}
      ListFooterComponent={footerRender}
      onViewableItemsChanged={onViewableItemsChanged}
      getItemType={getItemType}
      ListEmptyComponent={!hideContent ? emptyRender : null}
      onEndReached={feedStore.ifNoErrorLoadMore}
      viewabilityConfig={viewabilityConfig}
      {...other}
      ref={ref}
    />
  );
}

const Empty = observer(({ feedStore, emptyMessage }) => {
  if (feedStore.loaded && !feedStore.refreshing) {
    if (emptyMessage) {
      return emptyMessage;
    } else {
      return (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <MText style={ComponentsStyle.emptyComponentMessage}>
              {i18n.t('newsfeed.empty')}
            </MText>
          </View>
        </View>
      );
    }
  }
  return null;
});

const Footer = observer(({ feedStore, Placeholder }) => {
  if (Placeholder && !feedStore.loaded) {
    return React.isValidElement(Placeholder) ? Placeholder : <Placeholder />;
  }
  if (feedStore.loading) {
    return <CenteredLoading />;
  }
  if (feedStore.errorLoading) {
    const message = feedStore.entities.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return (
      <ErrorLoading message={message} tryAgain={() => feedStore.reload()} />
    );
  }
  return null;
});

const getItemType = (item: ActivityModel | InjectItem) => {
  const isActivity = item instanceof ActivityModel;
  return item instanceof InjectItem
    ? item.type
    : isActivity && item.hasVideo()
    ? 'video'
    : isActivity && item.hasVideo()
    ? 'image'
    : 'row';
};

const keyExtractor = (item, index: any) => {
  return item instanceof InjectItem
    ? `${item.type}${index}`
    : item.boosted
    ? `${item.urn}:${index}`
    : item.urn;
};

const onViewableItemsChanged = (change: {
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

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 500,
};

export const FeedListV2 = observer(
  React.forwardRef(FeedList) as <T extends BaseModel>(
    props: FeedListPropsType<T> & {
      ref?: React.Ref<FlashList<T>>;
    },
  ) => React.ReactElement,
);
