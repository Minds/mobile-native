import { observer, inject } from 'mobx-react';
import React, { PureComponent, Fragment, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  SectionList,
  SectionListData,
  TouchableHighlight,
} from 'react-native';
//import { DiscoveryTrendsListItem } from './DiscoveryTrendsListItem';
import { ComponentsStyle } from '../../../styles/Components';
import { useStores } from '../../../common/hooks/use-stores';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';
import ThemedStyles from '../../../styles/ThemedStyles';
import { DiscoveryTrendsListItem } from '../trends/DiscoveryTrendsListItem';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TagOptinDrawer from '../../../common/components/TagOptinDrawer';
import BottomOptionPopup from '../../../common/components/BottomOptionPopup';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { getTags } from 'react-native-device-info';
import { ScrollView } from 'react-native-gesture-handler';
import { DiscoveryTagsManager } from './DiscoveryTagsManager';

interface Props {
  style: StyleProp<ViewStyle>;
}

/**
 * Discovery List Item
 */
export const DiscoveryTagsList = observer((props: Props) => {
  const discoveryV2 = useDiscoveryV2Store();
  const navigation = useNavigation<StackNavigationProp<any>>();
  let listRef: FlatList<[]> | null;

  const [showManageTags, setShowManageTags] = useState(false);

  useEffect(() => {
    discoveryV2.loadTags(true);
  }, []);

  useEffect(() => {
    listRef && listRef.scrollToOffset({ offset: -65, animated: true });
  }, [discoveryV2.refreshing]);

  const onPress = (data): void => {
    navigation.push('DiscoverySearch', {
      query: '#' + data.value,
    });
  };

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
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => onPress(item)}>
        <View
          style={[
            styles.container,
            ThemedStyles.style.paddingVertical3x,
            index === 0 ? { paddingTop: 0 } : null,
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
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      </TouchableHighlight>
    );
  };

  const SectionHeaderPatrial = (info: { section: SectionListData<any> }) => {
    if (
      info.section.data.length === 0 &&
      (discoveryV2.loading || discoveryV2.refreshing)
    ) {
      return null;
    }
    return (
      <View
        style={[
          ThemedStyles.style.rowJustifyStart,
          ThemedStyles.style.backgroundPrimary,
          ThemedStyles.style.padding4x,
        ]}>
        <Text style={[ThemedStyles.style.colorTertiaryText]}>
          {info.section.title.toUpperCase()}
        </Text>

        <View style={[ThemedStyles.style.flexContainer]}></View>
        {info.section.title === 'Your tags' ? (
          <Text
            onPress={() => setShowManageTags(true)}
            style={[ThemedStyles.style.colorTertiaryText]}>
            Manage Tags
          </Text>
        ) : null}
      </View>
    );
  };

  const closeManageTags = () => {
    setShowManageTags(false);
  };

  const onRefresh = () => {
    discoveryV2.refreshTags();
  };

  /**
   * Key extractor
   */
  const keyExtractor = (item) => String(item.value);

  /**
   * Render
   */

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        renderItem={ItemPartial}
        renderSectionHeader={SectionHeaderPatrial}
        ListEmptyComponent={EmptyPartial}
        onRefresh={onRefresh}
        refreshing={discoveryV2.loading}
        sections={[
          {
            title: 'Your tags',
            data: [...discoveryV2.tags.slice()],
          },
          {
            title: 'Trending tags',
            data: [...discoveryV2.trendingTags.slice()],
          },
        ]}
        keyExtractor={keyExtractor}></SectionList>

      <DiscoveryTagsManager
        show={showManageTags}
        onCancel={closeManageTags}
        onDone={closeManageTags}></DiscoveryTagsManager>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  body: { flex: 1, paddingRight: 10 },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryInformation: {
    color: ThemedStyles.getColor('secondary_text'),
  },
  secondaryInformationTop: {
    paddingBottom: 8,
  },
  secondaryInformationBottom: {
    paddingTop: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
});
