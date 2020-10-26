import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SectionList, Text } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { PropsType } from './TransactionsListTypes';
import Item from './components/Item';

import Filter from './components/Filter';
import Header from './components/Header';
import createCashTransactionsStore from './createCashTransactionsStore';
import Empty from './components/Empty';

const TransactionsListCash = observer(
  ({ navigation, currency, wallet, bottomStore, filters }: PropsType) => {
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

    const showFilter = useCallback(() => {
      bottomStore.show(
        i18n.t('wallet.transactions.filterTransactions'),
        'Done',
        <Filter store={store} filters={filters} bottomStore={bottomStore} />,
      );
    }, [store, bottomStore, filters]);

    const renderHeader = useCallback(() => <Header showFilter={showFilter} />, [
      showFilter,
    ]);

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
          theme.backgroundPrimary,
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
