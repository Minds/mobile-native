// import RNFileShareIntent from 'react-native-file-share-intent';
import { Image } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import getPath from '@flyerhq/react-native-android-uri-path';
import navigationService from '../../navigation/NavigationService';
import { IS_IOS } from '~/config/Config';

export type SharedItem = {
  mimeType: string;
  data: string;
};
/**
 * Receive Share Service
 */
class ReceiveShareService {
  subscription!: EmitterSubscription;

  /**
   * Handle a media event
   * @param media
   */
  private handleMedia(item: SharedItem) {
    if (item.mimeType.startsWith('image/')) {
      // Fix Android content:// uris
      if (!IS_IOS) {
        item.data = 'file://' + getPath(item.data);
      }

      Image.getSize(
        item.data,
        (width, height) => {
          navigationService.navigate('Compose', {
            media: {
              type: item.mimeType,
              uri: item.data,
              width,
              height,
            },
          });
        },
        err => console.log(err),
      );
    } else if (item.mimeType.startsWith('video/')) {
      navigationService.navigate('Compose', {
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
  handle = (item: { data: SharedItem | null }) => {
    if (!item || !item.data) {
      return;
    }

    const data = IS_IOS ? item.data[0] : item;

    if (data.mimeType.includes('image/') || data.mimeType.includes('video/')) {
      this.handleMedia(data);
    } else if (data.mimeType.includes('text')) {
      navigationService.navigate('Compose', { text: data });
    }
  };
}

export default new ReceiveShareService();
