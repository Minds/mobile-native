import React, { useEffect } from 'react';
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
  AppStackParamList,
  MoreStackParamList,
} from '../../navigation/NavigationTypes';
import CenteredLoading from '../../common/components/CenteredLoading';
import UsdTab from './currency-tabs/cash/UsdTab';
import i18n from '../../common/services/i18n.service';
import { useStores } from '../../common/hooks/use-stores';
import { createTokensTabStore } from './currency-tabs/tokens/createTokensTabStore';
import TokenPrice from './TokenPrice';
import createUsdTabStore from './currency-tabs/cash/createUsdTabStore';
import type { UsdOptions, TokensOptions } from '../v2/WalletTypes';
import { ScreenHeader, Screen } from '~ui/screen';
import { IS_IOS, IS_IPAD } from '~/config/Config';
import OnboardingOverlay from '~/components/OnboardingOverlay';
import CreditsTab from '~/modules/gif-card/components/CreditsTab';
import { useGetGiftBalance } from '~/modules/gif-card/components/GiftCardList';
import { IS_FROM_STORE } from '~/config/Config';

export type WalletScreenRouteProp = RouteProp<MoreStackParamList, 'Wallet'>;
export type WalletScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MoreStackParamList, 'Wallet'>,
  StackNavigationProp<AppStackParamList, 'Tabs'>
>;

type PropsType = {
  route: WalletScreenRouteProp;
  navigation: WalletScreenNavigationProp;
};

/**
 * Wallet screen
 */
const WalletScreen = observer((props: PropsType) => {
  const { currency, section } = props.route.params ?? {};

  const theme = ThemedStyles.style;
  const store: WalletStoreType = useStores().wallet;

  const tokenTabStore = useLocalStore(createTokensTabStore, store);
  const usdTabStore = useLocalStore(createUsdTabStore);
  const balance = useGetGiftBalance(false);

  const showCreditTab = (balance ?? 0) > 0;

  const tabs: Array<TabType<CurrencyType>> = [
    {
      id: 'tokens',
      title: i18n.t('tokens'),
    },
  ];

  if (!IS_IOS) {
    tabs.push({
      id: 'usd',
      title: i18n.t('wallet.cash'),
      testID: 'WalletScreen:cash',
    });
  }

  if (showCreditTab) {
    tabs.push({
      id: 'credits',
      title: i18n.t('credits'),
      testID: 'WalletScreen:credits',
    });
  }

  useEffect(() => {
    store.loadWallet();
    if (!currency || !section) {
      return;
    }
    store.setCurrent(currency === 'cash' ? 'usd' : 'tokens');
    if (
      currency === 'cash' &&
      ['earnings', 'transactions', 'settings'].includes(section)
    ) {
      usdTabStore.setOption(section as UsdOptions);
    } else if (
      ['earnings', 'transactions', 'settings', 'rewards', 'balance'].includes(
        section,
      )
    ) {
      tokenTabStore.setOption(section as TokensOptions);
    }
  }, [currency, section, store, tokenTabStore, usdTabStore]);

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

  const body = {
    tokens: (
      <TokensTab
        walletStore={store}
        navigation={props.navigation}
        store={tokenTabStore}
      />
    ),
    usd: (
      <UsdTab
        walletStore={store}
        navigation={props.navigation}
        route={props.route}
        usdTabStore={usdTabStore}
        tokensTabStore={tokenTabStore}
      />
    ),
    credits: <CreditsTab />,
    loading: <CenteredLoading />,
  };

  return (
    <Screen safe>
      <ScreenHeader
        back={!IS_IPAD}
        title={i18n.t('wallet.wallet')}
        extra={IS_FROM_STORE ? null : <TokenPrice />}
      />
      <TopbarTabbar
        titleStyle={theme.fontXL}
        tabs={tabs}
        onChange={currency => store.setCurrent(currency)}
        current={store.currency}
        tabStyle={theme.paddingVertical}
      />
      {store.wallet.loaded ? body[store.currency] : body.loading}
      <OnboardingOverlay type="wallet_cash_earnings" disableLinks />
    </Screen>
  );
});

export default WalletScreen;
