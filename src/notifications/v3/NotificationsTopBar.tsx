import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { StyleSheet } from 'react-native';
import { NotificationsStore } from './createNotificationsStore';
import { runInAction } from 'mobx';
import sp from '../../services/serviceProvider';

type PropsType = {
  store: NotificationsStore;
  refresh: Function;
};

export type NotificationsTabOptions =
  | 'all'
  | 'tags'
  | 'comments'
  | 'subscriptions'
  | 'votes'
  | 'reminds';

function getOptions() {
  const i18n = sp.i18n;
  const options: Array<ButtonTabType<NotificationsTabOptions>> = [
    {
      id: 'all',
      icon: {
        name: 'list',
        type: 'material',
        subtitle: i18n.t('notification.filters.all'),
      },
    },
    {
      id: 'tags',
      icon: {
        name: 'tags',
        type: 'material',
        subtitle: i18n.t('notification.filters.tags'),
      },
    },
    {
      id: 'comments',
      icon: {
        name: 'chat-solid',
        type: 'material',
        subtitle: i18n.t('notification.filters.comments'),
      },
    },
    {
      id: 'subscriptions',
      icon: {
        name: 'subscriptions',
        type: 'material',
        subtitle: i18n.t('notification.filters.subscriptions'),
      },
    },
    {
      id: 'votes',
      icon: {
        name: 'thumb-up',
        type: 'material',
        subtitle: i18n.t('notification.filters.votes'),
      },
    },
    {
      id: 'reminds',
      icon: {
        name: 'remind',
        type: 'material',
        subtitle: i18n.t('notification.filters.reminds'),
      },
    },
  ];
  return options;
}

const NotificationsTopBar = observer(({ store, refresh }: PropsType) => {
  const localStore = useLocalStore(() => ({
    option: 'all' as NotificationsTabOptions,
    setOption(option: NotificationsTabOptions) {
      this.option = option;
      runInAction(() => {
        store.setFilter(option === 'all' ? '' : option);
      });
    },
  }));

  const onChange = useCallback(
    id => {
      if (localStore.option === id) {
        refresh();
        return;
      }

      localStore.setOption(id);
    },
    [refresh, localStore],
  );

  return (
    <TopBarButtonTabBar
      tabs={getOptions()}
      current={localStore.option}
      onChange={onChange}
      buttonCmp={'Touchable'}
      scrollViewContainerStyle={styles.scrollViewContainerStyle}
    />
  );
});

const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 5,
    paddingLeft: 0,
  },
});

export default NotificationsTopBar;
