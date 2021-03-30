import React from 'react';
import { WalletScreenNavigationProp } from '../WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import { UniqueOnChainStoreType, isConnected } from '../../v3/useUniqueOnchain';
import MenuItem from '../../../common/components/menus/MenuItem';
import { observer } from 'mobx-react';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  onchainStore: UniqueOnChainStoreType;
  connectWallet: () => void;
  walletStore: WalletStoreType;
};

const ReceiverSettings = observer(
  ({ navigation, onchainStore, connectWallet, walletStore }: PropsType) => {
    const theme = ThemedStyles.style;
    const innerWrapper = [theme.borderBottomHair, theme.borderPrimary];
    const btcAddress = walletStore.wallet.btc.address;
    const receiverSettingsOptions = [
      {
        title: i18n.t(
          `wallet.${
            onchainStore.result?.address ? 'alternateReceiver' : 'connect'
          }`,
        ),
        onPress: connectWallet,
      },
      {
        title: i18n.t(`wallet.bitcoins.${btcAddress ? 'update' : 'setup'}`),
        onPress: () => navigation.push('BtcAddressScreen', { walletStore }),
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
  },
);

const styles = StyleSheet.create({
  subTitle: {
    paddingLeft: 20,
    marginBottom: 10,
    fontSize: 15,
  },
});

export default ReceiverSettings;
