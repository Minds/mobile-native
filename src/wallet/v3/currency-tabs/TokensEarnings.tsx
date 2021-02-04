import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MonthPickerInput from '../../../common/components/MonthPickerInput';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../../v2/createWalletStore';
import moment from 'moment';
import EarningsOverview from './EarningsOverview';

type PropsType = {
  walletStore: WalletStoreType;
};

const createLocalStore = ({ walletStore }) => ({
  selectedDate: new Date(),
  loading: true,
  setLoading(loading) {
    this.loading = loading;
  },
  onConfirm(date: Date) {
    this.selectedDate = date;
  },
  async loadEarnings(date: Date) {
    this.setLoading(true);
    const from = moment(date).utc().startOf('month').unix();
    await walletStore.loadEarnings(
      from,
      moment.unix(from).utc().add(1, 'month').unix(),
    );
    this.setLoading(false);
  },
});

export type TokensEarningsStore = ReturnType<typeof createLocalStore>;

const TokensEarnings = observer(({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createLocalStore, { walletStore });

  return (
    <View style={theme.paddingTop5x}>
      <MonthPickerInput
        minimumDate={moment().subtract(6, 'months').toDate()}
        maximumDate={new Date()}
        containerStyle={[styles.container, theme.borderPrimary]}
        onConfirm={localStore.onConfirm}
      />
      <EarningsOverview localStore={localStore} walletStore={walletStore} />
    </View>
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

export default TokensEarnings;
