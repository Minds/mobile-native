// import RNFileShareIntent from 'react-native-file-share-intent';
import { Image } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import getPath from '@flyerhq/react-native-android-uri-path';
import { IS_IOS } from '~/config/Config';
import { NavigationService } from '~/navigation/NavigationService';

export type SharedItem = {
  mimeType: string;
  data: string;
};
/**
 * Receive Share Service
 */
export class ReceiveShareService {
  constructor(private navigation: NavigationService) {}
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
          this.navigation.navigate('Compose', {
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
      this.navigation.navigate('Compose', {
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

    if (!data) {
      return;
    }

    if (data.mimeType.includes('image/') || data.mimeType.includes('video/')) {
      this.handleMedia(data);
    } else if (data.mimeType.includes('text')) {
      this.navigation.navigate('Compose', { text: data.data });
    }
  };
}
