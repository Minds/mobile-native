import React, { useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { StyleSheet } from 'react-native';
import { NotificationsStore } from './createNotificationsStore';

type PropsType = {
  store: NotificationsStore;
  setResult: Function;
  refresh: Function;
};

export type NotificationsTabOptions =
  | 'all'
  | 'tags'
  | 'comments'
  | 'subscriptions'
  | 'votes'
  | 'reminds';

const options: Array<ButtonTabType<NotificationsTabOptions>> = [
  { id: 'all', icon: { name: 'list', type: 'material' } },
  { id: 'tags', icon: { name: 'tags', type: 'material' } },
  { id: 'comments', icon: { name: 'chat-solid', type: 'material' } },
  { id: 'subscriptions', icon: { name: 'subscriptions', type: 'material' } },
  { id: 'votes', icon: { name: 'thumb-up', type: 'material' } },
  { id: 'reminds', icon: { name: 'remind', type: 'material' } },
];

const NotificationsTopBar = observer(
  ({ store, setResult, refresh }: PropsType) => {
    const localStore = useLocalStore(() => ({
      option: 'all' as NotificationsTabOptions,
      setOption(option: NotificationsTabOptions) {
        this.option = option;
        setResult(null);
        store.setOffset('');
        store.setFilter(option === 'all' ? '' : option);
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
        tabs={options}
        current={localStore.option}
        onChange={onChange}
        buttonCmp={'Touchable'}
        scrollViewContainerStyle={styles.scrollViewContainerStyle}
      />
    );
  },
);

const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 5,
    paddingLeft: 0,
  },
});

export default NotificationsTopBar;
