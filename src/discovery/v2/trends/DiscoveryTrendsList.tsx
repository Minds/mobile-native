import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import { ComponentsStyle } from '../../../styles/Components';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';
import FeedList, {
  FeedListType,
} from '../../../common/components/feedlist/FeedList';
import { useNavigation } from '@react-navigation/native';
import type DiscoveryV2Store from '../DiscoveryV2Store';
import CenteredLoading from '../../../common/components/CenteredLoading';

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
  const theme = ThemedStyles.style;
  let listRef = useRef<FeedListType<any>>(null);

  const navigation = useNavigation();

  useEffect(() => {
    store.loadTags(plus);
    store.loadTrends(plus);
    if (plus) {
      store.allFeed.setParams({ plus: true });
    }
    store.allFeed.fetch();
  }, [store, plus]);

  useEffect(() => {
    //@ts-ignore
    if (listRef.current && listRef.current.listRef) {
      //@ts-ignore
      listRef.current.listRef.current.scrollToOffset({
        offset: -65,
        animated: true,
      });
    }
  }, [store.refreshing, listRef]);

  const EmptyPartial = () => {
    return store.loading ||
      store.refreshing ||
      store.allFeed.loading ||
      store.allFeed.refreshing ? (
      <CenteredLoading />
    ) : (
      <View style={[ComponentsStyle.emptyComponentContainer, theme.flexColumn]}>
        <Text style={ComponentsStyle.emptyComponentMessage}>
          {i18n.t('discovery.addTags')}
        </Text>
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

  const header = (
    <View
      style={[theme.borderBottom8x, theme.borderPrimary, theme.marginBottom2x]}>
      {store.trends.map(ItemPartial)}
    </View>
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
