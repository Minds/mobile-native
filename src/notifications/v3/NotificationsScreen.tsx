import React, { useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { View, FlatList, ViewToken } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import NotificationsTopBar from './NotificationsTopBar';
import useApiFetch from '../../common/hooks/useApiFetch';
import i18n from '../../common/services/i18n.service';
import NotificationItem from './notification/Notification';
import { useStores } from '../../common/hooks/use-stores';
import ErrorBoundary from '../../common/components/ErrorBoundary';
import NotificationModel from './notification/NotificationModel';
import UserModel from '../../channel/UserModel';
import EmptyList from '../../common/components/EmptyList';
import NotificationPlaceHolder from './notification/NotificationPlaceHolder';
import MText from '../../common/components/MText';
import InteractionsBottomSheet from '~/common/components/interactions/InteractionsBottomSheet';
import sessionService from '~/common/services/session.service';
import Topbar from '~/topbar/Topbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropsType = {
  navigation?: any;
};

const viewabilityConfig = {
  itemVisiblePercentThreshold: 70,
  minimumViewTime: 500,
  waitForInteraction: false,
};

type NotificationList = {
  status: string;
  notifications: NotificationModel[];
  'load-next': string;
};

const map = data => {
  if (data) {
    return data.map((notification: NotificationModel) => {
      notification = NotificationModel.create(notification);
      if (notification.from) {
        notification.from = UserModel.create(notification.from);
      }
      if (notification.merged_from && notification.merged_from.length > 0) {
        notification.merged_from = UserModel.createMany(
          notification.merged_from,
        );
      }
      return notification;
    });
  }
  return [];
};

const NotificationsScreen = observer(({ navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();
  const interactionsBottomSheetRef = useRef<any>();

  const store = useApiFetch<NotificationList>('api/v3/notifications/list', {
    params: {
      filter: notifications.filter,
      limit: 15,
      offset: notifications.offset,
    },
    updateStrategy: 'merge',
    dataField: 'notifications',
    map,
  });

  const insets = useSafeAreaInsets();
  const cleanTop = React.useRef({
    marginTop: insets && insets.top ? insets.top - 5 : 0,
    flexGrow: 1,
  }).current;

  const onFetchMore = () => {
    !store.loading &&
      store.result &&
      store.result['load-next'] &&
      notifications.setOffset(store.result['load-next']);
  };

  const refresh = React.useCallback(() => {
    notifications.setOffset('');
    return store.refresh({
      filter: notifications.filter,
      limit: 15,
      offset: notifications.offset,
    });
  }, [notifications, store]);

  /**
   *
   */
  const onFocus = React.useCallback(
    (silentRefresh = true) => {
      // only refresh if the data is already loaded (even empty array)
      if (store.result === undefined) {
        return;
      }
      // only refresh if we already have notifications
      notifications.setSilentRefresh(silentRefresh);
      refresh().finally(() => notifications.setSilentRefresh(false));
    },
    // Be extra careful with the dependencies here, it may cause too many refresh or an infinite loop
    [notifications, refresh, store],
  );

  // const isFocused = navigation.isFocused();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      //@ts-ignore
      'tabPress',
      () => navigation.isFocused() && onFocus(false),
    );
    return unsubscribe;
  }, [navigation, onFocus]);

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
    if (store.error && !store.loading && !store.refreshing) {
      return (
        <View style={styles.errorContainerStyle}>
          <MText style={styles.errorStyle} onPress={refresh}>
            {i18n.t('cantReachServer') + '\n'}
            <MText style={styles.errorText}>{i18n.t('tryAgain')}</MText>
          </MText>
        </View>
      );
    }

    if (store.loading || store.refreshing) {
      return (
        <View>
          <NotificationPlaceHolder />
          <NotificationPlaceHolder />
          <NotificationPlaceHolder />
          <NotificationPlaceHolder />
          <NotificationPlaceHolder />
          <NotificationPlaceHolder />
        </View>
      );
    }
    return (
      <View style={styles.errorContainerStyle}>
        <EmptyList
          text={i18n.t(`notification.empty.${notifications.filter || 'all'}`)}
        />
      </View>
    );
  }, [
    store.error,
    store.loading,
    store.refreshing,
    notifications.filter,
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
          onShowSubscribers={() => {
            interactionsBottomSheetRef.current?.show('subscribers');
          }}
        />
      </ErrorBoundary>
    );
  }, []);

  const data = store.result?.notifications || [];

  return (
    <View style={styles.container}>
      <FlatList
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        style={[theme.flexContainer, cleanTop]}
        ListHeaderComponent={
          <View>
            <Topbar title="Notifications" navigation={navigation} noInsets />
            <NotificationsTopBar
              store={notifications}
              setResult={store.setResult}
              refresh={refresh}
            />
          </View>
        }
        scrollEnabled={!store.refreshing}
        data={data.slice()}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onFetchMore}
        onRefresh={refresh}
        refreshing={store.refreshing && !notifications.silentRefresh}
        onViewableItemsChanged={onViewableItemsChanged}
        // contentContainerStyle={}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={ListEmptyComponent}
      />
      <InteractionsBottomSheet
        entity={user}
        ref={interactionsBottomSheetRef}
        withoutInsets
        snapPoints={snapPoints}
        keepOpen={false}
      />
    </View>
  );
});

const snapPoints = ['90%'];

const keyExtractor = (item: NotificationModel, index) =>
  item ? `${item.urn}-${index}` : 'menu';

export default NotificationsScreen;

const styles = ThemedStyles.create({
  containerStyle: { flexGrow: 1 },
  container: ['bgPrimaryBackground', 'flexContainer'],
  errorContainerStyle: ['marginVertical8x', { flexGrow: 1 }],
  errorStyle: ['colorSecondaryText', 'textCenter', 'fontXL'],
  errorText: ['colorLink', 'marginTop2x'],
});
