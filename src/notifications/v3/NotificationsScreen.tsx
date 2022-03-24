import React, { useCallback, useRef, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

type PropsType = {
  navigation?: any;
};

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
  const [isRefreshing, setRefreshing] = useState(false);
  const theme = ThemedStyles.style;
  const { notifications } = useStores();
  const interactionsBottomSheetRef = useRef<any>();
  const filter = notifications.filter;
  const {
    result,
    refresh: realRefresh,
    error,
    loading,
    setResult,
  } = useApiFetch<NotificationList>('api/v3/notifications/list', {
    params: {
      filter,
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
    !loading &&
      result &&
      result['load-next'] &&
      notifications.setOffset(result['load-next']);
  };

  const refresh = React.useCallback(() => {
    notifications.setOffset('');
    realRefresh();
  }, [notifications, realRefresh]);

  const handleListRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh();
  }, [refresh, setRefreshing]);

  const notificationsLength = result?.notifications.length || 0;

  const onFocus = React.useCallback(
    (showIndicator = false) => {
      notifications.setUnread(0);
      // only refresh if we already have notifications
      if (notificationsLength) {
        if (showIndicator) {
          handleListRefresh();
        } else {
          refresh();
        }
      }
    },
    [handleListRefresh, notifications, notificationsLength, refresh],
  );

  // const isFocused = navigation.isFocused();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      //@ts-ignore
      'tabPress',
      () => navigation.isFocused() && onFocus(true),
    );

    return unsubscribe;
  }, [navigation, onFocus]);

  React.useEffect(() => {
    if (!notifications.loaded) {
      notifications.setLoaded(true);
      onFocus();
    }
  }, [notifications, onFocus]);

  useFocusEffect(onFocus);

  React.useEffect(() => {
    if (!loading && isRefreshing) {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
    if (error && !loading && !isRefreshing) {
      return (
        <View style={styles.errorContainerStyle}>
          <MText style={styles.errorStyle} onPress={handleListRefresh}>
            {i18n.t('cantReachServer') + '\n'}
            <MText style={styles.errorText}>{i18n.t('tryAgain')}</MText>
          </MText>
        </View>
      );
    }

    if (loading || isRefreshing) {
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
        <EmptyList text={i18n.t(`notification.empty.${filter || 'all'}`)} />
      </View>
    );
  }, [error, loading, handleListRefresh, isRefreshing, filter]);

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

  const data = result?.notifications || [];

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
              setResult={setResult}
              refresh={refresh}
            />
          </View>
        }
        data={data.slice()}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onFetchMore}
        onRefresh={handleListRefresh}
        refreshing={isRefreshing}
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
