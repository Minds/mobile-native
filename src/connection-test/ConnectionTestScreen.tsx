import React from 'react';
import { ScrollView, Linking } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function () {
  const theme = ThemedStyles.style;

  const walletConnectInit = async () => {
    const web3Provider = new WalletConnectProvider({
      infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
      qrcode: false,
    });

    web3Provider.connector.on('display_uri', (err, payload) => {
      if (err) {
        return;
      }

      const uri = payload.params[0];
      Linking.openURL(uri);
    });

    // Subscribe to accounts change
    web3Provider.on('accountsChanged', (accounts: string[]) => {
      console.log('accountsChanged');
      console.log(accounts);
    });

    // Subscribe to chainId change
    web3Provider.on('chainChanged', (chainId: number) => {
      console.log('accountsChanged');
      console.log(chainId);
    });

    // Subscribe to session connection
    web3Provider.on('connect', () => {
      console.log('connect');
    });

    // Subscribe to session disconnection
    web3Provider.on('disconnect', (code: number, reason: string) => {
      console.log(code, reason);
    });

    await web3Provider.enable();
  };

  return (
    <ScrollView
      style={[theme.flexContainer, theme.backgroundPrimary]}
      contentContainerStyle={theme.paddingBottom4x}>
      <Button
        onPress={walletConnectInit}
        text="Connect"
        containerStyle={[
          theme.transparentButton,
          theme.paddingVertical3x,
          theme.fullWidth,
          theme.marginTop,
          theme.borderPrimary,
        ]}
        textStyle={theme.buttonText}
      />
    </ScrollView>
  );
}
