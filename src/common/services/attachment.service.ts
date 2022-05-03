import api from './api.service';
import imagePicker, { MediaType } from './image-picker.service';
import Cancelable from 'promise-cancelable';
import logService from './log.service';
import imageManipulatorService from './image-manipulator.service';
import { IMAGE_MAX_SIZE } from './../../config/Config';

/**
 * Attachment service
 */
class AttachmentService {
  /**
   * Attach media file
   * @param {object} media
   * @param {function} onProgress
   */
  attachMedia(media, extra, onProgress: Function | null = null) {
    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.fileName || 'test',
    };

    const progress = e => {
      if (!e.lengthComputable) return;
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
   * Processes the media
   * @param {object} media
   * @param {string} guid
   * @return {object} media
   */
  async processMedia(media) {
    // scale down the image
    switch (media.type) {
      // TODO better way to do this
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        const maxLength = Math.max(media.width, media.height);

        //resize image if necessary
        if (maxLength > IMAGE_MAX_SIZE) {
          let targetWidth, targetHeight;
          if (maxLength === media.width) {
            targetWidth = IMAGE_MAX_SIZE;
            targetHeight = Math.round(
              (IMAGE_MAX_SIZE * media.height) / media.width,
            );
          } else {
            targetHeight = IMAGE_MAX_SIZE;
            targetWidth = Math.round(
              (IMAGE_MAX_SIZE * media.width) / media.height,
            );
          }

          const processedImage = await imageManipulatorService.resize(
            media.uri,
            {
              width: targetWidth,
              height: targetHeight,
            },
          );

          // workaround image manipulation returning wrong resolution
          processedImage.height = targetHeight;

          media = {
            ...media,
            ...processedImage,
          };
        }
        break;
      default:
        break;
    }

    return media;
  }

  /**
   * Handles upload to s3 in three steps:
   *  1) prepare request return lease with signed url
   *  2) upload file to S3 with signed url
   *  3) complete upload
   * @param {any} file
   * @param {function} progress
   */
  uploadToS3(file, progress) {
    return new Cancelable(async (resolve, reject, onCancel) => {
      const response = await api.put<any>(`api/v2/media/upload/prepare/video`);
      // upload file to s3
      const uploadPromise = api
        .uploadToS3(response.lease, file, progress)
        .then(async () => {
          // complete upload and wait for status
          const { status } = await api.put(
            `api/v2/media/upload/complete/${response.lease.media_type}/${response.lease.guid}`,
          );

          // if false is returned, upload fails message will be showed
          return status === 'success' ? { guid: response.lease.guid } : false;
        });
      // handle cancel
      onCancel(cb => {
        uploadPromise.cancel();
        cb();
      });
      resolve(uploadPromise);
    }).catch(error => {
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

  getVideo(guid) {
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
      };
    }

    return response;
  }

  /**
   * Open gallery
   * @param {string} mediaType photo or video (or mixed only ios)
   */
  async gallery(mediaType: MediaType = 'photo', crop = true) {
    let response = await imagePicker.launchImageLibrary(mediaType, crop);

    if (!response) {
      return null;
    }

    // we support only one attachment for now
    if (Array.isArray(response)) {
      response = response[0];
    }

    if (!response.type) {
      if (!response.width) {
        response.type = 'video/mp4';
      } else if (response.uri.includes('.gif')) {
        response.type = 'image/gif';
      }
    }

    return response;
  }
}

export default new AttachmentService();
