import React from 'react';
import { WalletScreenNavigationProp } from '../../v3/WalletScreen';
import { View } from 'react-native';
import { WalletStoreType } from '../createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import { UniqueOnChainStoreType } from '../../v3/useUniqueOnchain';
import MenuItem from '../../../common/components/menus/MenuItem';
import { observer } from 'mobx-react';
import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import { Spacer } from '~ui';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  onchainStore: UniqueOnChainStoreType;
  connectWallet: () => void;
  walletStore: WalletStoreType;
};

const ReceiverSettings = observer(
  ({ navigation, onchainStore, connectWallet, walletStore }: PropsType) => {
    const theme = ThemedStyles.style;
    const innerWrapper = [theme.borderBottomHair, theme.bcolorPrimaryBorder];
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
      <Spacer top="XXS">
        <MenuSubtitle>
          {i18n.t('wallet.receiverAddresses').toUpperCase()}
        </MenuSubtitle>
        <View style={innerWrapper}>
          {receiverSettingsOptions.map(item => (
            <MenuItem {...item} />
          ))}
        </View>
      </Spacer>
    );
  },
);

export default ReceiverSettings;
