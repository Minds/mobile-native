import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { UsdOptions } from '../../../v2/WalletTypes';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import { ScrollView } from 'react-native-gesture-handler';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../../WalletScreen';
import UsdSettings from '../../../v2/address/UsdSettings';
import i18n from '../../../../common/services/i18n.service';
import TransactionsListCash from '../../../v2/TransactionList/TransactionsListCash';
import PaidButton from './PaidButton';
import ConnectBankButton from './ConnectBankButton';
import { Tooltip } from 'react-native-elements';
import { useDimensions } from '@react-native-community/hooks';
import PaidInfo from './PaidInfo';
import Earnings from '../Earnings';
import { TokensTabStore } from '../tokens/createTokensTabStore';
import { UsdTabStore } from './createUsdTabStore';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
  route: WalletScreenRouteProp;
  tokensTabStore: TokensTabStore;
  usdTabStore: UsdTabStore;
};

/**
 * Usd tab
 */
const UsdTab = observer(
  ({
    walletStore,
    navigation,
    route,
    tokensTabStore,
    usdTabStore,
  }: PropsType) => {
    const tooltipRef = useRef<any>();
    const screen = useDimensions().screen;
    const theme = ThemedStyles.style;

    const options: Array<ButtonTabType<UsdOptions>> = [
      { id: 'earnings', title: i18n.t('wallet.usd.earnings') },
      { id: 'transactions', title: i18n.t('wallet.transactions.transactions') },
      { id: 'settings', title: i18n.t('moreScreen.settings') },
    ];

    let body;
    switch (usdTabStore.option) {
      case 'earnings':
        body = (
          <Earnings
            walletStore={walletStore}
            currencyType="usd"
            store={tokensTabStore}
          />
        );
        break;
      case 'transactions':
        body = (
          <TransactionsListCash
            navigation={navigation}
            currency="usd"
            wallet={walletStore}
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
            backgroundColor={ThemedStyles.getColor('SecondaryBackground')}
            popover={<PaidInfo walletStore={walletStore} />}>
            <PaidButton
              containerStyle={theme.marginRight2x}
              onPress={() => tooltipRef.current.toggleTooltip()}
              walletStore={walletStore}
            />
          </Tooltip>
          <ConnectBankButton
            walletStore={walletStore}
            navigation={navigation}
          />
        </View>

        <TopBarButtonTabBar
          tabs={options}
          current={usdTabStore.option}
          onChange={usdTabStore.setOption}
        />
        {body}
      </View>
    );

    if (usdTabStore.option !== 'transactions') {
      return <ScrollView>{mainBody}</ScrollView>;
    } else {
      return <View style={theme.flexContainer}>{mainBody}</View>;
    }
  },
);

export default UsdTab;
