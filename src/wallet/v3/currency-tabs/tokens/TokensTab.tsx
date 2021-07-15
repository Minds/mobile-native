import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { TokensOptions } from '../../../v2/WalletTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import TokensOverview from '../../../v2/currency-tabs/TokensOverview';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../../common/components/BottomOptionPopup';
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

export const options: Array<ButtonTabType<TokensOptions>> = [
  { id: 'rewards', title: 'Rewards' },
  { id: 'earnings', title: 'Earnings' },
  { id: 'balance', title: 'Balance' },
  { id: 'transactions', title: 'Transactions' },
  { id: 'settings', title: 'Settings' },
];

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
  store: TokensTabStore;
};

/**
 * Tokens tab
 */
const TokensTab = observer(
  ({ walletStore, navigation, bottomStore, store }: PropsType) => {
    const theme = ThemedStyles.style;
    const onchainStore = useUniqueOnchain();
    const wc = useWalletConnect();
    const connectWallet = React.useCallback(async () => {
      const user = sessionService.getUser();

      const msg = JSON.stringify({
        user_guid: user.guid,
        unix_ts: Date.now() / 1000,
      });

      await wc.connect();

      if (!wc.connected || !wc.web3 || !wc.provider) {
        throw new Error('Connect the wallet first');
      }

      try {
        onchainStore.setLoading(true);

        showNotification(
          'Please complete the step in your wallet app',
          'info',
          0,
        );
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

          showNotification('Your On-chain address is now setup and verified');
        } catch (error) {
          throw 'Request Failed ' + error;
        }
      } catch (err) {
        console.error('There was an error', err);
        showNotification(err.toString(), 'danger');
      } finally {
        onchainStore.setLoading(false);
      }
    }, [onchainStore, walletStore, wc]);

    const mustVerify = !sessionService.getUser().rewards
      ? () => {
          const onComplete = () => {
            connectWallet();
          };
          //@ts-ignore
          navigation.navigate('PhoneValidation', {
            onComplete,
          });
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
          <TokensOverview
            walletStore={walletStore}
            navigation={navigation}
            bottomStore={bottomStore}
          />
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

    return (
      <ScrollView>
        <View style={theme.paddingTop5x}>
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
          {body}
        </View>
      </ScrollView>
    );
  },
);

export default TokensTab;
