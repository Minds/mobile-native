import React from 'react';
// import Plotly from 'react-native-plotly';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { WalletStoreType } from '../createWalletStore';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import MenuItem from '../../../common/components/menus/MenuItem';
import { WalletScreenNavigationProp } from '../WalletScreen';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
};

const TokensOverview = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const balanceStyle = [
    theme.fontL,
    theme.colorSecondaryText,
    theme.paddingBottom,
  ];

  const walletActions = [
    {
      title: 'Transfer to On-chain',
      onPress: () => null,
      noIcon: true,
    },
    {
      title: 'Learn more about wallet',
      onPress: () => navigation.push('LearnMoreScreen'),
      noIcon: true,
    },
  ];

  return (
    <>
      <View
        style={[
          theme.paddingHorizontal3x,
          theme.paddingTop3x,
          theme.rowJustifySpaceBetween,
        ]}>
        <View>
          <Text style={balanceStyle}>Wallet balance</Text>
          <Text style={theme.fontXL}>{walletStore.balance}</Text>
        </View>
        <View>
          <Text style={balanceStyle}>Off chain</Text>
          <Text style={theme.fontXL}>
            {walletStore.wallet.offchain.balance}
          </Text>
        </View>
        <View>
          <Text style={balanceStyle}>On chain</Text>
          <Text style={theme.fontXL}>{walletStore.wallet.onchain.balance}</Text>
        </View>
      </View>

      <View style={theme.paddingTop2x}>
        <MenuSubtitle>WALLET ACTIONS</MenuSubtitle>
        {walletActions.map((item, i) => (
          <MenuItem item={item} key={i} />
        ))}
      </View>
    </>
  );
});

export default TokensOverview;
