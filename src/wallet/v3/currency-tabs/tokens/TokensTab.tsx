import React from 'react';
import { observer } from 'mobx-react';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { TokensOptions } from '../../../v2/WalletTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import TokensOverview from '../../../v2/currency-tabs/TokensOverview';
import TransactionsListTokens from '../../../v2/TransactionList/TransactionsListTokens';
import ReceiverSettings from '../../../v2/address/ReceiverSettings';
import { WalletScreenNavigationProp } from '../../WalletScreen';
import TokensRewards from './TokensRewards';
import TokensEarnings from '../Earnings';
import TokenTopBar from './TokenTopBar';
import useUniqueOnchain from '../../useUniqueOnchain';
import { TokensTabStore } from './createTokensTabStore';
import i18n from '../../../../common/services/i18n.service';
import { Screen, Column } from '~ui';
import TransactionsListWithdrawals from './widthdrawal/TransactionsListWithdrawals';
import { showNotification } from 'AppMessages';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
  store: TokensTabStore;
};

/**
 * Tokens tab
 */
const TokensTab = observer(({ walletStore, navigation, store }: PropsType) => {
  const theme = ThemedStyles.style;
  const onchainStore = useUniqueOnchain();

  const options: Array<ButtonTabType<TokensOptions>> = [
    { id: 'rewards', title: i18n.t('wallet.rewards', { count: 2 }) },
    { id: 'earnings', title: i18n.t('wallet.usd.earnings') },
    { id: 'balance', title: i18n.t('blockchain.balance') },
    { id: 'transactions', title: i18n.t('wallet.transactions.transactions') },
    {
      id: 'onchain_transfers',
      title: i18n.t('wallet.withdraw.onchain_transfers'),
    },
    { id: 'settings', title: i18n.t('moreScreen.settings') },
  ];

  let body;
  switch (store.option) {
    case 'rewards':
      body = <TokensRewards walletStore={walletStore} store={store} />;
      break;
    case 'earnings':
      body = (
        <TokensEarnings
          walletStore={walletStore}
          currencyType="tokens"
          store={store}
        />
      );
      break;
    case 'balance':
      body = (
        <TokensOverview walletStore={walletStore} navigation={navigation} />
      );
      break;
    case 'transactions':
      body = (
        <TransactionsListTokens
          navigation={navigation}
          currency="tokens"
          wallet={walletStore}
        />
      );
      break;
    case 'onchain_transfers':
      body = <TransactionsListWithdrawals />;
      break;
    case 'settings':
      body = (
        <ReceiverSettings
          navigation={navigation}
          connectWallet={showMessage}
          onchainStore={onchainStore}
          walletStore={walletStore}
        />
      );
      break;
  }

  const isScollable =
    store.option === 'transactions' || store.option === 'onchain_transfers';

  return (
    <Screen scroll={!isScollable}>
      <Column top="XL" flex>
        <TokenTopBar
          walletStore={walletStore}
          connectWallet={showMessage}
          onchainStore={onchainStore}
        />
        <TopBarButtonTabBar
          tabs={options}
          current={store.option}
          onChange={store.setOption}
          scrollViewContainerStyle={theme.paddingRight2x}
        />
        {isScollable ? body : <Column bottom="XXL">{body}</Column>}
      </Column>
    </Screen>
  );
});

// This message should not be shown since the functionality is disabled, it is kept just in case
const showMessage = () =>
  showNotification('Please connect your wallet on the web');

export default TokensTab;
