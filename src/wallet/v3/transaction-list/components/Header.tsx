import React from 'react';
import { View, Text } from 'react-native';
import Filter from './Filter';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';
import { TokensTransactionsListStoreType } from '../../../v2/TransactionList/createTokensTransactionsStore';
import { AvatarIcon } from '../../../v2/TransactionList/components/Icons';
import { CashTransactionsListStoreType } from '../../../v2/TransactionList/createCashTransactionsStore';

type PropsType = {
  store: TokensTransactionsListStoreType | CashTransactionsListStoreType;
};

const Header = ({ store }: PropsType) => {
  const theme = ThemedStyles.style;
  const alignedCenterRow = [theme.rowJustifyStart, theme.alignCenter];

  const renderFilter = store.setTransactionType !== undefined;

  return (
    <View style={theme.marginBottom3x}>
      <View style={[theme.rowJustifySpaceBetween, theme.alignCenter]}>
        <Text style={theme.colorSecondaryText}>
          {i18n.t('wallet.transactions.pending')}
        </Text>
        {renderFilter && (
          <View style={alignedCenterRow}>
            <Filter store={store} />
          </View>
        )}
      </View>
      <View style={alignedCenterRow}>
        <AvatarIcon name="trending-up" />
        <Text style={theme.colorPrimaryText}>
          {i18n.t('wallet.transactions.reward')}
        </Text>
      </View>
    </View>
  );
};

export default Header;
