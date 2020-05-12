import React from 'react';
import { WalletScreenNavigationProp } from '../WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import MenuItem from '../../../common/components/menus/MenuItem';

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
          title: 'Mobile Receiver Address (Active)',
          onPress: () =>
            navigation.push('ReceiverAddressScreen', {
              walletStore: walletStore,
            }),
        },
        {
          title: 'Alternate receiver address',
          onPress: () => navigation.push('BlockchainWallet'),
        },
      ]
    : [
        {
          title: 'Create a new address (Recommended)',
          onPress: () => {
            if (!walletStore.wallet.receiver.address) {
              walletStore.createOnchain(true);
            }
          },
        },
        {
          title: 'Use your private key',
          onPress: () => true,
        },
      ];
  return (
    <View style={theme.paddingTop4x}>
      <Text style={[theme.colorSecondaryText, styles.subTitle]}>
        RECEIVER ADDRESSES
      </Text>
      <View style={innerWrapper}>
        <MenuItem item={receiverSettingsOptions[0]} />
        <MenuItem item={receiverSettingsOptions[1]} />
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
