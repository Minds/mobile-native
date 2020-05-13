import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { TokensOptions } from '../WalletTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { WalletStoreType } from '../createWalletStore';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import TokensOverview from './TokensOverview';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import TransactionsList from '../TransactionList/TransactionsList';
import ReceiverSettings from '../address/ReceiverSettings';
import { WalletScreenNavigationProp } from '../WalletScreen';

const options: Array<ButtonTabType<TokensOptions>> = [
  { id: 'overview', title: 'Overview' },
  { id: 'transactions', title: 'Transactions' },
  { id: 'settings', title: 'Settings' },
];

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
};

const createStore = (walletStore: WalletStoreType) => ({
  option: walletStore.initialTab || ('overview' as TokensOptions),
  setOption(option: TokensOptions) {
    this.option = option;
  },
});

type StoreType = ReturnType<typeof createStore>;

/**
 * Tokens tab
 */
const TokensTab = observer(
  ({ walletStore, navigation, bottomStore }: PropsType) => {
    const store = useLocalStore(createStore, walletStore);
    // clear initial tab
    // walletStore.setInitialTab(undefined);

    const { user } = useLegacyStores();
    const theme = ThemedStyles.style;
    const showSetup =
      !user.hasRewards() || !walletStore.wallet.receiver.address;
    let walletSetup;

    if (showSetup) {
      walletSetup = [
        {
          title: 'Phone Verification',
          onPress: () => null,
          icon: user.hasRewards() ? { name: 'md-checkmark' } : undefined,
          noIcon: !user.hasRewards(),
        },
        {
          title: 'Add On-Chain Address',
          onPress: () => {
            if (!walletStore.wallet.receiver.address) {
              walletStore.createOnchain(true);
            }
          },
          icon: walletStore.wallet.receiver.address
            ? { name: 'md-checkmark' }
            : undefined,
          noIcon: !walletStore.wallet.receiver.address,
        },
      ];
    }

    let body;
    switch (store.option) {
      case 'overview':
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
          <TransactionsList
            navigation={navigation}
            currency="tokens"
            wallet={walletStore}
          />
        );
        break;
      case 'settings':
        body = (
          <ReceiverSettings navigation={navigation} walletStore={walletStore} />
        );
        break;
    }

    return (
      <ScrollView>
        {showSetup && (
          <View style={theme.paddingTop2x}>
            <MenuSubtitle>WALLET SETUP</MenuSubtitle>
            {walletSetup.map((item, i) => (
              <MenuItem item={item} key={i} />
            ))}
          </View>
        )}
        <View style={theme.paddingTop4x}>
          <TopBarButtonTabBar
            tabs={options}
            current={store.option}
            onChange={store.setOption}
          />
          {body}
        </View>
      </ScrollView>
    );
  },
);

export default TokensTab;
