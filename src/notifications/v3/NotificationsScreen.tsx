import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View, Text, FlatList } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import NotificationsTopBar from './NotificationsTopBar';
import { useFocusEffect } from '@react-navigation/native';
import createNotificationsStore from './createNotificationsStore';
import useApiFetch from '../../common/hooks/useApiFetch';
import { Notification } from '../../types/Common';
import i18n from '../../common/services/i18n.service';
import NotificationItem from './notification/Notification';

type PropsType = {};

const NotificationsScreen = observer(({}: PropsType) => {
  const theme = ThemedStyles.style;
  const store = useLocalStore(createNotificationsStore);

  const { result, error, loading, fetch, setResult } = useApiFetch<{
    notifications: Notification[];
  }>('api/v3/notifications/list', {
    params: {
      filter: store.filter,
      limit: 15,
      offset: store.offset,
    },
    persist: true,
  });

  const onFetchMore = () => {
    !loading &&
      result &&
      result['load-next'] &&
      store.setOffset(result['load-next']);
  };

  const refresh = () => {
    store.setOffset('');
    setResult(null);
    fetch();
  };

  useFocusEffect(
    useCallback(() => {
      if (store.unread > 0) {
        //store.refresh();
        store.setUnread(0);
      }
    }, [store]),
  );

  const renderItem = useCallback((row: any): React.ReactElement => {
    const notification = row.item;

    return <NotificationItem notification={notification} />;
  }, []);

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
        ListHeaderComponent={<NotificationsTopBar store={store} />}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onFetchMore}
        onRefresh={refresh}
        refreshing={loading}
      />
    </View>
  );
});

const keyExtractor = item => item.guid;

export default NotificationsScreen;
