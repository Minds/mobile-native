import RNFileShareIntent from 'react-native-file-share-intent';
import navigationService from '../../navigation/NavigationService';
import { Platform } from 'react-native';

const IMAGE_PREFIX = /^image\/([a-z]|\*)*@/;
const VIDEO_PREFIX = /^video\/([a-z]|\*)*@/;

/**
 * Receive Share Service
 */
class ReceiveShareService {
  /**
   * Handle received data
   */
  handle() {
    // TODO: 0.61 fix the handling of content:// file paths
    // TODO: 0.61 Implement Shared.js for ios
    RNFileShareIntent.getFilepath(text => {
      if (text && text !== null) {
        if (text.match(IMAGE_PREFIX)) {
          navigationService.navigate('Capture',{image: text.replace(IMAGE_PREFIX, '')});
        } else if (text.match(VIDEO_PREFIX)) {
          navigationService.navigate('Capture',{video: text.replace(VIDEO_PREFIX, '')});
        } else {
          navigationService.navigate('Capture',{text});
        }
      }
    });
  }
}

export default new ReceiveShareService();
