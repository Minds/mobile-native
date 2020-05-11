import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemedStyles from '../../styles/ThemedStyles';
import { useLocalStore, observer } from 'mobx-react';

import Topbar from '../../topbar/Topbar';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TokensTab from './currency-tabs/TokensTab';
import createWalletStore from './createWalletStore';
import type { CurrencyType } from '../../types/Payment';
import type { TabType } from '../../common/components/topbar-tabbar/TopbarTabbar';
import type { WalletStoreType } from './createWalletStore';
import type { AppStackParamList } from '../../navigation/NavigationTypes';

export type WalletScreenRouteProp = RouteProp<AppStackParamList, 'Fab'>;
export type WalletScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Fab'
>;

type PropsType = {
  route: WalletScreenRouteProp;
  navigation: WalletScreenNavigationProp;
};

/**
 * Wallet screen
 */
const WalletScreen = observer((props: PropsType) => {
  const theme = ThemedStyles.style;

  const store: WalletStoreType = useLocalStore(createWalletStore);

  const tabs: Array<TabType<CurrencyType>> = [
    { id: 'tokens', title: 'Tokens', subtitle: store.balance.toString() },
    { id: 'usd', title: 'USD', subtitle: store.wallet.cash.balance.toString() },
    {
      id: 'eth',
      title: 'Ether',
      subtitle: store.wallet.eth.balance.toString(),
    },
    {
      id: 'btc',
      title: 'Bitcoin',
      subtitle: store.wallet.btc.balance.toString(),
    },
  ];

  useEffect(() => {
    store.loadWallet();
  }, [store]);

  let body;
  switch (store.currency) {
    case 'tokens':
      body = (
        <TokensTab
          walletStore={store}
          navigation={props.navigation}
          route={props.route}
        />
      );
  }

  return (
    <View>
      <Topbar
        title="Wallet"
        navigation={props.navigation}
        background={theme.backgroundPrimary}
      />
      <View style={theme.paddingTop4x}>
        <TopbarTabbar
          titleStyle={theme.bold}
          tabs={tabs}
          onChange={store.setCurrent}
          current={store.currency}
        />
      </View>
      {body}
    </View>
  );
});

export default WalletScreen;
