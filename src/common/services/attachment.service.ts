import api from './api.service';
import imagePicker from './image-picker.service';
import Cancelable from 'promise-cancelable';
import { Platform } from 'react-native';

/**
 * Attacment service
 */
class AttachmentService {
  /**
   * Attach media file
   * @param {object} media
   * @param {function} onProgress
   */
  attachMedia(media, extra, onProgress = null) {
    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.fileName || 'test'
    };

    const progress = (e) => {
      let pct = e.loaded / e.total;
      if (onProgress) {
        onProgress(pct);
      }
    };

    let promise;

    if (file.type.includes('video')) {
      promise = this.uploadToS3(file, progress);
    } else {
      promise = api.upload('api/v1/media/', file, extra, progress);
    }

    return promise;
  }

  /**
   * Handles upload to s3 in three steps:
   *  1) prepare request return lease with signed url
   *  2) upload file to S3 with signed url
   *  3) complete upload
   * @param {any} file
   * @param {function} progress
   */
  uploadToS3(file, progress){
    // Prepare media and wait for lease => {media_type, guid}
    let lease;

    return new Cancelable(async (resolve, reject, onCancel) => {
      const response = await api.put(`api/v2/media/upload/prepare/video`);
      // upload file to s3
      const uploadPromise = api.uploadToS3(response.lease, file, progress).then(async () => {
        // complete upload and wait for status
        const {status} = await api.put(`api/v2/media/upload/complete/${response.lease.media_type}/${response.lease.guid}`);

        // if false is returned, upload fails message will be showed
        return status === 'success' ? {guid: response.lease.guid} : false;
      });
      // handle cancel
      onCancel((cb) => {
        uploadPromise.cancel();
        cb();
      });
      resolve(uploadPromise);
    }).catch( error => {
      if (error.name !== 'CancelationError') {
        logService.exception('[ApiService] upload', error);
        throw error;
      }
    });
  }

  /**
   * Delete uploaded media
   * @param {string} guid
   */
  deleteMedia(guid) {
    return api.delete('api/v1/media/' + guid);
  }

  isTranscoding(guid) {
    return api.get(`api/v1/media/transcoding/${guid}`);
  }

  getVideoSources(guid) {
    return api.get(`api/v2/media/video/${guid}`);
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
        fileName: 'image.mp4',
      };
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
        fileName: 'image.jpg',
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

    if (!response) {
      return null;
    }

    if (response.didCancel) {
      return null;
    } else if (response.error) {
      alert(response.error);
      return null;
    } else {
      if (!response.type) {
        if (!response.width) {
          response.type = 'video/mp4';
        } else if (response.uri.includes('.gif')) {
          response.type = 'image/gif';
        }
      }
      // if (Platform.OS === 'ios') {
      //   response.uri =
      //     '~' + response.uri.substring(response.uri.indexOf('/Documents'));
      // }

      return response;
    }
  }
}

export default new AttachmentService();
