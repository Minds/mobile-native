import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList } from 'react-native';
import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import { ComponentsStyle } from '../../../styles/Components';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer(() => {
  const theme = ThemedStyles.style;
  const discoveryV2 = useDiscoveryV2Store();
  let listRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    discoveryV2.loadTrends();
  }, [discoveryV2]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: -65, animated: true });
    }
  }, [discoveryV2.refreshing, listRef]);

  const EmptyPartial = () => {
    return discoveryV2.loading || discoveryV2.refreshing ? (
      <View />
    ) : (
      <View>
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Text style={ComponentsStyle.emptyComponentMessage}>
              {i18n.t('discovery.nothingToSee')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ItemPartial = ({ item, index }) => {
    return <DiscoveryTrendsListItem isHero={index === 0} data={item} />;
  };

  const onRefresh = () => {
    discoveryV2.refreshTrends();
  };

  /**
   * Key extractor
   */
  const keyExtractor = (item) => String(item.id);

  /**
   * Render
   */
  return (
    <View style={theme.flexContainer}>
      <FlatList
        ref={listRef}
        data={discoveryV2.trends.slice()}
        onRefresh={onRefresh}
        refreshing={discoveryV2.loading}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
      />
    </View>
  );
});
