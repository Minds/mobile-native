import { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import { config } from './modules';

type URL = { url: string };
type Listener = (url: string) => void;

export type LinkParams = {
  Landing: undefined;
};

export const linking: LinkingOptions<Record<string, unknown>> = {
  prefixes: ['https://minds.com/api'],
  config,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      return url;
    }
    // const lastNotificationResponse = Notifications.useLastNotificationResponse();
    // const { link } =
    //   lastNotificationResponse?.notification?.request?.content?.data ?? {};
    // return link as string;
  },
  subscribe(listener: Listener) {
    const onReceiveURL = ({ url }: URL) => listener(url);
    const linkingListener = Linking.addEventListener('url', onReceiveURL);

    // const subscription = Notifications.addNotificationResponseReceivedListener(
    //   response => {
    //     const { link } = response.notification.request.content?.data ?? {};
    //     if (link) {
    //       listener(link);
    //     }
    //   },
    // );

    return () => {
      linkingListener.remove();
    };
  },
};
