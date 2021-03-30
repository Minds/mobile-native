import React, { useEffect } from 'react';
import { AppStackParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLocalStore, observer } from 'mobx-react';
import ActivityFullScreen from '../discovery/v2/viewer/ActivityFullScreen';
import SingleEntityStore from '../common/stores/SingleEntityStore';
import ActivityModel from './ActivityModel';
import { FLAG_VIEW } from '../common/Permissions';
import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
import CenteredLoading from '../common/components/CenteredLoading';
import type BlogModel from '../blogs/BlogModel';

export type ActivityRouteProp = RouteProp<AppStackParamList, 'Activity'>;
type ActivityNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Activity'
>;

type PropsType = {
  route: ActivityRouteProp;
  navigation: ActivityNavigationProp;
};

/**
 * Single activity screen
 */
const ActivityScreen = observer((props: PropsType) => {
  const store = useLocalStore(
    (p: PropsType) => ({
      loading: false,
      entityStore: new SingleEntityStore<ActivityModel>(),
      async loadEntity() {
        const params = p.route.params;
        if (
          params.entity &&
          (params.entity.guid || params.entity.entity_guid)
        ) {
          const urn =
            'urn:activity:' + (params.entity.guid || params.entity.entity_guid);

          const entity = ActivityModel.checkOrCreate(params.entity);

          if (!entity.can(FLAG_VIEW, true)) {
            props.navigation.goBack();
            return;
          }

          store.entityStore.loadEntity(urn, entity, true);

          // change metadata source
          if (params.entity._list && params.entity._list.metadataService) {
            params.entity._list.metadataService.pushSource('single');
          }
        } else {
          const urn = 'urn:activity:' + params.guid;
          await store.entityStore.loadEntity(urn, undefined, false);

          if (
            !store.entityStore.entity ||
            !store.entityStore.entity.can(FLAG_VIEW, true)
          ) {
            props.navigation.goBack();
            return;
          }

          // in case it is opened from a deeplink and it is a blog we should replace withs blog screen
          if (store.entityStore.entity.subtype === 'blog') {
            props.navigation.replace('BlogView', {
              blog: store.entityStore.entity as BlogModel,
            });
          }
        }

        if (params.entity && params.entity._list) {
          // this second condition it's for legacy boost feed
          if (params.entity._list instanceof OffsetFeedListStore) {
            params.entity._list.addViewed(params.entity);
          } else {
            params.entity._list.viewed.addViewed(
              params.entity,
              params.entity._list.metadataService,
            );
          }
        }
      },
    }),
    props,
  );

  useEffect(() => {
    store.loadEntity();
  }, [store]);

  if (!store.entityStore.entity) {
    return <CenteredLoading />;
  }

  return <ActivityFullScreen entity={store.entityStore.entity} />;
});

export default ActivityScreen;
