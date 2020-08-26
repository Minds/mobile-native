// import RNFileShareIntent from 'react-native-file-share-intent';
import {
  NativeEventEmitter,
  NativeModules,
  Image,
  Platform,
} from 'react-native';
const { ModuleWithEmitter } = NativeModules;
import type { EmitterSubscription } from 'react-native';

import navigationService from '../../navigation/NavigationService';

type MediaEvent = {
  mime: string;
  path: string;
  name: string;
  uri: string;
};

export type SharedItem = {
  mimeType: string;
  data: string;
};
/**
 * Receive Share Service
 */
class ReceiveShareService {
  subscription!: EmitterSubscription;

  constructor() {
    // if (process.env.JEST_WORKER_ID === undefined && Platform.OS === 'android') {
    //   const eventEmitter = new NativeEventEmitter(ModuleWithEmitter);
    //   this.subscription = eventEmitter.addListener(
    //     'FileShareIntent',
    //     (event) => {
    //       setTimeout(() => this.handleMedia(event), 200);
    //     },
    //   );
    // }
  }

  /**
   * Handle a media event
   * @param media
   */
  private handleMedia(item: SharedItem) {
    if (item.mimeType.startsWith('image/')) {
      Image.getSize(
        item.data,
        (width, height) => {
          navigationService.navigate('Capture', {
            media: {
              type: item.mimeType,
              uri: item.data,
              width,
              height,
            },
          });
        },
        (err) => console.log(err),
      );
    } else if (item.mimeType.startsWith('video/')) {
      navigationService.navigate('Capture', {
        media: {
          type: item.mimeType,
          uri: item.data,
        },
      });
    }
  }

  /**
   * Handle received text data
   */
  handle(item: SharedItem) {
    if (item.mimeType.includes('image/') || item.mimeType.includes('video/')) {
      this.handleMedia(item);
    } else if (item.mimeType.includes('text')) {
      navigationService.navigate('Capture', { text: item.data });
    }
  }
}

export default new ReceiveShareService();
