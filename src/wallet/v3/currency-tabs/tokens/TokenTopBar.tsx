import React, { useRef } from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import type { WalletStoreType } from '../../../v2/createWalletStore';
import { Tooltip } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import useUniqueOnchain from '../../useUniqueOnchain';
import useWalletConnect from '../../../../blockchain/v2/walletconnect/useWalletConnect';
import sessionService from '../../../../common/services/session.service';
import apiService from '../../../../common/services/api.service';
import BalanceInfo from './BalanceInfo';
import OnchainButton from './OnchainButton';
import { showNotification } from '../../../../../AppMessages';
import TokenTabOptions from './TokenTabOptions';

type PropsType = {
  walletStore: WalletStoreType;
};

const TokenTopBar = ({ walletStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const tooltipRef = useRef<any>();
  const screen = useDimensions().screen;
  const onchainStore = useUniqueOnchain();
  const wc = useWalletConnect();
  const connectWallet = React.useCallback(async () => {
    const msg = JSON.stringify({
      user_guid: sessionService.getUser().guid,
      unix_ts: Date.now() / 1000,
    });

    await wc.connect();

    if (!wc.connected || !wc.web3 || !wc.provider) {
      throw new Error('Connect the wallet first');
    }

    wc.provider.connector
      .signPersonalMessage([msg, wc.address])
      .then((signature) => {
        // Returns signature.
        apiService
          .post('api/v3/blockchain/unique-onchain/validate', {
            signature,
            payload: msg,
            address: wc.address,
          })
          .then(() => {
            setTimeout(() => {
              // reload wallet
              walletStore?.loadWallet();
              // reload unique onchain
              onchainStore?.fetch();
            }, 1000);

            showNotification('Wallet connected');
          })
          .catch((error) => {
            console.log('Request Failed', error);
          });
      });
  }, [onchainStore, walletStore, wc]);
  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.paddingLeft2x,
        theme.marginBottom5x,
      ]}>
      <Tooltip
        ref={tooltipRef}
        closeOnlyOnBackdropPress={true}
        skipAndroidStatusBar={true}
        toggleOnPress={false}
        withOverlay={true}
        overlayColor={'#00000015'}
        containerStyle={theme.borderRadius}
        width={screen.width - 20}
        height={200}
        backgroundColor={ThemedStyles.getColor('secondary_background')}
        popover={<BalanceInfo walletStore={walletStore} />}>
        <Text
          onPress={() => tooltipRef.current.toggleTooltip()}
          style={[styles.minds, theme.mindsSwitchBackgroundSecondary]}>
          {walletStore.balance} MINDS
        </Text>
      </Tooltip>
      <OnchainButton
        containerStyle={theme.marginLeft3x}
        walletStore={walletStore}
        onPress={connectWallet}
        onchainStore={onchainStore}
      />
      <TokenTabOptions />
    </View>
  );
};

const styles = StyleSheet.create({
  minds: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default TokenTopBar;
