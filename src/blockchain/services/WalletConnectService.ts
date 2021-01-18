import WalletConnectProvider from '@walletconnect/web3-provider';
import { Linking } from 'react-native';

const MINDS_METADATA = {
  description: 'Minds',
  url: 'https://www.minds.com',
  icons: ['https://cdn.minds.com/icon/100000000000000519/large/1589923649'],
  name: 'Minds',
};

export const getConnector = async () => {
  const provider = new WalletConnectProvider({
    infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
    clientMeta: MINDS_METADATA,
    qrcode: false,
  });

  return connectToWallet(provider);
};

const connectToWallet = async (provider: WalletConnectProvider) => {
  const triggerConnection = new Promise<WalletConnectProvider>((resolve) => {
    provider.connector.on('display_uri', (_, payload) => {
      Linking.openURL(payload.params[0]);
    });

    provider.on('connect', async () => {
      resolve(provider);
    });
  });

  await provider.enable();
  return triggerConnection;
};
