import React, { useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, Text, View } from 'react-native';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { TokensOptions } from '../../v2/WalletTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../v2/createWalletStore';
import TokensOverview from '../../v2/currency-tabs/TokensOverview';
import { ScrollView } from 'react-native-gesture-handler';
import type { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import TransactionsListTokens from '../../v2/TransactionList/TransactionsListTokens';
import ReceiverSettings from '../../v2/address/ReceiverSettings';
import { WalletScreenNavigationProp } from '../../v2/WalletScreen';
import i18n from '../../../common/services/i18n.service';
import TokensRewards from './TokensRewards';
import TokensEarnings from './TokensEarnings';
import { useDimensions } from '@react-native-community/hooks';
import { Tooltip } from 'react-native-elements';
import BalanceInfo from './BalanceInfo';

const options: Array<ButtonTabType<TokensOptions>> = [
  { id: 'rewards', title: 'Rewards' },
  { id: 'earnings', title: 'Earnings' },
  { id: 'overview', title: 'Overview' },
  { id: 'transactions', title: 'Transactions' },
  { id: 'settings', title: 'Settings' },
];

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
};

const createStore = (walletStore: WalletStoreType) => ({
  option: walletStore.initialTab || ('rewards' as TokensOptions),
  setOption(option: TokensOptions) {
    this.option = option;
  },
});

/**
 * Tokens tab
 */
const TokensTab = observer(
  ({ walletStore, navigation, bottomStore }: PropsType) => {
    const store = useLocalStore(createStore, walletStore);
    const theme = ThemedStyles.style;
    const tooltipRef = useRef<any>();
    const screen = useDimensions().screen;

    let body;
    switch (store.option) {
      case 'rewards':
        body = <TokensRewards walletStore={walletStore} />;
        break;
      case 'earnings':
        body = (
          <TokensEarnings walletStore={walletStore} currencyType="tokens" />
        );
        break;
      case 'overview':
        body = (
          <TokensOverview
            walletStore={walletStore}
            navigation={navigation}
            bottomStore={bottomStore}
          />
        );
        break;
      case 'transactions':
        const filters: Array<[string, string]> = [
          ['all', i18n.t('wallet.transactions.allFilter')],
          ['offchain:reward', i18n.t('wallet.transactions.rewardsFilter')],
          ['offchain:boost', i18n.t('wallet.transactions.boostsFilter')],
          ['offchain:wire', i18n.t('wallet.transactions.transferFilter')],
        ];
        body = (
          <TransactionsListTokens
            filters={filters}
            navigation={navigation}
            currency="tokens"
            wallet={walletStore}
            bottomStore={bottomStore}
          />
        );
        break;
      case 'settings':
        body = <ReceiverSettings />;
        break;
    }

    const mainBody = (
      <>
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
              popover={<BalanceInfo walletStore={walletStore} />}>
              <Text
                onPress={() => tooltipRef.current.toggleTooltip()}
                style={[styles.minds, theme.mindsSwitchBackgroundSecondary]}>
                {walletStore.balance} MINDS
              </Text>
            </Tooltip>
          </View>

          <TopBarButtonTabBar
            tabs={options}
            current={store.option}
            onChange={store.setOption}
          />
          {body}
        </View>
      </>
    );
    if (store.option !== 'transactions') {
      return <ScrollView>{mainBody}</ScrollView>;
    } else {
      return <View style={theme.flexContainer}>{mainBody}</View>;
    }
  },
);

const styles = StyleSheet.create({
  minds: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default TokensTab;
