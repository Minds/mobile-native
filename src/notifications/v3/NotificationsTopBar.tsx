import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { StyleSheet } from 'react-native';
import { NotificationsStore } from './createNotificationsStore';

type PropsType = {
  store: NotificationsStore;
  setResult: Function;
};

type NotificationsTabOptions = 'All' | 'Mentions';

const options: Array<ButtonTabType<NotificationsTabOptions>> = [
  { id: 'All', title: 'All' },
  { id: 'Mentions', title: 'Mentions' },
];

const NotificationsTopBar = observer(({ store, setResult }: PropsType) => {
  const localStore = useLocalStore(() => ({
    option: 'All' as NotificationsTabOptions,
    setOption(option: NotificationsTabOptions) {
      this.option = option;
      setResult(null);
      store.setFilter(option === 'All' ? '' : 'tags');
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
