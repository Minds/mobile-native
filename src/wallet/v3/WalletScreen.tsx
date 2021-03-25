import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';

import TopbarTabbar from '../../common/components/topbar-tabbar/TopbarTabbar';
import TokensTab from './currency-tabs/tokens/TokensTab';
import type { CurrencyType } from '../../types/Payment';
import type { TabType } from '../../common/components/topbar-tabbar/TopbarTabbar';
import type { WalletStoreType } from '../v2/createWalletStore';
import type { AppStackParamList } from '../../navigation/NavigationTypes';
import CenteredLoading from '../../common/components/CenteredLoading';
import BottomOptionPopup, {
  BottomOptionsStoreType,
  useBottomOption,
} from '../../common/components/BottomOptionPopup';
import UsdTab from './currency-tabs/cash/UsdTab';
import i18n from '../../common/services/i18n.service';
import { useStores } from '../../common/hooks/use-stores';
import { createTokensTabStore } from './currency-tabs/tokens/createTokensTabStore';
import TokenPrice from './TokenPrice';

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

  const tokenTabStore = useLocalStore(createTokensTabStore, store);

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
  }, [store, tokenTabStore]);

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
            bottomStore={bottomStore}
            navigation={props.navigation}
            store={tokenTabStore}
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
