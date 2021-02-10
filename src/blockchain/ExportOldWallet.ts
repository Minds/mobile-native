import { Platform } from 'react-native';
import Share from 'react-native-share';

export default async function (privateKey: string) {
  if (privateKey.substr(0, 2).toLowerCase() === '0x') {
    privateKey = privateKey.substr(2);
  }

  const shareOptions: any = {
    message: privateKey,
  };

  if (Platform.OS === 'android') {
    shareOptions.url = 'data:text/plain;base64,';
  }

  await Share.open(shareOptions);
}
