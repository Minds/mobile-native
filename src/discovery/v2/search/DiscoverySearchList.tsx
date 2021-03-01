import React, { useEffect, useRef, useCallback } from 'react';

import { Text, View, FlatList } from 'react-native';

import { observer } from 'mobx-react';

import Activity from '../../../newsfeed/activity/Activity';
import { ComponentsStyle } from '../../../styles/Components';
import ErrorBoundary from '../../../common/components/ErrorBoundary';
import FeedList from '../../../common/components/feedlist/FeedList';

import ThemedStyles from '../../../styles/ThemedStyles';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';
import GroupsListItem from '../../../groups/GroupsListItem';
import DiscoveryUser from '../../DiscoveryUserNew';
import i18n from '../../../common/services/i18n.service';
import type UserModel from '../../../channel/UserModel';
import { useStores } from '../../../common/hooks/use-stores';

interface Props {
  navigation: any;
  style?: any;
}

export const DiscoverySearchList = observer((props: Props) => {
  const theme = ThemedStyles.style;

  const store = useDiscoveryV2SearchStore();
  const searchBarStore = useStores().searchBar;
  let listRef = useRef<FlatList<[]>>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: -65, animated: true });
    }
  }, [listRef, store.refreshing]);

  /**
   * Render activity item
   */
  const ItemPartial = useCallback(
    (row) => {
      let entity: Element;

      switch (row.item.type) {
        case 'user':
          entity = (
            <DiscoveryUser
              row={row}
              navigation={props.navigation}
              onUserTap={(item: UserModel) =>
                searchBarStore.user.searchBarItemTap(item)
              }
            />
          );
          break;
        case 'group':
          entity = <GroupsListItem group={row.item} />;
          break;
        default:
          entity = (
            <Activity
              entity={row.item}
              navigation={props.navigation}
              autoHeight={false}
              storeUserTap={true}
            />
          );
      }

      return (
        <ErrorBoundary
          containerStyle={[theme.borderBottomHair, theme.borderPrimary]}
          message="Could not load">
          {entity}
        </ErrorBoundary>
      );
    },
    [
      props.navigation,
      theme.borderBottomHair,
      theme.borderPrimary,
      searchBarStore,
    ],
  );

  const EmptyPartial = () => {
    return store.refreshing ? (
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

  return (
    <View style={theme.flexContainer}>
      <FeedList
        feedStore={store.listStore}
        navigation={props.navigation}
        emptyMessage={EmptyPartial}
        renderActivity={ItemPartial}
      />
    </View>
  );
});
