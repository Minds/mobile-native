import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { View, SectionList, SectionListData } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { ComponentsStyle } from '~/styles/Components';

import DiscoveryV2Store, { TDiscoveryTagsTag } from '../DiscoveryV2Store';
import MenuItem from '~/common/components/menus/MenuItem';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import DiscoveryTagsManager from './DiscoveryTagsManager';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

interface Props {
  type: 'your' | 'trending';
  plus?: boolean;
  store: DiscoveryV2Store;
  style?: any;
  header?: any;
  showManageTags?: boolean;
}

/**
 * Key extractor
 */
const keyExtractor = item => String(item.value);

/**
 * Discovery List Item
 */
export const DiscoveryTagsList = withErrorBoundary(
  observer(
    ({ plus, store, type, showManageTags = true, style, header }: Props) => {
      const navigation = useNavigation<StackNavigationProp<any>>();
      const ref = React.useRef<BottomSheetModal>();
      const i18n = sp.i18n;
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
                <MText style={ComponentsStyle.emptyComponentMessage}>
                  {i18n.t('discovery.nothingToSee')}
                </MText>
              </View>
            </View>
          </View>
        );
      };

      const renderItem = ({ item }) => {
        let postsCount = item.posts_count
          ? `${item.posts_count} ${i18n.t('discovery.posts')}`
          : '';
        const votesCount = item.votes_count
          ? `${item.votes_count} ${i18n.t('discovery.votes')}`
          : '';
        return (
          <MenuItem
            onPress={() =>
              navigation.push('DiscoverySearch', {
                query: '#' + item.value,
                plus: plus,
              })
            }
            title={`#${item.value}`}
            subtitle={
              postsCount !== '' || votesCount !== ''
                ? `${postsCount || ''} ${postsCount && votesCount ? '·' : ''} ${
                    votesCount || ''
                  }`
                : ''
            }
          />
        );
      };

      const SectionHeaderPatrial = (info: {
        section: SectionListData<any>;
      }) => {
        if (
          info.section.data.length === 0 &&
          (store.loading || store.refreshing)
        ) {
          return null;
        }
        return (
          <View
            style={[
              sp.styles.style.rowJustifyStart,
              sp.styles.style.padding4x,
            ]}>
            <View style={sp.styles.style.flexContainer} />
            <MText
              onPress={() => ref.current?.present()}
              style={sp.styles.style.colorSecondaryText}>
              Manage Tags
            </MText>
            <DiscoveryTagsManager ref={ref} />
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
        <View style={styles.container}>
          <SectionList
            renderItem={renderItem}
            ListHeaderComponent={header}
            renderSectionHeader={
              showManageTags ? SectionHeaderPatrial : undefined
            }
            ListEmptyComponent={EmptyPartial}
            onRefresh={onRefresh}
            refreshing={store.refreshing}
            sections={[
              {
                title: title,
                data: [...tags],
              },
            ]}
            keyExtractor={keyExtractor}
            style={style}
          />
        </View>
      );
    },
  ),
);

const styles = sp.styles.create({
  container: ['flexContainer'],
  centered: {
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  paddingTop: {
    paddingTop: 8,
  },
});
