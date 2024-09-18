import { observer } from 'mobx-react';
import React from 'react';
import CenteredLoading from '~/common/components/CenteredLoading';
import DatePickerInput from '~/common/components/controls/DatePickerInput';
import MText from '~/common/components/MText';

import { WalletStoreType } from '../../../v2/createWalletStore';
import { TokensTabStore } from './createTokensTabStore';
import MindsScores from './MindsScores';
import Payout from './Payout';
import sp from '~/services/serviceProvider';

type PropsType = {
  walletStore: WalletStoreType;
  store: TokensTabStore;
};

const TokensRewards = observer(({ walletStore, store }: PropsType) => {
  const theme = sp.styles.style;

  const body =
    !store.rewards || !store.rewards.total ? (
      <MText style={[theme.fontXL, theme.centered, theme.padding5x]}>
        {sp.i18n.t('discovery.nothingToShow')}
      </MText>
    ) : (
      <>
        <Payout
          minds={store.rewards.total.daily}
          mindsPrice={walletStore.prices.minds}
          isToday={store.isToday}
          store={store}
        />
        <MindsScores store={store} prices={walletStore.prices} />
      </>
    );

  return (
    <>
      <DatePickerInput
        onConfirm={store.onConfirm}
        maximumDate={new Date()}
        date={store.rewardsSelectedDate}
      />
      {store.loading ? <CenteredLoading /> : body}
    </>
  );
});

export default TokensRewards;
