import React from 'react';
import { observer } from 'mobx-react';
import { WalletStoreType } from '../createWalletStore';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import MenuItem from '../../../common/components/menus/MenuItem';
import { WalletScreenNavigationProp } from '../../v3/WalletScreen';
import i18n from '../../../common/services/i18n.service';
import TokensChart from './TokensChart';
import useWalletConnect from '../../../blockchain/v2/walletconnect/useWalletConnect';
import { navToTokens } from '../../../buy-tokens/BuyTokensScreen';
import { useNavigation } from '@react-navigation/core';

import { B1, B2, Row, Column } from '~ui';
import { ONCHAIN_ENABLED } from '~/config/Config';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
};

const TokensOverview = observer(({ walletStore }: PropsType) => {
  useWalletConnect();

  const navigation = useNavigation();

  const walletActions = [
    {
      title: i18n.t('wallet.leanMore'),
      onPress: navToTokens,
      noIcon: true,
    },
  ];

  if (ONCHAIN_ENABLED) {
    walletActions.unshift({
      title: i18n.t('wallet.transferToOnchain'),
      onPress: () => {
        navigation.navigate('WalletWithdrawal');
      },
      noIcon: true,
    });
  }

  return (
    <>
      <Row horizontal="L" top="L" align="centerBetween">
        <Column>
          <B2 color="secondary">{i18n.t('wallet.walletBalance')}</B2>
          <B1 font="medium">{walletStore.balance}</B1>
        </Column>
        <Column>
          <B2 color="secondary">{i18n.t('blockchain.offchain')}</B2>
          <B1 font="medium">{walletStore.wallet.offchain.balance}</B1>
        </Column>
        <Column>
          <B2 color="secondary">{i18n.t('blockchain.onchain')}</B2>
          <B1 font="medium">{walletStore.wallet.onchain.balance}</B1>
        </Column>
      </Row>
      <TokensChart timespan={walletStore.chart} />
      <MenuSubtitle>{i18n.t('wallet.walletActions')}</MenuSubtitle>
      {walletActions.map((item, i) => (
        <MenuItem item={item} key={i} />
      ))}
    </>
  );
});

export default TokensOverview;
