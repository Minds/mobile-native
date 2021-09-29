import React, { useEffect, useCallback } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SectionList, Text } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import ThemedStyles from '../../../styles/ThemedStyles';
import { PropsType } from './TransactionsListTypes';
import Item from './components/Item';
import createTokensTransactionsStore from './createTokensTransactionsStore';
import Empty from './components/Empty';
import Header from '../../v3/transaction-list/components/Header';
import MText from '../../../common/components/MText';

const TransactionsListTokens = observer(
  ({ navigation, currency, wallet }: PropsType) => {
    const { user } = useLegacyStores();
    const store = useLocalStore(createTokensTransactionsStore, {
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
        <MText style={[theme.colorSecondaryText, theme.marginBottom2x]}>
          {title.toUpperCase()}
        </MText>
      ),
      [theme],
    );

    useEffect(() => {
      store.initialLoad();
    }, [store, wallet, user]);

    return (
      <SectionList
        sections={store.list.slice()}
        keyExtractor={(item, index) => (item.timestamp + index).toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !store.ledger.list.loaded &&
          !store.ledger.list.refreshing &&
          store.ledger.loading ? (
            <CenteredLoading />
          ) : (
            <Empty />
          )
        }
        style={[
          theme.bgPrimaryBackground,
          theme.paddingLeft4x,
          theme.paddingRight4x,
        ]}
        refreshing={store.ledger.list.refreshing}
        onRefresh={store.refresh}
        onEndReached={store.loadMore}
      />
    );
  },
);

export default TransactionsListTokens;
