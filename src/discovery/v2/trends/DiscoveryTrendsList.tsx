import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import { ComponentsStyle } from '../../../styles/Components';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';
import DiscoveryTagsManager from '../tags/DiscoveryTagsManager';

type PropsType = {
  plus?: boolean;
};

/**
 * Discovery List Item
 */
export const DiscoveryTrendsList = observer(({ plus }: PropsType) => {
  const theme = ThemedStyles.style;
  const discoveryV2 = useDiscoveryV2Store();
  let listRef = useRef<FlatList<any>>(null);
  const [showManageTags, setShowManageTags] = useState(false);

  const closeManageTags = () => {
    setShowManageTags(false);
    discoveryV2.refreshTrends();
  };

  useEffect(() => {
    discoveryV2.loadTags(plus);
    discoveryV2.loadTrends(plus);
  }, [discoveryV2, plus]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: -65, animated: true });
    }
  }, [discoveryV2.refreshing, listRef]);

  const EmptyPartial = () => {
    return discoveryV2.loading || discoveryV2.refreshing ? (
      <View />
    ) : (
      <View style={[ComponentsStyle.emptyComponentContainer, theme.flexColumn]}>
        <Text style={ComponentsStyle.emptyComponentMessage}>
          {i18n.t('discovery.addTags')}
        </Text>
        <Button
          text={i18n.t('discovery.selectTags')}
          onPress={() => setShowManageTags(true)}
        />
      </View>
    );
  };

  const ItemPartial = ({ item, index }) => {
    return <DiscoveryTrendsListItem isHero={index === 0} data={item} />;
  };

  const onRefresh = () => {
    discoveryV2.refreshTrends(plus);
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
      <DiscoveryTagsManager
        show={showManageTags}
        onCancel={closeManageTags}
        onDone={closeManageTags}
      />
      <FlatList
        ref={listRef}
        data={discoveryV2.trends}
        onRefresh={onRefresh}
        refreshing={discoveryV2.loading}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
      />
    </View>
  );
});
