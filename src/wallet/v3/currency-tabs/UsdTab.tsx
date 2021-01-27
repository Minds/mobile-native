import React, { useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Text, View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { UsdOptions } from '../../v2/WalletTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../v2/createWalletStore';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../WalletScreen';
import UsdSettings from '../../v2/address/UsdSettings';
import i18n from '../../../common/services/i18n.service';
import TransactionsListCash from '../../v2/TransactionList/TransactionsListCash';
import UsdEarnings from './UsdEarnings';
import Button from '../../../common/components/Button';
import PaidButton from './PaidButton';
import ConnectBankButton from './ConnectBankButton';
import { Tooltip } from 'react-native-elements';
import { useDimensions } from '@react-native-community/hooks';
import PaidInfo from './PaidInfo';

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
  route: WalletScreenRouteProp;
};

const createStore = () => ({
  option: 'settings' as UsdOptions,
  showTooltip: false,
  setOption(option: UsdOptions) {
    this.option = option;
  },
  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  },
});

/**
 * Usd tab
 */
const UsdTab = observer(
  ({ walletStore, navigation, route, bottomStore }: PropsType) => {
    const store = useLocalStore(createStore);
    const tooltipRef = useRef<any>();
    const screen = useDimensions().screen;
    const theme = ThemedStyles.style;

    const options: Array<ButtonTabType<UsdOptions>> = [
      { id: 'earnings', title: i18n.t('wallet.usd.earnings') },
      { id: 'transactions', title: i18n.t('wallet.transactions.transactions') },
      { id: 'settings', title: i18n.t('moreScreen.settings') },
    ];

    let body;
    switch (store.option) {
      case 'earnings':
        body = (
          <UsdEarnings
            navigation={navigation}
            walletStore={walletStore}
            route={route}
          />
        );
        break;
      case 'transactions':
        //TODO: filter are not implemented in the backend change the first string to the corresponding values after
        const filters: Array<[string, string]> = [
          ['all', i18n.t('wallet.transactions.allFilter')],
          ['wire', i18n.t('wallet.transactions.wiresFilter')],
          ['pro', i18n.t('wallet.transactions.proEarningsFilter')],
          ['payout', i18n.t('wallet.transactions.payoutsFilter')],
        ];
        body = (
          <TransactionsListCash
            filters={filters}
            navigation={navigation}
            currency="usd"
            wallet={walletStore}
            bottomStore={bottomStore}
          />
        );
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

    const mainBody = (
      <View style={theme.paddingTop5x}>
        <View
          style={[
            theme.rowJustifyStart,
            theme.paddingLeft2x,
            theme.marginBottom5x,
          ]}>
          <Tooltip
            ref={tooltipRef}
            closeOnlyOnBackdropPress={true}
            skipAndroidStatusBar={true}
            toggleOnPress={false}
            withOverlay={false}
            containerStyle={theme.borderRadius}
            width={screen.width - 20}
            height={250}
            backgroundColor={ThemedStyles.getColor('secondary_background')}
            popover={<PaidInfo />}>
            <PaidButton
              containerStyle={theme.marginRight2x}
              onPress={() => tooltipRef.current.toggleTooltip()}
            />
          </Tooltip>
          <ConnectBankButton />
        </View>

        <TopBarButtonTabBar
          tabs={options}
          current={store.option}
          onChange={store.setOption}
        />
        {body}
      </View>
    );

    if (store.option !== 'transactions') {
      return <ScrollView>{mainBody}</ScrollView>;
    } else {
      return <View style={theme.flexContainer}>{mainBody}</View>;
    }
  },
);

export default UsdTab;
