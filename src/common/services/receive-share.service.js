import RNFileShareIntent from 'react-native-file-share-intent';
import navigationService from '../../navigation/NavigationService';


/**
 * Receive Share Service
 */
class ReceiveShareService {
  /**
   * Handle received data
   */
  handle() {
    RNFileShareIntent.getFilepath(async (text, type) => {
      RNFileShareIntent.clearFilePath();
      if (text && type) {
        if (type.startsWith('video/')) {
          navigationService.navigate('Capture', {video: text});
        } else if (type.startsWith('image/')) {
          navigationService.navigate('Capture', {image: text});
        } else {
          navigationService.navigate('Capture', {text});
        }
      }
    });
  }
}

export default new ReceiveShareService();
