import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import MonthPickerInput from '../../../common/components/MonthPickerInput';
import ThemedStyles from '../../../styles/ThemedStyles';
import {
  EarningsCurrencyType,
  WalletStoreType,
} from '../../v2/createWalletStore';
import moment from 'moment';
import EarningsOverview from './EarningsOverview';
import { TokensTabStore } from './tokens/createTokensTabStore';

type PropsType = {
  walletStore: WalletStoreType;
  currencyType: EarningsCurrencyType;
  store: TokensTabStore;
};

const Earnings = observer(({ walletStore, currencyType, store }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <>
      <MonthPickerInput
        minimumDate={new Date(moment().subtract(6, 'months').toDate())}
        maximumDate={new Date()}
        containerStyle={[styles.container, theme.bcolorPrimaryBorder]}
        onConfirm={store.monthPickerOnConfirm}
      />
      <EarningsOverview
        localStore={store}
        walletStore={walletStore}
        currencyType={currencyType}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default Earnings;
