import ImagePicker from 'react-native-image-picker';
import { uploadAttachment } from '../../capture/CaptureService';
import api from './api.service';

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
  video() {
    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera({
        mediaType: 'video',
      },
        (response) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }
          else if (response.error) {
            reject('ImagePicker Error: ' + response.error);
            return;
          }

          let item = {
            uri: response.uri,
            type: 'video/mp4',
            fileName: 'image.mp4'
          }
          resolve(item);
        });
    });

  }

  /**
   * Capture photo
   */
  photo() {
    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera({
        mediaType: 'photo',
      },
        (response) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }
          else if (response.error) {
            reject('ImagePicker Error: ' + response.error);
            return;
          }
          let item = {
            uri: response.uri,
            type: 'image/jpeg',
            fileName: 'image.jpg'
          }
          resolve(item);
        });
    });
  }

  gallery(mediaType = 'photo') {
    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(
        { mediaType },
        (response) => {
          resolve(response);
        });
    });
  }
}

export default new AttachmentService();