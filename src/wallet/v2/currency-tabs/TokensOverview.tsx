import React from 'react';
import { View, Text, Linking } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../createWalletStore';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import MenuItem from '../../../common/components/menus/MenuItem';
import { WalletScreenNavigationProp } from '../WalletScreen';
import Withdraw from './tokens/Withdraw';
import { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';
import i18n from '../../../common/services/i18n.service';
import TokensChart from './TokensChart';
import useWalletConnect from '../../../blockchain/v2/walletconnect/useWalletConnect';
import { navToTokens } from '../../../buy-tokens/BuyTokensScreen';

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  navigation: WalletScreenNavigationProp;
};

const TokensOverview = observer(({ walletStore, bottomStore }: PropsType) => {
  const wc = useWalletConnect();
  const theme = ThemedStyles.style;
  const balanceStyle = [
    theme.fontL,
    theme.colorSecondaryText,
    theme.paddingBottom,
  ];

  const walletActions = [
    {
      title: i18n.t('wallet.transferToOnchain'),
      onPress: () => {
        bottomStore.show(
          i18n.t('wallet.withdraw.title'),
          i18n.t('wallet.withdraw.transfer'),
          <Withdraw
            walletStore={walletStore}
            bottomStore={bottomStore}
            wc={wc}
          />,
        );
      },
      noIcon: true,
    },
    {
      title: i18n.t('wallet.leanMore'),
      onPress: navToTokens,
      noIcon: true,
    },
  ];

  return (
    <>
      <TokensChart timespan={walletStore.chart} />
      <View
        style={[
          theme.paddingHorizontal3x,
          theme.paddingTop3x,
          theme.rowJustifySpaceBetween,
        ]}>
        <View>
          <Text style={balanceStyle}>{i18n.t('wallet.walletBalance')}</Text>
          <Text style={theme.fontXL}>{walletStore.balance}</Text>
        </View>
        <View>
          <Text style={balanceStyle}>{i18n.t('blockchain.offchain')}</Text>
          <Text style={theme.fontXL}>
            {walletStore.wallet.offchain.balance}
          </Text>
        </View>
        <View>
          <Text style={balanceStyle}>{i18n.t('blockchain.onchain')}</Text>
          <Text style={theme.fontXL}>{walletStore.wallet.onchain.balance}</Text>
        </View>
      </View>

      <View style={theme.paddingTop2x}>
        <MenuSubtitle>{i18n.t('wallet.walletActions')}</MenuSubtitle>
        {walletActions.map((item, i) => (
          <MenuItem item={item} key={i} />
        ))}
      </View>
    </>
  );
});

export default TokensOverview;
