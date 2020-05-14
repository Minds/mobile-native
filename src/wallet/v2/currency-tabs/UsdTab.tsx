import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { UsdOptions } from '../WalletTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { WalletStoreType } from '../createWalletStore';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../WalletScreen';
import UsdSettings from '../address/UsdSettings';

const options: Array<ButtonTabType<UsdOptions>> = [
  { id: 'transactions', title: 'Transactions' },
  { id: 'settings', title: 'Settings' },
];

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
  route: WalletScreenRouteProp;
};

const createStore = () => ({
  option: 'settings' as UsdOptions,
  setOption(option: UsdOptions) {
    this.option = option;
  },
});

/**
 * Usd tab
 */
const UsdTab = observer(({ walletStore, navigation, route }: PropsType) => {
  const store = useLocalStore(createStore);
  const theme = ThemedStyles.style;

  let body;
  switch (store.option) {
    case 'transactions':
      body = null;
      break;
    case 'settings':
      body = (
        <UsdSettings
          navigation={navigation}
          walletStore={walletStore}
          route={route}
        />
      );
      break;
  }

  return (
    <ScrollView>
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
});

export default UsdTab;
