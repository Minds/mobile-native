import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, FlatList, ViewToken } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import NotificationsTopBar from './NotificationsTopBar';
import { useFocusEffect } from '@react-navigation/native';
import useApiFetch from '../../common/hooks/useApiFetch';
import i18n from '../../common/services/i18n.service';
import NotificationItem from './notification/Notification';
import { useStores } from '../../common/hooks/use-stores';
import ErrorBoundary from '../../common/components/ErrorBoundary';
import NotificationModel from './notification/NotificationModel';
import UserModel from '../../channel/UserModel';
import EmptyList from '../../common/components/EmptyList';

type PropsType = {};

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 300,
  waitForInteraction: false,
};

type NotificationList = {
  status: string;
  notifications: NotificationModel[];
  'load-next': string;
};

const updateState = (newData: NotificationList, oldData: NotificationList) => {
  if (newData && newData.notifications) {
    newData.notifications = newData.notifications.map(
      (notification: NotificationModel) => {
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
      },
    );
    return {
      ...newData,
      notifications: [
        ...(oldData ? oldData.notifications : []),
        ...newData.notifications,
      ],
    } as NotificationList;
  }
};

const Empty = <EmptyList />;

const NotificationsScreen = observer(({}: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();

  const {
    result,
    error,
    loading,
    fetch,
    setResult,
  } = useApiFetch<NotificationList>('api/v3/notifications/list', {
    params: {
      filter: notifications.filter,
      limit: 15,
      offset: notifications.offset,
    },
    updateState,
    persist: true,
  });

  const onFetchMore = () => {
    !loading &&
      result &&
      result['load-next'] &&
      notifications.setOffset(result['load-next']);
  };

  const refresh = React.useCallback(() => {
    notifications.setOffset('');
    setResult(null);
    fetch();
  }, [fetch, setResult, notifications]);

  useFocusEffect(
    React.useCallback(() => {
      notifications.setUnread(0);
      refresh();
    }, [notifications, refresh]),
  );

  const headerComponent = React.useMemo(
    () => <NotificationsTopBar store={notifications} setResult={setResult} />,
    [notifications, setResult],
  );

  const onViewableItemsChanged = React.useCallback(
    (viewableItems: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      viewableItems.viewableItems.forEach(
        (item: { item: NotificationModel }) => {
          if (!item.item.read) {
            item.item.read = true;
            notifications.markAsRead(item.item);
          }
        },
      );
    },
    [notifications],
  );

  const ListEmptyComponent = React.useMemo(() => {
    if (loading) {
      return null;
    } else {
      return Empty;
    }
  }, [loading]);

  if (error && !loading) {
    return (
      <Text
        style={[
          theme.colorSecondaryText,
          theme.textCenter,
          theme.fontL,
          theme.marginVertical4x,
        ]}
        onPress={() => fetch()}>
        {i18n.t('error') + '\n'}
        <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
      </Text>
    );
  }

  const data = result?.notifications || [];

  return (
    <View style={theme.flexContainer}>
      <FlatList
        data={data.slice()}
        ListHeaderComponent={headerComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onFetchMore}
        onRefresh={refresh}
        refreshing={loading}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
});

const keyExtractor = (item: NotificationModel, index) => `${item.urn}-${index}`;

const renderItem = (row: any): React.ReactElement => {
  const notification = row.item;

  return (
    <ErrorBoundary
      message="Can't show this notification"
      containerStyle={ThemedStyles.style.borderBottomHair}>
      <NotificationItem notification={notification} />
    </ErrorBoundary>
  );
};

export default NotificationsScreen;
