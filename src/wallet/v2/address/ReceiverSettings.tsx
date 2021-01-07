import React from 'react';
import { WalletScreenNavigationProp } from '../WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuItem from '../../../common/components/menus/MenuItem';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
};

const ReceiverSettings = ({ navigation, walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const innerWrapper = [theme.borderBottomHair, theme.borderPrimary];

  const receiverSettingsOptions = walletStore.wallet.receiver.address
    ? [
        {
          title: i18n.t('wallet.activeAddress'),
          onPress: () =>
            navigation.push('ReceiverAddressScreen', {
              walletStore: walletStore,
            }),
        },
        {
          title: i18n.t('wallet.alternateReceiver'),
          onPress: () => navigation.push('BlockchainWallet', {}),
        },
        {
          title: i18n.t('wallet.validateAddress'),
          onPress: () => navigation.push('ValidateAddressScreen', {}),
        },
      ]
    : [
        {
          title: i18n.t('wallet.createAddress'),
          onPress: () => {
            if (!walletStore.wallet.receiver.address) {
              walletStore.createOnchain(true);
            }
          },
        },
        {
          title: i18n.t('wallet.usePrivateKey'),
          onPress: () => true,
        },
      ];
  return (
    <View style={theme.paddingTop4x}>
      <Text style={[theme.colorSecondaryText, styles.subTitle]}>
        {i18n.t('wallet.receiverAddresses').toUpperCase()}
      </Text>
      <View style={innerWrapper}>
        {receiverSettingsOptions.map((item) => (
          <MenuItem item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    paddingLeft: 20,
    marginBottom: 10,
    fontSize: 15,
  },
});

export default ReceiverSettings;
