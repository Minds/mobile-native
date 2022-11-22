import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchNotificationsPage } from './api';
import { NotificationsTabOptions } from './NotificationsTopBar';

type PropsType = {
  tabs: Array<NotificationsTabOptions>;
};

export default function PrefetchNotifications({ tabs }: PropsType) {
  const client = useQueryClient();
  React.useEffect(() => {
    tabs.forEach(filter => {
      const param = filter === 'all' ? '' : filter;
      client.prefetchInfiniteQuery(['notifications', param], () =>
        fetchNotificationsPage('', param),
      );
    });
  }, [client, tabs]);
  return null;
}
