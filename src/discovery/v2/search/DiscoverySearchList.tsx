import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { observer } from 'mobx-react';

import Activity from '~/newsfeed/activity/Activity';
import { ComponentsStyle } from '~/styles/Components';
import ErrorBoundary from '~/common/components/ErrorBoundary';
import FeedList from '~/common/components/FeedList';

import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';
import GroupsListItem from '~/groups/GroupsListItem';
import UserModel from '~/channel/UserModel';
import { useStores } from '~/common/hooks/use-stores';
import MText from '~/common/components/MText';
import ChannelListItem from '~/common/components/ChannelListItem';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import { B2, H4, Row } from '~/common/ui';
import Divider from '~/common/components/Divider';
import {
  ActivityNode,
  SearchFilterEnum,
  SearchMediaTypeEnum,
  useFetchSearchQuery,
} from '~/graphql/api';
import GroupModel from '~/groups/GroupModel';
import { ChannelRecommendationItem } from '~/modules/recommendation';
import sp from '~/services/serviceProvider';

interface Props {
  navigation: any;
  style?: any;
}

export const DiscoverySearchList = observer((props: Props) => {
  const theme = sp.styles.style;

  const store = useDiscoveryV2SearchStore();
  const searchBarStore = useStores().searchBar;
  let listRef = useRef<FlatList<[]>>(null);
  const i18n = sp.i18n;
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: -65, animated: true });
    }
  }, [listRef, store.refreshing]);

  /**
   * Render activity item
   */
  const ItemPartial = useCallback(
    row => {
      let entity: React.ReactElement;

      switch (row.item.type) {
        case 'user':
          entity = (
            <ChannelListItem
              channel={row.item}
              navigation={props.navigation}
              onUserTap={(item: UserModel) =>
                searchBarStore.user?.searchBarItemTap(item)
              }
              borderless
            />
          );
          break;
        case 'group':
          entity = <GroupsListItem index={row.index} group={row.item} />;
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
          containerStyle={[theme.borderBottomHair, theme.bcolorPrimaryBorder]}
          message="Could not load">
          {entity}
        </ErrorBoundary>
      );
    },
    [
      props.navigation,
      theme.borderBottomHair,
      theme.bcolorPrimaryBorder,
      searchBarStore,
    ],
  );

  const EmptyPartial = React.useMemo(() => {
    return store.refreshing ? (
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
  }, [i18n, store.refreshing]);

  const { algorithm, q: searchTerm } =
    store.listStore.feedsService.params ?? {};
  const isTop = algorithm === 'top';

  return (
    <View style={theme.flexContainer}>
      <FeedList
        header={
          isTop ? (
            <AnimatedHeight>
              <Finder type="group" query={searchTerm} />
              <Finder type="channel" query={searchTerm} />
            </AnimatedHeight>
          ) : undefined
        }
        feedStore={store.listStore}
        navigation={props.navigation}
        emptyMessage={EmptyPartial}
        renderActivity={ItemPartial}
      />
    </View>
  );
});

function Finder({ type, query }: { type: 'group' | 'channel'; query: string }) {
  const store = useDiscoveryV2SearchStore();
  const entities = useSearchQuery(type, query);

  return entities.length === 0 ? null : (
    <>
      <View style={sp.styles.style.bgPrimaryBackground}>
        <Row align="centerBetween" vertical="L" horizontal="L">
          <H4>{type === 'channel' ? 'Channels' : 'Groups'}</H4>
          <B2
            color="link"
            onPress={() => {
              store.setAlgorithm(type === 'channel' ? 'channels' : 'groups');
            }}>
            {sp.i18n.t('seeMore')}
          </B2>
        </Row>
      </View>
      {entities.map((item, index) =>
        type === 'group' ? (
          <GroupsListItem
            group={item as GroupModel}
            index={index}
            onPress={() => null}
          />
        ) : (
          <ChannelRecommendationItem
            key={item.guid}
            channel={item as UserModel}
            onSubscribed={() => null}
          />
        ),
      )}
      <Divider />
    </>
  );
}

const useSearchQuery = (type: 'group' | 'channel', query: string) => {
  const Model = type === 'group' ? GroupModel : UserModel;
  const { data } = useFetchSearchQuery(
    {
      query,
      filter:
        type === 'channel' ? SearchFilterEnum.User : SearchFilterEnum.Group,
      mediaType: SearchMediaTypeEnum.All,
      limit: 3,
    },
    {
      staleTime: 3000,
    },
  );

  const items = useMemo(
    () =>
      data?.search?.edges?.map(item =>
        Model.create(JSON.parse((item.node as ActivityNode).legacy)),
      ) ?? [],
    [data, Model],
  );

  return items;
};
