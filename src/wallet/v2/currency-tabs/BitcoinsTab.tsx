import React from 'react';

import i18n from '../../../common/services/i18n.service';
import {
  WalletScreenRouteProp,
  WalletScreenNavigationProp,
} from '../WalletScreen';
import { WalletStoreType } from '../createWalletStore';
import { observer } from 'mobx-react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';

type PropsType = {
  walletStore: WalletStoreType;
  navigation: WalletScreenNavigationProp;
  route: WalletScreenRouteProp;
};

const BitcoinsTab = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const address = walletStore.wallet.btc.address;
  return (
    <ScrollView>
      {!address && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, theme.colorPrimaryText]}>
            {i18n.t('wallet.bitcoins.setup')}
          </Text>
          <Text style={[styles.description, theme.colorSecondaryText]}>
            {i18n.t('wallet.bitcoins.description')}
          </Text>
        </View>
      )}

      {address && (
        <MenuSubtitle>
          <Text style={[styles.menuTitle, theme.colorSecondaryText]}>
            {i18n.t('wallet.bitcoins.current')}
          </Text>
        </MenuSubtitle>
      )}

      <MenuItem
        item={{
          title: address || i18n.t('wallet.bitcoins.add'),
          onPress: () => navigation.push('BtcAddressScreen', { walletStore }),
        }}
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
    fontFamily: 'Roboto-Medium',
    fontSize: 21,
    marginBottom: 15,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  menuTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
});

export default BitcoinsTab;
