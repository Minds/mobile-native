import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';

import { WalletScreenNavigationProp } from '../../v3/WalletScreen';
import { WalletStoreType } from '../createWalletStore';

import { UniqueOnChainStoreType } from '../../v3/useUniqueOnchain';
import MenuItem from '~/common/components/menus/MenuItem';
import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import { Spacer } from '~ui';
import sp from '~/services/serviceProvider';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  onchainStore: UniqueOnChainStoreType;
  connectWallet: () => void;
  walletStore: WalletStoreType;
};

const ReceiverSettings = observer(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ navigation, onchainStore, connectWallet, walletStore }: PropsType) => {
    const theme = sp.styles.style;
    const innerWrapper = [theme.borderBottomHair, theme.bcolorPrimaryBorder];
    const btcAddress = walletStore.wallet.btc.address;
    const receiverSettingsOptions = [
      // Disabled for now (wallet connect is unreliable)
      // {
      //   title: i18n.t(
      //     `wallet.${
      //       onchainStore.result?.address ? 'alternateReceiver' : 'connect'
      //     }`,
      //   ),
      //   onPress: connectWallet,
      // },
      {
        title: sp.i18n.t(`wallet.bitcoins.${btcAddress ? 'update' : 'setup'}`),
        onPress: () => navigation.push('BtcAddressScreen', { walletStore }),
      },
    ];
    return (
      <Spacer top="XXS">
        <MenuSubtitle>
          {sp.i18n.t('wallet.receiverAddresses').toUpperCase()}
        </MenuSubtitle>
        <View style={innerWrapper}>
          {receiverSettingsOptions.map(item => (
            <MenuItem key={item.title} {...item} />
          ))}
        </View>
      </Spacer>
    );
  },
);

export default ReceiverSettings;
