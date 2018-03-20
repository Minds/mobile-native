import { uploadAttachment } from '../../capture/CaptureService';
import api from './api.service';
import imagePicker from './image-picker.service';

/**
 * Attacment service
 */
class AttachmentService {

  /**
   * Attach media file
   * @param {object} media
   * @param {function} onProgress
   */
  attachMedia(media, onProgress=null) {

    let type = 'image'

    if (!media.width && media.type != 'image/jpeg') {
      let extension = 'mp4';
      if (media.path) {
        extension = media.path.split('.').pop();
      }
      type = 'video';
      media.type = 'video/' + extension;
    }

    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.fileName || 'test'
    };

    return api.upload('api/v1/media/', file, null, (e) => {
      let pct = e.loaded / e.total;
      if (onProgress) onProgress(pct);
    });
  }

  /**
   * Delete uploaded media
   * @param {string} guid
   */
  deleteMedia(guid) {
    return api.delete('api/v1/media/' + guid);
  }

  /**
   * Capture video
   */
  async video() {
    
    const response = await imagePicker.launchCamera('video');

    if (!response) return response;
 
    if (reponse) {
      return {
        uri: response.uri,
        type: 'video/mp4',
        fileName: 'image.mp4'
      }
    }

    return null;
  }

  /**
   * Capture photo
   */
  async photo() {

    const response = await imagePicker.launchCamera('photo');

    if (!response) return response;
 
    if (reponse) {
      return {
        uri: response.uri,
        type: 'image/jpeg',
        fileName: 'image.jpg'
      }
    }

    return null;
  }

  /**
   * Open gallery
   * @param {string} mediaType photo or video (or mixed only ios)
   */
  async gallery(mediaType = 'photo') {
    
    const response = await imagePicker.launchImageLibrary(mediaType);

    if (!response) return response;

    if (!response.type && !response.width) {
      response.type = 'video/mp4';
    }

    return response;
  }
}

export default new AttachmentService();