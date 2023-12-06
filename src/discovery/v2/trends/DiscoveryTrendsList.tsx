import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';
import { InjectItem } from '../../../common/components/FeedList';
import type DiscoveryV2Store from '../DiscoveryV2Store';
import CenteredLoading from '../../../common/components/CenteredLoading';
import DiscoveryTrendPlaceHolder from './DiscoveryTrendPlaceHolder';
import DiscoveryTagsManager from '../tags/DiscoveryTagsManager';
import MText from '../../../common/components/MText';
import FeedListSticky from '~/common/components/FeedListSticky';

type PropsType = {
  plus?: boolean;
  store: DiscoveryV2Store;
  header?: React.ReactElement;
  emptyMessage?: React.ReactElement;
};

const ItemPartial = (item, index) => {
  return (
    <DiscoveryTrendsListItem key={index} isHero={index === 0} data={item} />
  );
};

const Trend = observer(({ store }) => {
  return store.trends.length ? (
    <View style={styles.trendHeader}>{store.trends.map(ItemPartial)}</View>
  ) : store.loading ? (
    <DiscoveryTrendPlaceHolder />
  ) : null;
});

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer(
  ({ plus, store, header, emptyMessage }: PropsType) => {
    let listRef = useRef<any>(null);
    let tagRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
      // do not reload if there is data already
      if (store.trends.length !== 0) {
        return;
      }
      store.loadTags(plus);
      store.loadTrends(plus);
      if (plus) {
        store.allFeed.setParams({ plus: true });
      }
      store.allFeed.fetch();
    }, [store, plus]);

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollToOffset({ offset: -65, animated: true });
      }
    }, [store.refreshing, listRef]);

    const onRefresh = () => {
      store.refreshTrends(plus, false);
      return store.allFeed.refresh();
    };

    if (!store.allFeed.injectItems) {
      store.allFeed.setInjectedItems([
        new InjectItem(0, 'header', () => <Trend store={store} />),
      ]);
    }

    /**
     * Render
     */
    return (
      <FeedListSticky
        ref={listRef}
        feedStore={store.allFeed}
        header={header}
        emptyMessage={
          store.loading ||
          store.refreshing ||
          store.allFeed.loading ||
          store.allFeed.refreshing ? (
            <CenteredLoading />
          ) : emptyMessage ? (
            emptyMessage
          ) : (
            <View style={styles.emptyContainer}>
              <MText style={styles.emptyMessage}>
                {i18n.t('discovery.addTags')}
              </MText>
              <DiscoveryTagsManager ref={tagRef} />
              <Button
                text={i18n.t('discovery.selectTags')}
                onPress={() => tagRef.current?.present()}
              />
            </View>
          )
        }
        refreshing={store.refreshing}
        onRefresh={onRefresh}
      />
    );
  },
);

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
