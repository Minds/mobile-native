import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { View, FlatList, ViewToken, Platform } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import NotificationsTopBar, {
  NotificationsTabOptions,
} from './NotificationsTopBar';
import i18n from '../../common/services/i18n.service';
import NotificationItem from './notification/Notification';
import { useStores } from '../../common/hooks/use-stores';
import ErrorBoundary from '../../common/components/ErrorBoundary';
import NotificationModel from './notification/NotificationModel';
import EmptyList from '../../common/components/EmptyList';
import MText from '../../common/components/MText';
import { pushInteractionsScreen } from '../../common/components/interactions/pushInteractionsBottomSheet';
import sessionService from '~/common/services/session.service';
import Topbar from '~/topbar/Topbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActivityIndicator from '~/common/components/ActivityIndicator';

import { useInfiniteFeedQuery } from '~/services';
import { fetchNotificationsPage } from './api';
import PrefetchNotifications from './PrefetchNotifications';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { IS_IPAD } from '~/config/Config';
import CaptureFab from '~/capture/CaptureFab';

type PropsType = {
  navigation?: any;
};

const viewabilityConfig = {
  itemVisiblePercentThreshold: 70,
  minimumViewTime: 500,
  waitForInteraction: false,
};

const NotificationsScreen = observer(({ navigation }: PropsType) => {
  const { notifications } = useStores();
  const listRef = useRef<FlatList>(null);

  const [query, notificationsList] = useInfiniteFeedQuery(
    ['notifications', notifications.filter],
    async ({ pageParam = '' }) =>
      fetchNotificationsPage(pageParam, notifications.filter),
    { refetchOnMount: 'always' }, // update notifications on mount (since they are prefetched)
  );

  console.log('notificationsList', notificationsList.length);

  const insets = useSafeAreaInsets();
  const cleanTop = React.useRef({
    marginTop: insets && insets.top ? insets.top - 5 : 0,
    flexGrow: 1,
    flex: 1,
  }).current;

  const refresh = React.useCallback(
    (scroll = true) => {
      // scroll to top animated
      if (scroll) {
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }
      return query.refetch().then(() => {
        notifications.setUnread(0);
      });
    },
    [notifications, query],
  );

  React.useEffect(() => {
    const onPress = () => navigation.isFocused() && refresh();
    const parent = navigation.getParent();
    const unsubscribeTab = parent.addListener('tabPress', onPress);
    const unsubscribeDrawer = parent.addListener('drawerItemPress', onPress);
    notifications.setUnread(0);
    return () => {
      unsubscribeTab();
      unsubscribeDrawer();
    };
  }, [navigation, query, refresh]);

  const onViewableItemsChanged = React.useCallback(
    (viewableItems: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      viewableItems.viewableItems.forEach(
        (item: { item: NotificationModel }) => {
          if (!item.item.read) {
            notifications.markAsRead(item.item);
          }
        },
      );
    },
    [notifications],
  );

  const ListEmptyComponent = React.useMemo(() => {
    if (query.error && !query.isLoading && !query.isRefetching) {
      return (
        <View style={styles.errorContainerStyle}>
          <MText style={styles.errorStyle} onPress={() => refresh()}>
            {i18n.t('cantReachServer') + '\n'}
            <MText style={styles.errorText}>{i18n.t('tryAgain')}</MText>
          </MText>
        </View>
      );
    }

    if (query.isLoading || query.isRefetching) {
      return <ActivityIndicator style={styles.spinner} />;
    }
    return (
      <View style={styles.errorContainerStyle}>
        <EmptyList
          text={i18n.t(`notification.empty.${notifications.filter || 'all'}`)}
        />
      </View>
    );
  }, [
    notifications.filter,
    query.error,
    query.isLoading,
    query.isRefetching,
    refresh,
  ]);

  const user = sessionService.getUser();

  const renderItem = useCallback((row: any): React.ReactElement => {
    const notification = row.item;

    return (
      <ErrorBoundary
        message="Can't show this notification"
        containerStyle={ThemedStyles.style.borderBottomHair}>
        <NotificationItem
          notification={notification}
          onShowSubscribers={() =>
            pushInteractionsScreen({
              entity: user,
              interaction: 'subscribers',
            })
          }
        />
      </ErrorBoundary>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <PrefetchNotifications tabs={prefetch} />
      <FlatList
        ref={listRef}
        stickyHeaderIndices={sticky}
        stickyHeaderHiddenOnScroll={true}
        style={cleanTop}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.centerMaxWidth}>
            <Topbar title="Notifications" navigation={navigation} noInsets />
            <NotificationsTopBar store={notifications} refresh={refresh} />
          </View>
        }
        scrollEnabled={!query.isRefetching}
        data={notificationsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => query.fetchNextPage()}
        onRefresh={refresh}
        refreshing={query.isRefetching && query.isFetchedAfterMount}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={
          Platform.OS === 'android' && styles.paddedContainer
        }
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={ListEmptyComponent}
      />
      {!IS_IPAD && <CaptureFab navigation={navigation} />}
    </View>
  );
});

const prefetch: NotificationsTabOptions[] = [
  'comments',
  'reminds',
  'subscriptions',
  'tags',
  'votes',
];

const sticky = [0];
const keyExtractor = (item: NotificationModel, index) =>
  item ? `${item.urn}-${index}` : 'menu';

export default withErrorBoundaryScreen(
  NotificationsScreen,
  'NotificationsScreen',
);

const styles = ThemedStyles.create({
  containerStyle: { flexGrow: 1 },
  container: ['bgPrimaryBackground', 'flexContainer'],
  centerMaxWidth: ['alignSelfCenterMaxWidth'],
  errorContainerStyle: ['marginVertical8x', { flexGrow: 1 }],
  errorStyle: ['colorSecondaryText', 'textCenter', 'fontXL'],
  errorText: ['colorLink', 'marginTop2x'],
  spinner: ['marginTop12x'],
  paddedContainer: ['paddingBottom4x'],
});
