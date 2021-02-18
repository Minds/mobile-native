import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SectionListData,
} from 'react-native';
import { ComponentsStyle } from '../../../styles/Components';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DiscoveryV2Store, { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import i18n from '../../../common/services/i18n.service';
import MenuItem from '../../../common/components/menus/MenuItem';

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

  useEffect(() => {
    store.loadTags(plus);
  }, [store, plus]);

  const EmptyPartial = () => {
    return store.loadingTags || store.refreshing ? (
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

  const renderItem = ({ item }) => {
    const theme = ThemedStyles.style;
    let postsCount = item.posts_count
      ? `${item.posts_count} ${i18n.t('discovery.posts')}`
      : '';
    const votesCount = item.votes_count
      ? `${item.votes_count} ${i18n.t('discovery.votes')}`
      : '';
    return (
      <MenuItem
        item={{
          onPress: () =>
            navigation.push('DiscoverySearch', {
              query: '#' + item.value,
              plus: plus,
            }),
          title: (
            <>
              <Text style={styles.title}>#{item.value}</Text>
              {(postsCount !== '' || votesCount !== '') && (
                <Text
                  style={[
                    theme.colorSecondaryText,
                    theme.fontM,
                    theme.fontNormal,
                  ]}>
                  {`\n${postsCount || ''} ${
                    postsCount && votesCount ? '·' : ''
                  } ${votesCount || ''}`}
                </Text>
              )}
            </>
          ),
        }}
        containerItemStyle={theme.backgroundPrimary}
      />
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
        <View style={ThemedStyles.style.flexContainer} />
        <Text
          onPress={() => store.setShowManageTags(true)}
          style={[ThemedStyles.style.colorTertiaryText]}>
          Manage Tags
        </Text>
      </View>
    );
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
        renderItem={renderItem}
        renderSectionHeader={SectionHeaderPatrial}
        ListEmptyComponent={EmptyPartial}
        onRefresh={onRefresh}
        refreshing={store.loadingTags}
        sections={[
          {
            title: title,
            data: [...tags],
          },
        ]}
        keyExtractor={keyExtractor}
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
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 38,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  paddingTop: {
    paddingTop: 8,
  },
});
