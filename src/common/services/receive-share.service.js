import ShareMenu from 'react-native-share-menu';
import navigationService from './navigation.service';

const IMAGE_PREFIX = 'image/*@';
const VIDEO_PREFIX = 'video/*@';

/**
 * Receive Share Service
 */
class ReceiveShareService {

  /**
   * Handle received data
   */
  handle() {
    ShareMenu.getSharedText((text) => {
      if (text)
        ShareMenu.clearSharedText();
        if (text.startsWith(IMAGE_PREFIX)) {
          navigationService.get().navigate('Capture',{image: text.replace(IMAGE_PREFIX, '')});
        } else if (text.startsWith(VIDEO_PREFIX)) {
          navigationService.get().navigate('Capture',{video: text.replace(VIDEO_PREFIX, '')});
        } else {
          navigationService.get().navigate('Capture',{text});
        }
    });
  }
}

export default new ReceiveShareService();