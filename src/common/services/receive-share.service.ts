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
  private handleMedia(media: MediaEvent) {
    // if (media.mime.startsWith('image/')) {
    //   Image.getSize(
    //     media.path,
    //     (width, height) => {
    //       navigationService.navigate('Capture', {
    //         media: {
    //           type: media.mime,
    //           uri: media.path,
    //           width,
    //           height,
    //         },
    //       });
    //     },
    //     (err) => console.log(err),
    //   );
    // } else if (media.mime.startsWith('video/')) {
    //   navigationService.navigate('Capture', {
    //     media: {
    //       type: media.mime,
    //       uri: media.path,
    //     },
    //   });
    // }
    // RNFileShareIntent.clearFilePath();
  }

  /**
   * Handle received text data
   */
  handle() {
  //   if (!RNFileShareIntent) {
  //     return;
  //   }

  //   RNFileShareIntent.getFilePath((text: string, type: string) => {
  //     RNFileShareIntent.clearFilePath();
  //     if (text) {
  //       navigationService.navigate('Capture', { text });
  //     }
  //   });
  }
}

export default new ReceiveShareService();
