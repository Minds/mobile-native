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
    infuraId: '612f7850f87540d4a0c41796284ef45f',
    clientMeta: MINDS_METADATA,
    qrcode: false,
    chainId: 4,
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
