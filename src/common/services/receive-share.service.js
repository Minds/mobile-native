import ShareMenu from 'react-native-share-menu';
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
    if (Platform.OS === 'ios') return;

    ShareMenu.getSharedText((text) => {
      if (text)
        ShareMenu.clearSharedText();
        if (text.match(IMAGE_PREFIX)) {
          navigationService.navigate('Capture',{image: text.replace(IMAGE_PREFIX, '')});
        } else if (text.match(VIDEO_PREFIX)) {
          navigationService.navigate('Capture',{video: text.replace(VIDEO_PREFIX, '')});
        } else {
          navigationService.navigate('Capture',{text});
        }
    });
  }
}

export default new ReceiveShareService();