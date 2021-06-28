import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SectionList, Text } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import ThemedStyles from '../../../styles/ThemedStyles';
import { PropsType } from './TransactionsListTypes';
import Item from './components/Item';
import createCashTransactionsStore from './createCashTransactionsStore';
import Empty from './components/Empty';
import Header from '../../v3/transaction-list/components/Header';

const TransactionsListCash = observer(
  ({ navigation, currency, wallet }: PropsType) => {
    const { user } = useLegacyStores();
    const store = useLocalStore(createCashTransactionsStore, {
      wallet,
      user,
    });
    const theme = ThemedStyles.style;

    const renderItem = useCallback(
      ({ item }) => (
        <Item entity={item} navigation={navigation} currency={currency} />
      ),
      [navigation, currency],
    );

    const renderHeader = useCallback(() => <Header store={store} />, [store]);

    const renderSectionHeader = useCallback(
      ({ section: { title } }) => (
        <Text style={[theme.colorSecondaryText, theme.marginBottom2x]}>
          {title.toUpperCase()}
        </Text>
      ),
      [theme],
    );

    useEffect(() => {
      store.load();
    }, [store]);

    return (
      <SectionList
        sections={store.list.slice()}
        keyExtractor={(item, index) => (item.timestamp + index).toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !store.refreshing && store.loading ? <CenteredLoading /> : <Empty />
        }
        style={[
          theme.bgPrimaryBackground,
          theme.paddingLeft4x,
          theme.paddingRight4x,
        ]}
        refreshing={store.refreshing}
        onRefresh={store.refresh}
      />
    );
  },
);

export default TransactionsListCash;
