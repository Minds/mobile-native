import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'react-native-elements';

import { useWindowDimensions } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '~/common/components/topbar-tabbar/TopBarButtonTabBar';
import { UsdOptions } from '../../../v2/WalletTypes';

import type { WalletStoreType } from '../../../v2/createWalletStore';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../../WalletScreen';
import UsdSettings from '../../../v2/address/UsdSettings';
import TransactionsListCash from '../../../v2/TransactionList/TransactionsListCash';
import PaidButton from './PaidButton';
import PaidInfo from './PaidInfo';
import Earnings from '../Earnings';
import { TokensTabStore } from '../tokens/createTokensTabStore';
import { UsdTabStore } from './createUsdTabStore';
import { Screen, Column, Row } from '~ui';
import sp from '~/services/serviceProvider';

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
    const screen = useWindowDimensions();
    const theme = sp.styles.style;
    const i18n = sp.i18n;
    const options: Array<ButtonTabType<UsdOptions>> = [
      { id: 'earnings', title: i18n.t('wallet.usd.earnings') },
      { id: 'transactions', title: i18n.t('wallet.transactions.transactions') },
      {
        id: 'settings',
        title: i18n.t('moreScreen.settings'),
        testID: 'UsdTab:settings',
      },
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

    const isTransactions = usdTabStore.option === 'transactions';

    return (
      <Screen scroll={!isTransactions}>
        <Column top="XL" flex>
          <Row horizontal="M" bottom="XXL">
            <Tooltip
              ref={tooltipRef}
              closeOnlyOnBackdropPress={true}
              skipAndroidStatusBar={true}
              toggleOnPress={false}
              withOverlay={false}
              containerStyle={theme.borderRadius}
              width={screen.width - 20}
              height={250}
              backgroundColor={sp.styles.getColor('SecondaryBackground')}
              popover={<PaidInfo walletStore={walletStore} />}>
              <PaidButton
                containerStyle={theme.marginRight2x}
                onPress={() => tooltipRef.current.toggleTooltip()}
                walletStore={walletStore}
              />
            </Tooltip>
          </Row>

          <TopBarButtonTabBar
            tabs={options}
            current={usdTabStore.option}
            onChange={usdTabStore.setOption}
          />
          {isTransactions ? body : <Column bottom="XXL">{body}</Column>}
        </Column>
      </Screen>
    );
  },
);

export default UsdTab;
