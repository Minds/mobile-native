import React, { useEffect } from 'react';
import { AppStackParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLocalStore, observer } from 'mobx-react';
import ActivityFullScreen from '../discovery/v2/viewer/ActivityFullScreen';
import SingleEntityStore from '../common/stores/SingleEntityStore';
import ActivityModel from './ActivityModel';
import { FLAG_VIEW } from '../common/Permissions';
import CenteredLoading from '../common/components/CenteredLoading';
import type BlogModel from '../blogs/BlogModel';
import { showNotification } from '../../AppMessages';
import withModalProvider from '~/navigation/withModalProvide';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

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
const ActivityScreen = withErrorBoundaryScreen(
  observer((props: PropsType) => {
    const store = useLocalStore(
      (p: PropsType) => ({
        loading: false,
        setLoading(value: boolean) {
          store.loading = value;
        },
        entityStore: new SingleEntityStore<ActivityModel>(),
        async loadEntity() {
          const params = p.route.params;
          if (
            (params.entity && params.entity.urn) ||
            (params.entity && (params.entity.guid || params.entity.entity_guid))
          ) {
            const urn = params.entity.urn
              ? params.entity.urn
              : 'urn:activity:' +
                (params.entity.guid || params.entity.entity_guid);

            const entity = ActivityModel.checkOrCreate(params.entity);

            if (!entity.can(FLAG_VIEW, true)) {
              props.navigation.goBack();
              return;
            }
            await store.entityStore.loadEntity(urn, entity, false);
          } else {
            const urn = 'urn:activity:' + params.guid;
            this.setLoading(true);
            await store.entityStore.loadEntity(urn, undefined, false);
            this.setLoading(false);

            if (!store.entityStore.entity) {
              showNotification(
                sp.i18n.t('settings.reportedContent.postNotFound'),
                'info',
                3000,
              );
            }

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
            // workaround for tagged in group conversation notification
            if (store.entityStore.entity.type === 'group') {
              props.navigation.replace('GroupView', {
                // @ts-ignore
                group: store.entityStore.entity,
                ...params,
              });
            }
          }
          store.entityStore.entity?.sendViewed('single');
        },
      }),
      props,
    );

    useEffect(() => {
      store.loadEntity();
    }, [store]);

    if (
      !store.entityStore.entity ||
      store.entityStore.entity.type === 'group'
    ) {
      return store.loading ? <CenteredLoading /> : null;
    }

    return (
      <ActivityFullScreen
        entity={store.entityStore.entity}
        noBottomInset={props.route.params?.noBottomInset}
      />
    );
  }),
  'ActivityScreen',
);

export default ActivityScreen;

export const withModal = withModalProvider(ActivityScreen);
