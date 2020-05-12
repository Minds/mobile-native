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
//import OptionsDrawer from '../../../common/components/OptionsDrawer';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';

interface Props {
  style: StyleProp<ViewStyle>;
}

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer((props: Props) => {
  const discoveryV2 = useDiscoveryV2Store();
  let listRef: FlatList<any> | null;

  useEffect(() => {
    discoveryV2.loadTrends(true);
  }, []);

  useEffect(() => {
    listRef && listRef.scrollToOffset({ offset: -65, animated: true });
  }, [discoveryV2.refreshing]);

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
    <View style={{ flex: 1 }}>
      <FlatList
        ref={(ref) => (listRef = ref)}
        data={[...discoveryV2.trends.slice()]}
        onRefresh={onRefresh}
        refreshing={discoveryV2.loading}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
        //style={styles.list}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
