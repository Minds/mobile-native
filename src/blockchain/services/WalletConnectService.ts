import WalletConnectProvider from '@walletconnect/web3-provider';
import { IMobileRegistryEntry } from '@walletconnect/types';
import { Linking, Platform } from 'react-native';

type ConnectToWalletProps = {
  provider: WalletConnectProvider;
  wallet?: IMobileRegistryEntry;
};

const MINDS_METADATA = {
  description: 'Minds',
  url: 'https://www.minds.com',
  icons: ['https://cdn.minds.com/icon/100000000000000519/large/1589923649'],
  name: 'Minds',
};

export const getConnector = async (wallet?: IMobileRegistryEntry) => {
  const provider = new WalletConnectProvider({
    infuraId: '612f7850f87540d4a0c41796284ef45f',
    clientMeta: MINDS_METADATA,
    qrcode: false,
    chainId: 4,
  });

  return connectToWallet({ provider, wallet });
};

const connectToWallet = async ({ provider, wallet }: ConnectToWalletProps) => {
  const triggerConnection = new Promise<WalletConnectProvider>((resolve) => {
    provider.connector.on('display_uri', (_, payload) => {
      const uri = payload.params[0];
      makeAccessRequest(uri, wallet);
    });

    provider.on('connect', async () => {
      resolve(provider);
    });
  });

  await provider.enable();
  return triggerConnection;
};

const makeAccessRequest = (uri: string, wallet?: IMobileRegistryEntry) => {
  switch (Platform.OS) {
    case 'ios':
      Linking.openURL(formatIOSMobile(uri, wallet!));
      return;
    case 'android':
    default:
      Linking.openURL(uri);
      return;
  }
};

const formatIOSMobile = (uri: string, entry: IMobileRegistryEntry) => {
  const encodedUri: string = encodeURIComponent(uri);
  return entry.universalLink
    ? `${entry.universalLink}/wc?uri=${encodedUri}`
    : entry.deepLink
    ? `${entry.deepLink}${
        entry.deepLink.endsWith(':') ? '//' : '/'
      }wc?uri=${encodedUri}`
    : '';
};
