import { observer } from 'mobx-react';
import React from 'react';
import { Text, View } from 'react-native';
import CenteredLoading from '../../../../common/components/CenteredLoading';
import DatePicker from '../../../../common/components/DatePicker';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../v2/createWalletStore';
import { TokensTabStore } from './createTokensTabStore';
import MindsScores from './MindsScores';
import Payout from './Payout';

type PropsType = {
  walletStore: WalletStoreType;
  store: TokensTabStore;
};

const TokensRewards = observer(({ walletStore, store }: PropsType) => {
  const theme = ThemedStyles.style;

  if (store.loading) {
    return <CenteredLoading />;
  }

  if (!store.rewards || !store.rewards.total) {
    return (
      <Text style={[theme.fontXL, theme.centered, theme.padding5x]}>
        {i18n.t('discovery.nothingToShow')}
      </Text>
    );
  }

  return (
    <View style={theme.paddingTop5x}>
      <DatePicker
        onConfirm={store.onConfirm}
        maximumDate={new Date()}
        date={store.rewardsSelectedDate}
        containerStyle={theme.paddingRight6x}
      />
      <Payout
        minds={store.rewards.total.daily}
        mindsPrice={walletStore.prices.minds}
        isToday={store.isToday}
        store={store}
      />
      <MindsScores store={store} prices={walletStore.prices} />
    </View>
  );
});

export default TokensRewards;
