import { observer, inject } from 'mobx-react';
import React, { PureComponent, Fragment, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import { ComponentsStyle } from '../../../styles/Components';
import { useStores } from '../../../common/hooks/use-stores';

interface Props {
  style: StyleProp<ViewStyle>;
}

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer((props: Props) => {
  const { discoveryV2 } = useStores();

  useEffect(() => {
    discoveryV2.loadTrends(true);
  }, []);

  const EmptyPartial = () => {
    return discoveryV2.loading || discoveryV2.refreshing ? (
      <View></View>
    ) : (
      <View>
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Text style={ComponentsStyle.emptyComponentMessage}>
              Nothing to see here...
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ItemPartial = ({ item, index }) => {
    return (
      <DiscoveryTrendsListItem
        isHero={index === 0}
        data={item}></DiscoveryTrendsListItem>
    );
  };

  const refresh = () => {
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...discoveryV2.trends.slice()]}
        onRefresh={refresh}
        refreshing={discoveryV2.loading}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
        style={styles.list}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
