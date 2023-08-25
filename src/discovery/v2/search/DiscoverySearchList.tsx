import React, { useEffect, useRef, useCallback } from 'react';

import { View, FlatList } from 'react-native';

import { observer } from 'mobx-react';

import Activity from '../../../newsfeed/activity/Activity';
import { ComponentsStyle } from '../../../styles/Components';
import ErrorBoundary from '../../../common/components/ErrorBoundary';
import FeedList from '../../../common/components/FeedList';

import ThemedStyles from '../../../styles/ThemedStyles';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';
import GroupsListItem from '../../../groups/GroupsListItem';
import i18n from '../../../common/services/i18n.service';
import UserModel from '../../../channel/UserModel';
import { useStores } from '../../../common/hooks/use-stores';
import MText from '../../../common/components/MText';
import ChannelListItem from '~/common/components/ChannelListItem';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import { B2, H4, Row } from '~/common/ui';
import i18nService from '../../../common/services/i18n.service';
import Divider from '~/common/components/Divider';
import {
  ActivityNode,
  SearchFilterEnum,
  SearchMediaTypeEnum,
  useFetchSearchQuery,
} from '~/graphql/api';
import GroupModel from '~/groups/GroupModel';
import { ChannelRecommendationItem } from '~/modules/recommendation';

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
  }, [store.refreshing]);

  const { algorithm, q: searchTerm } =
    store.listStore.feedsService.params ?? {};
  const isTop = algorithm === 'top';
  console.log('Search', isTop, searchTerm);

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

  const entities = data?.search?.edges;
  if (!entities?.length) {
    return null;
  }

  return (
    <>
      <View style={ThemedStyles.style.bgPrimaryBackground}>
        <Row align="centerBetween" vertical="L" horizontal="L">
          <H4>{type === 'channel' ? 'Channels' : 'Groups'}</H4>
          <B2
            color="link"
            onPress={() => {
              store.setAlgorithm(type === 'channel' ? 'channels' : 'groups');
            }}>
            {i18nService.t('seeMore')}
          </B2>
        </Row>
      </View>
      {entities.map((item, index) => {
        const ent = Model.create(
          JSON.parse((item.node as ActivityNode).legacy),
        );

        return type === 'group' ? (
          <GroupsListItem
            group={ent as GroupModel}
            index={index}
            onPress={() => null}
          />
        ) : (
          <ChannelRecommendationItem
            key={ent.guid}
            channel={ent as UserModel}
            onSubscribed={() => null}
          />
        );
      })}
      <Divider />
    </>
  );
}
