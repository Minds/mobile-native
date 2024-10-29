import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SectionList } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { useLegacyStores } from '../../../common/hooks/use-stores';

import { PropsType } from './TransactionsListTypes';
import Item from './components/Item';
import createCashTransactionsStore from './createCashTransactionsStore';
import Empty from './components/Empty';
import Header from '../../v3/transaction-list/components/Header';
import { B3 } from '~ui';
import sp from '~/services/serviceProvider';

const TransactionsListCash = observer(
  ({ navigation, currency, wallet }: PropsType) => {
    const { user } = useLegacyStores();
    const store = useLocalStore(createCashTransactionsStore, {
      wallet,
      user,
    });
    const theme = sp.styles.style;

    const renderItem = useCallback(
      ({ item }) => (
        <Item entity={item} navigation={navigation} currency={currency} />
      ),
      [navigation, currency],
    );

    const renderHeader = useCallback(() => <Header />, []);

    const renderSectionHeader = ({ section: { title } }) => (
      <B3 font="medium" bottom="S" color="secondary">
        {title}
      </B3>
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
          theme.paddingTop4x,
        ]}
        contentContainerStyle={theme.paddingBottom12x}
        refreshing={store.refreshing}
        onRefresh={store.refresh}
        stickySectionHeadersEnabled={false}
      />
    );
  },
);

export default TransactionsListCash;
