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
  attachMedia(media, extra, onProgress=null) {

    let type = 'image'

    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.fileName || 'test'
    };

    return api.upload('api/v1/media/', file, extra, (e) => {
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

    if (response) {
      return {
        uri: response.uri,
        path: response.path,
        type: 'video/mp4',
        fileName: 'image.mp4'
      }
    }

    return response;
  }

  /**
   * Capture photo
   */
  async photo() {
    const response = await imagePicker.launchCamera('photo');

    if (response) {
      return {
        uri: response.uri,
        path: response.path,
        type: 'image/jpeg',
        fileName: 'image.jpg'
      }
    }

    return response;
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
