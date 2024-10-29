import React from 'react';
import { observer } from 'mobx-react';

import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../../v3/WalletScreen';
import { WalletStoreType } from '../createWalletStore';
import { ScrollView, StyleSheet, View } from 'react-native';

import MenuItem from '~/common/components/menus/MenuItem';
import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
  route: WalletScreenRouteProp;
};

const BitcoinsTab = observer(({ walletStore, navigation }: PropsType) => {
  const theme = sp.styles.style;
  const address = walletStore.wallet.btc.address;
  const i18n = sp.i18n;
  return (
    <ScrollView>
      {!address && (
        <View style={styles.textContainer}>
          <MText style={[styles.title, theme.colorPrimaryText]}>
            {i18n.t('wallet.bitcoins.setup')}
          </MText>
          <MText style={[styles.description, theme.colorSecondaryText]}>
            {i18n.t('wallet.bitcoins.description')}
          </MText>
        </View>
      )}

      {address && (
        <MenuSubtitle>
          <MText style={[styles.menuTitle, theme.colorSecondaryText]}>
            {i18n.t('wallet.bitcoins.current')}
          </MText>
        </MenuSubtitle>
      )}

      <MenuItem
        title={address || i18n.t('wallet.bitcoins.add')}
        onPress={() => navigation.push('BtcAddressScreen', { walletStore })}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  textContainer: {
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 21,
    marginBottom: 15,
  },
  description: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
  },
  menuTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
  },
});

export default BitcoinsTab;
