import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { StyleSheet } from 'react-native';
import { NotificationsStore } from './createNotificationsStore';
import ThemedStyles from '../../styles/ThemedStyles';
import { Icon } from 'react-native-elements';

type PropsType = {
  store: NotificationsStore;
  setResult: Function;
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
  { id: 'tags', icon: { name: 'local-offer', type: 'material' } },
  { id: 'comments', icon: { name: 'chat-bubble', type: 'material' } },
  { id: 'subscriptions', icon: { name: 'people', type: 'material' } },
  { id: 'votes', icon: { name: 'thumb-up', type: 'material' } },
  { id: 'reminds', icon: { name: 'repeat', type: 'material' } },
];

const NotificationsTopBar = observer(({ store, setResult }: PropsType) => {
  const localStore = useLocalStore(() => ({
    option: 'all' as NotificationsTabOptions,
    setOption(option: NotificationsTabOptions) {
      this.option = option;
      setResult(null);
      store.setOffset('');
      store.setFilter(option === 'all' ? '' : option);
    },
  }));

  return (
    <TopBarButtonTabBar
      tabs={options}
      current={localStore.option}
      onChange={localStore.setOption}
      buttonCmp={'Touchable'}
      scrollViewContainerStyle={styles.scrollViewContainerStyle}
    />
  );
});

const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    flex: 1,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

export default NotificationsTopBar;
