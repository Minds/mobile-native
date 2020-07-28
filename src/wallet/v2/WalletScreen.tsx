import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react';

import Topbar from '../../topbar/Topbar';
import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TokensTab from './currency-tabs/TokensTab';
import type { CurrencyType } from '../../types/Payment';
import type { TabType } from '../../common/components/topbar-tabbar/TopbarTabbar';
import type { WalletStoreType } from './createWalletStore';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import CenteredLoading from '../../common/components/CenteredLoading';
import EthTab from './currency-tabs/EthTab';
import BottomOptionPopup, {
  BottomOptionsStoreType,
  useBottomOption,
} from '../../common/components/BottomOptionPopup';
import BitcoinsTab from './currency-tabs/BitcoinsTab';
import UsdTab from './currency-tabs/UsdTab';
import i18n from '../../common/services/i18n.service';
import { useStores } from '../../common/hooks/use-stores';

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

  const store: WalletStoreType = useStores().wallet;
  const bottomStore: BottomOptionsStoreType = useBottomOption();

  const tabs: Array<TabType<CurrencyType>> = [
    {
      id: 'tokens',
      title: i18n.t('tokens'),
      subtitle: store.balance.toString(),
    },
    {
      id: 'usd',
      title: i18n.t('wallet.cash'),
      subtitle: store.wallet.cash.balance.toString(),
    },
    {
      id: 'eth',
      title: i18n.t('ether'),
      subtitle: store.wallet.eth.balance.toString(),
    },
    {
      id: 'btc',
      title: i18n.t('bitcoin'),
      subtitle: store.wallet.btc.balance.toString(),
    },
  ];

  useEffect(() => {
    store.loadWallet();
  }, [store]);

  let body;
  if (store.wallet.loaded) {
    switch (store.currency) {
      case 'tokens':
        body = (
          <TokensTab
            walletStore={store}
            bottomStore={bottomStore}
            navigation={props.navigation}
          />
        );
        break;
      case 'btc':
        body = (
          <BitcoinsTab
            walletStore={store}
            navigation={props.navigation}
            route={props.route}
          />
        );
        break;
      case 'usd':
        body = (
          <UsdTab
            walletStore={store}
            bottomStore={bottomStore}
            navigation={props.navigation}
            route={props.route}
          />
        );
        break;
      case 'eth':
        body = <EthTab walletStore={store} />;
        break;
    }
  } else {
    body = <CenteredLoading />;
  }
  return (
    <View style={theme.flexContainer}>
      <Topbar navigation={props.navigation} />
      <View style={theme.paddingTop4x}>
        <TopbarTabbar
          titleStyle={theme.bold}
          tabs={tabs}
          onChange={(currency) => store.setCurrent(currency)}
          current={store.currency}
        />
      </View>
      {body}
      <BottomOptionPopup
        height={500}
        title={bottomStore.title}
        show={bottomStore.visible}
        onCancel={bottomStore.hide}
        onDone={bottomStore.onPressDone}
        content={bottomStore.content}
        doneText={bottomStore.doneText}
      />
    </View>
  );
});

export default WalletScreen;
