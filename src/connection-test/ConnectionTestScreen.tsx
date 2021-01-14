import React from 'react';
import { ScrollView, Linking } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function () {
  const theme = ThemedStyles.style;

  const walletConnectInit = async () => {
    try {
      const provider = new WalletConnectProvider({
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
        qrcode: false,
      });

      (provider.wc as any)._clientMeta = {
        description: 'Minds',
        url: 'https://www.minds.com',
        icons: [
          'https://cdn.minds.com/icon/100000000000000519/large/1589923649',
        ],
        name: 'Minds',
      };

      provider.connector.on('display_uri', (err, payload) => {
        if (err) {
          return;
        }

        const uri = payload.params[0];
        Linking.openURL(uri);
      });

      provider.on('accountsChanged', (accounts: string[]) => {
        console.log('accounts =>', accounts);
      });

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId: number) => {
        console.log('chainId =>', chainId);
      });

      // Subscribe to session connection
      provider.on('connect', (_, payload) => {
        console.log('connect');
        console.log('connect payload =>', payload);
      });

      // Subscribe to session disconnection
      provider.on('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
      });

      await provider.enable();
    } catch (error) {
      console.log('error =>', error);
    }
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
