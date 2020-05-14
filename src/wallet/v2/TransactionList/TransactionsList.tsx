import React, { useEffect, useCallback, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { propsType } from './types';
import createTransactionsListStore from './Store';
import Item from './components/Item';
import { AvatarIcon } from './components/Icons';
import Filter from './components/Filter';

const Empty = () => (
  <View style={ThemedStyles.style.emptyComponentContainer}>
    <View style={ThemedStyles.style.emptyComponent}>
      <Text style={ThemedStyles.style.emptyComponentMessage}>
        {i18n.t('wallet.transactionsEmpty')}
      </Text>
    </View>
  </View>
);

const TransactionsList = observer(
  ({ navigation, currency, wallet, bottomStore }: propsType) => {
    const { user } = useLegacyStores();
    const store = useLocalStore(createTransactionsListStore, { wallet, user });
    const theme = ThemedStyles.style;
    const filterRef = useRef<Filter>(null);

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
        <Filter store={store} ref={filterRef} bottomStore={bottomStore} />,
      );
    }, [store, bottomStore]);

    const renderHeader = useCallback(() => {
      const alignedCenterRow = [theme.rowJustifyStart, theme.alignCenter];
      return (
        <View style={theme.marginBottom3x}>
          <View style={[theme.rowJustifySpaceBetween, theme.alignCenter]}>
            <Text style={theme.colorSecondaryText}>
              {i18n.t('wallet.transactions.pending')}
            </Text>
            <TouchableOpacity onPress={() => true}>
              <View style={alignedCenterRow}>
                <TouchableOpacity onPress={showFilter}>
                  <MIcon
                    name={'filter-variant'}
                    color={ThemedStyles.getColor('icon')}
                    size={28}
                  />
                  <Text style={theme.colorSecondaryText}>
                    {i18n.t('wallet.transactions.filter')}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
          <View style={alignedCenterRow}>
            <AvatarIcon name="trending-up" />
            <Text style={theme.colorPrimaryText}>
              {i18n.t('wallet.transactions.reward')}
            </Text>
          </View>
        </View>
      );
    }, [theme, showFilter]);

    const renderSectionHeader = useCallback(
      ({ section: { title } }) => (
        <Text style={[theme.colorSecondaryText, theme.marginBottom2x]}>
          {title.toUpperCase()}
        </Text>
      ),
      [theme],
    );

    useEffect(() => {
      if (!store.loaded) {
        store.initialLoad();
      }
    }, [store, wallet, user]);

    return (
      <SectionList
        sections={store.list.slice()}
        keyExtractor={(item, index) => (item.timestamp + index).toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !wallet.ledger.list.loaded &&
          !wallet.ledger.list.refreshing &&
          store.loading ? (
            <CenteredLoading />
          ) : (
            <Empty />
          )
        }
        style={[
          theme.backgroundPrimary,
          theme.paddingLeft4x,
          theme.paddingRight4x,
        ]}
        refreshing={wallet.ledger.list.refreshing}
        onRefresh={store.refresh}
        onEndReached={store.loadMore}
      />
    );
  },
);

export default TransactionsList;
