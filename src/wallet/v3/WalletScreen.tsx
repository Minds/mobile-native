import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react';

import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TokensTab from './currency-tabs/TokensTab';
import type { CurrencyType } from '../../types/Payment';
import type { TabType } from '../../common/components/topbar-tabbar/TopbarTabbar';
import type { WalletStoreType } from '../v2/createWalletStore';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import CenteredLoading from '../../common/components/CenteredLoading';
import BottomOptionPopup, {
  BottomOptionsStoreType,
  useBottomOption,
} from '../../common/components/BottomOptionPopup';
import UsdTab from './currency-tabs/UsdTab';
import i18n from '../../common/services/i18n.service';
import { useStores } from '../../common/hooks/use-stores';
import Withdraw from '../v2/currency-tabs/tokens/Withdraw';

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

  const showWithdrawal = useCallback(() => {
    bottomStore.show(
      i18n.t('wallet.withdraw.title'),
      i18n.t('wallet.withdraw.transfer'),
      <Withdraw walletStore={store} bottomStore={bottomStore} />,
    );
  }, [bottomStore, store]);

  const tabs: Array<TabType<CurrencyType>> = [
    {
      id: 'tokens',
      title: i18n.t('tokens'),
    },
    {
      id: 'usd',
      title: i18n.t('wallet.cash'),
    },
  ];

  useEffect(() => {
    store.loadWallet();
  }, [store]);

  useEffect(() => {
    if (props.route?.params?.showBottomStore) {
      switch (props.route.params.showBottomStore) {
        case 'withdrawal':
          showWithdrawal();
          break;
      }
    }
  });

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
    }
  } else {
    body = <CenteredLoading />;
  }
  return (
    <View style={[theme.flexContainer, theme.paddingTop4x]}>
      <Text style={[theme.fontXXXL, theme.bold, theme.paddingLeft4x]}>
        {i18n.t('wallet.wallet')}
      </Text>
      <View style={theme.paddingTop3x}>
        <TopbarTabbar
          titleStyle={theme.fontXL}
          tabs={tabs}
          onChange={(currency) => store.setCurrent(currency)}
          current={store.currency}
          tabStyle={theme.paddingVertical}
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
