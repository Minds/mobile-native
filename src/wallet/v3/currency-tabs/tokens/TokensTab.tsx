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
import useWalletConnect from '../../../../blockchain/v2/walletconnect/useWalletConnect';
import sessionService from '../../../../common/services/session.service';
import apiService from '../../../../common/services/api.service';
import { showNotification } from '../../../../../AppMessages';
import { TokensTabStore } from './createTokensTabStore';
import i18n from '../../../../common/services/i18n.service';
import { Screen, Column } from '~ui';
import TransactionsListWithdrawals from './widthdrawal/TransactionsListWithdrawals';
import { ONCHAIN_ENABLED } from '~/config/Config';
import UserModel from '~/channel/UserModel';
import useModelEvent from '~/common/hooks/useModelEvent';
import { useIsFeatureOn } from 'ExperimentsProvider';

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
  const wc = useWalletConnect();

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

  const connectWallet = React.useCallback(async () => {
    if (!ONCHAIN_ENABLED) {
      return;
    }
    const user = sessionService.getUser();

    const msg = JSON.stringify({
      user_guid: user.guid,
      unix_ts: Date.now() / 1000,
    });

    await wc.connect();

    if (!wc.connected || !wc.web3 || !wc.provider) {
      throw new Error(i18n.t('wallet.connectFirst'));
    }

    try {
      onchainStore.setLoading(true);

      showNotification(i18n.t('wallet.completeStep'), 'info', 0);
      wc.openWalletApp();

      const signature = await wc.provider.connector.signPersonalMessage([
        msg,
        wc.address,
      ]);

      onchainStore.setLoading(true);

      try {
        // Returns signature.
        await apiService.post('api/v3/blockchain/unique-onchain/validate', {
          signature,
          payload: msg,
          address: wc.address,
        });

        setTimeout(() => {
          // reload wallet
          walletStore?.loadWallet();
          // reload unique onchain
          onchainStore?.fetch();
        }, 1000);

        showNotification(i18n.t('wallet.verified'));
      } catch (error) {
        throw 'Request Failed ' + error;
      }
    } catch (err) {
      console.error('There was an error', err);
      if (err instanceof Error) {
        showNotification(err.toString(), 'danger');
      }
    } finally {
      onchainStore.setLoading(false);
    }
  }, [onchainStore, walletStore, wc]);

  // connect the wallet after the user is verified
  useModelEvent(
    UserModel,
    'userVerified',
    () => {
      connectWallet();
    },
    [],
  );

  const inAppVerificationFF = useIsFeatureOn('mob-4472-in-app-verification');

  const mustVerify =
    !sessionService.getUser().rewards && ONCHAIN_ENABLED
      ? () => {
          if (inAppVerificationFF) {
            //@ts-ignore
            navigation.navigate('VerifyUniqueness');
          } else {
            const onComplete = () => {
              connectWallet();
            };
            //@ts-ignore
            navigation.navigate('PhoneValidation', {
              onComplete,
            });
          }
        }
      : undefined;

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
          connectWallet={mustVerify || connectWallet}
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
          connectWallet={mustVerify || connectWallet}
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

export default TokensTab;
