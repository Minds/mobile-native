import React from 'react';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuItem from '../../../common/components/menus/MenuItem';
import i18n from '../../../common/services/i18n.service';
import Button from '../../../common/components/Button';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const UsdSettings = ({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const hasBankInfo =
    walletStore.wallet.cash.address !== null &&
    walletStore.wallet.cash.address !== '';

  return (
    <View style={theme.paddingTop4x}>
      <View style={theme.paddingHorizontal3x}>
        <Text style={[theme.colorPrimaryText, styles.title]}>
          {i18n.t('wallet.usd.bankInfo')}
        </Text>
        {!hasBankInfo && (
          <View style={theme.marginBottom7x}>
            <Text style={[theme.paddingBottom3x, theme.colorSecondaryText]}>
              {i18n.t('wallet.usd.bankInfoDescription')}
            </Text>
            <Button onPress={() => true} text={i18n.t('wallet.usd.add')} />
          </View>
        )}
      </View>
      {hasBankInfo && (
        <View style={theme.marginBottom7x}>
          <MenuItem
            item={{
              title: walletStore.wallet.cash.address || '',
              onPress: () => true,
            }}
          />
        </View>
      )}
      <View style={[theme.paddingHorizontal3x, theme.marginBottom3x]}>
        <Text style={[theme.colorPrimaryText, styles.title]}>
          {i18n.t('wallet.usd.leave')}
        </Text>
        <Text style={theme.colorSecondaryText}>
          {i18n.t('wallet.usd.leaveDescription')}
        </Text>
      </View>
      <MenuItem
        item={{
          title: i18n.t('wallet.usd.leaveButton'),
          onPress: () => true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Medium',
    marginBottom: 5,
  },
});

export default UsdSettings;
