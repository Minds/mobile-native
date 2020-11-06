import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
  TouchableHighlight,
} from 'react-native';
import { ComponentsStyle } from '../../../styles/Components';
import ThemedStyles from '../../../styles/ThemedStyles';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiscoveryTagsManager } from './DiscoveryTagsManager';
import DiscoveryV2Store, { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import i18n from '../../../common/services/i18n.service';

interface Props {
  type: 'your' | 'trending';
  plus?: boolean;
  store: DiscoveryV2Store;
}

/**
 * Key extractor
 */
const keyExtractor = (item) => String(item.value);

/**
 * Discovery List Item
 */
export const DiscoveryTagsList = observer(({ plus, store, type }: Props) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [showManageTags, setShowManageTags] = useState(false);

  useEffect(() => {
    store.loadTags(plus);
  }, [store, plus]);

  const onPress = (data): void => {
    navigation.push('DiscoverySearch', {
      query: '#' + data.value,
      plus: plus,
    });
  };

  const EmptyPartial = () => {
    return store.loading || store.refreshing ? (
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
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => onPress(item)}>
        <View
          style={[
            styles.container,
            ThemedStyles.style.paddingVertical3x,
            index === 0 ? ThemedStyles.style.paddingTop0x : null,
            ThemedStyles.style.borderPrimary,
            ThemedStyles.style.paddingHorizontal4x,
          ]}>
          <View style={[styles.body]}>
            <Text style={styles.title}>#{item.value}</Text>
          </View>
          <Icon
            type="material-community"
            color={ThemedStyles.getColor('tertiary_text')}
            name="chevron-right"
            size={32}
            style={styles.centered}
          />
        </View>
      </TouchableHighlight>
    );
  };

  const SectionHeaderPatrial = (info: { section: SectionListData<any> }) => {
    if (info.section.data.length === 0 && (store.loading || store.refreshing)) {
      return null;
    }
    return (
      <View
        style={[
          ThemedStyles.style.rowJustifyStart,
          ThemedStyles.style.backgroundPrimary,
          ThemedStyles.style.padding4x,
        ]}>
        {/* <Text style={[ThemedStyles.style.colorTertiaryText]}>
          {info.section.title.toUpperCase()}
        </Text> */}
        <View style={ThemedStyles.style.flexContainer} />
        <Text
          onPress={() => setShowManageTags(true)}
          style={[ThemedStyles.style.colorTertiaryText]}>
          Manage Tags
        </Text>
      </View>
    );
  };

  const closeManageTags = () => {
    setShowManageTags(false);
  };

  const onRefresh = () => {
    store.refreshTags();
  };

  let tags: TDiscoveryTagsTag[] = [];
  let title = i18n.t('other');

  switch (type) {
    case 'your':
      tags = [...store.tags.slice()];
      title = i18n.t('discovery.yourTags');
      break;
    case 'trending':
      tags = [...store.trendingTags.slice()];
      title = i18n.t('discovery.trendingTags');
      break;
  }

  /**
   * Render
   */

  return (
    <View style={ThemedStyles.style.flexContainer}>
      <SectionList
        renderItem={ItemPartial}
        renderSectionHeader={SectionHeaderPatrial}
        ListEmptyComponent={EmptyPartial}
        onRefresh={onRefresh}
        refreshing={store.loading}
        sections={[
          {
            title: title,
            data: [...tags],
          },
        ]}
        keyExtractor={keyExtractor}
      />

      <DiscoveryTagsManager
        show={showManageTags}
        onCancel={closeManageTags}
        onDone={closeManageTags}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  centered: {
    alignSelf: 'center',
  },
  body: { flex: 1, paddingRight: 10 },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
});
