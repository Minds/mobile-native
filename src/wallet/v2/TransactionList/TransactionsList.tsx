import React, { useEffect, useCallback } from 'react';
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
  ({ navigation, currency, wallet }: propsType) => {
    const { user } = useLegacyStores();
    const store = useLocalStore(createTransactionsListStore, { wallet, user });
    const theme = ThemedStyles.style;

    const renderItem = useCallback(
      ({ item }) => (
        <Item entity={item} navigation={navigation} currency={currency} />
      ),
      [navigation, currency],
    );

    const renderHeader = useCallback(() => {
      const alignedCenterRow = [theme.rowJustifyStart, theme.alignCenter];
      return (
        <View style={theme.marginBottom3x}>
          <View style={[theme.rowJustifySpaceBetween, theme.alignCenter]}>
            <Text style={theme.colorSecondaryText}>PENDING</Text>
            <TouchableOpacity onPress={() => true}>
              <View style={alignedCenterRow}>
                <MIcon
                  name={'filter-variant'}
                  color={ThemedStyles.getColor('icon')}
                  size={28}
                />
                <Text style={theme.colorSecondaryText}>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={alignedCenterRow}>
            <AvatarIcon name="trending-up" />
            <Text style={theme.colorPrimaryText}>Today’s daily reward</Text>
          </View>
        </View>
      );
    }, [theme]);

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
        onRefresh={store.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={store.loadMore}
      />
    );
  },
);

export default TransactionsList;
