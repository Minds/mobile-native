import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';

import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TokensTab from './currency-tabs/tokens/TokensTab';
import type { CurrencyType } from '../../types/Payment';
import type { TabType } from '../../common/components/topbar-tabbar/TopbarTabbar';
import type { WalletStoreType } from '../v2/createWalletStore';
import type {
  InternalStackParamList,
  AppStackParamList,
} from '../../navigation/NavigationTypes';
import CenteredLoading from '../../common/components/CenteredLoading';
import UsdTab from './currency-tabs/cash/UsdTab';
import i18n from '../../common/services/i18n.service';
import { useStores } from '../../common/hooks/use-stores';
import { createTokensTabStore } from './currency-tabs/tokens/createTokensTabStore';
import TokenPrice from './TokenPrice';
import createUsdTabStore from './currency-tabs/cash/createUsdTabStore';
import type { UsdOptions, TokensOptions } from '../v2/WalletTypes';

export type WalletScreenRouteProp = RouteProp<InternalStackParamList, 'Wallet'>;
export type WalletScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InternalStackParamList, 'Wallet'>,
  StackNavigationProp<AppStackParamList, 'Main'>
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

  const tokenTabStore = useLocalStore(createTokensTabStore, store);
  const usdTabStore = useLocalStore(createUsdTabStore);

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
    if (props.route.params && props.route.params.currency) {
      store.setCurrent(
        props.route.params.currency === 'cash' ? 'usd' : 'tokens',
      );
      if (props.route.params.section) {
        if (props.route.params.currency === 'cash') {
          if (
            ['earnings', 'transactions', 'settings'].includes(
              props.route.params.section,
            )
          ) {
            usdTabStore.setOption(props.route.params.section as UsdOptions);
          }
        } else {
          if (
            [
              'rewards',
              'balance',
              'transactions',
              'settings',
              'earnings',
            ].includes(props.route.params.section)
          ) {
            tokenTabStore.setOption(
              props.route.params.section as TokensOptions,
            );
          }
        }
      }
    }
  }, [props.route.params, store, tokenTabStore, usdTabStore]);

  useFocusEffect(
    React.useCallback(() => {
      tokenTabStore.loadRewards(tokenTabStore.rewardsSelectedDate);
      tokenTabStore.loadLiquidityPositions();
      tokenTabStore.loadEarnings(tokenTabStore.earningsSelectedDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      tokenTabStore,
      tokenTabStore.rewardsSelectedDate,
      tokenTabStore.earningsSelectedDate,
    ]),
  );

  let body;
  if (store.wallet.loaded) {
    switch (store.currency) {
      case 'tokens':
        body = (
          <TokensTab
            walletStore={store}
            navigation={props.navigation}
            store={tokenTabStore}
          />
        );
        break;
      case 'usd':
        body = (
          <UsdTab
            walletStore={store}
            navigation={props.navigation}
            route={props.route}
            usdTabStore={usdTabStore}
            tokensTabStore={tokenTabStore}
          />
        );
        break;
    }
  } else {
    body = <CenteredLoading />;
  }
  return (
    <View style={[theme.flexContainer, theme.paddingTop4x]}>
      <View
        style={[
          theme.rowJustifySpaceBetween,
          theme.paddingHorizontal4x,
          theme.alignCenter,
        ]}>
        <Text style={[theme.fontXXXL, theme.bold]}>
          {i18n.t('wallet.wallet')}
        </Text>
        <TokenPrice />
      </View>
      <View style={theme.paddingTop3x}>
        <TopbarTabbar
          titleStyle={theme.fontXL}
          tabs={tabs}
          onChange={currency => store.setCurrent(currency)}
          current={store.currency}
          tabStyle={theme.paddingVertical}
        />
      </View>
      {body}
    </View>
  );
});

export default WalletScreen;
