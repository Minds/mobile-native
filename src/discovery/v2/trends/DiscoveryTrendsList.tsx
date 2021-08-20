import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';
import FeedList from '../../../common/components/FeedList';
import { useNavigation } from '@react-navigation/native';
import type DiscoveryV2Store from '../DiscoveryV2Store';
import CenteredLoading from '../../../common/components/CenteredLoading';
import DiscoveryTrendPlaceHolder from './DiscoveryTrendPlaceHolder';

type PropsType = {
  plus?: boolean;
  store: DiscoveryV2Store;
};

const ItemPartial = (item, index) => {
  return <DiscoveryTrendsListItem isHero={index === 0} data={item} />;
};

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer(({ plus, store }: PropsType) => {
  let listRef = useRef<FeedList<any>>(null);

  const navigation = useNavigation();

  useEffect(() => {
    // do not reload if there is data already
    if (store.trends.length !== 0) return;
    store.loadTags(plus);
    store.loadTrends(plus);
    if (plus) {
      store.allFeed.setParams({ plus: true });
    }
    store.allFeed.fetch();
  }, [store, plus]);

  useEffect(() => {
    if (listRef.current && listRef.current.listRef) {
      listRef.current.listRef.scrollToOffset({ offset: -65, animated: true });
    }
  }, [store.refreshing, listRef]);

  const EmptyPartial = () => {
    return store.loading ||
      store.refreshing ||
      store.allFeed.loading ||
      store.allFeed.refreshing ? (
      <CenteredLoading />
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>{i18n.t('discovery.addTags')}</Text>
        <Button
          text={i18n.t('discovery.selectTags')}
          onPress={() => store.setShowManageTags(true)}
        />
      </View>
    );
  };

  const onRefresh = () => {
    store.refreshTrends(plus, false);
    store.allFeed.refresh();
  };

  const header =
    store.trends.length === 0 ? (
      <DiscoveryTrendPlaceHolder />
    ) : (
      <View style={styles.trendHeader}>{store.trends.map(ItemPartial)}</View>
    );

  /**
   * Render
   */
  return (
    <FeedList
      ref={listRef}
      header={header}
      feedStore={store.allFeed}
      emptyMessage={EmptyPartial}
      navigation={navigation}
      onRefresh={onRefresh}
    />
  );
});

const styles = ThemedStyles.create({
  emptyContainer: ['halfHeight', 'alignCenter', 'justifyCenter', 'flexColumn'],
  emptyMessage: [
    'fontXXXL',
    'colorSecondaryText',
    'textCenter',
    'marginVertical2x',
  ],
  trendHeader: ['borderBottom8x', 'bcolorPrimaryBorder', 'marginBottom2x'],
});
