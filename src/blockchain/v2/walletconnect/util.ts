import { IMobileRegistryEntry } from '@walletconnect/types';
import { Linking } from 'react-native';

export const makeAccessRequest = (
  uri: string,
  wallet?: IMobileRegistryEntry,
) => {
  if (wallet) {
    Linking.openURL(formatWalletURL(uri, wallet));
    return;
  }

  Linking.openURL(uri);
};

export const formatWalletURL = (uri: string, entry: IMobileRegistryEntry) => {
  const encodedUri: string = encodeURIComponent(uri);
  return entry.universalLink
    ? `${entry.universalLink}/wc?uri=${encodedUri}`
    : entry.deepLink
    ? `${entry.deepLink}${
        entry.deepLink.endsWith(':') ? '//' : '/'
      }wc?uri=${encodedUri}`
    : '';
};
