import { ApiService } from './api.service';
import { ApiResponse } from './ApiResponse';
import imagePicker, { MediaType } from './image-picker.service';
import Cancelable from 'promise-cancelable';
import imageManipulatorService from './image-manipulator.service';
import { IMAGE_MAX_SIZE } from './../../config/Config';
import { UserError } from '../UserError';
import { Media } from '../stores/AttachmentStore';
import type { LogService } from './log.service';
import type { PermissionsService } from './permissions.service';
import type { I18nService } from './i18n.service';

type S3Response = {
  lease: {
    presigned_url: string;
    media_type: string;
    guid: string;
  };
} & ApiResponse;

/**
 * Attachment service
 */
export class AttachmentService {
  constructor(
    private api: ApiService,
    private logService: LogService,
    private permissions: PermissionsService,
    private i18n: I18nService,
  ) {}
  /**
   * Attach media file
   * @param {object} media
   * @param {function} onProgress
   */
  attachMedia(
    media: Media,
    extra: any,
    onProgress?: (number) => void,
  ): Cancelable<any> | Promise<any> {
    const file = {
      uri: media.uri,
      path: media.path || null,
      type: media.type,
      name: media.filename || 'test',
    };
    if (file.type === 'image') {
      file.type = 'image/jpeg';
    }

    const progress = e => {
      if (!e.lengthComputable) return;
      let pct = e.loaded / e.total;
      if (onProgress) {
        onProgress(pct);
      }
    };

    if (file.type.includes('video')) {
      if (this.permissions.canUploadVideo(true) === false) {
        return;
      }

      return this.uploadToS3(file, progress);
    } else {
      return this.api.upload('api/v1/media/', { file }, extra, progress);
    }
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
      try {
        const response = await this.api.put<S3Response>(
          'this.api/v2/media/upload/prepare/video',
        );

        // upload file to s3
        const uploadPromise = this.api.uploadToS3(
          response.lease,
          file,
          progress,
        );
        // handle cancel
        onCancel(cb => {
          uploadPromise.cancel();
          cb();
        });
        // await upload
        await uploadPromise;

        const { status } = await this.api.put(
          `api/v2/media/upload/complete/${response.lease.media_type}/${response.lease.guid}`,
        );

        // if false is returned, upload fails message will be showed
        resolve(status === 'success' ? { guid: response.lease.guid } : false);
      } catch (error) {
        reject(error);
      }
    }).catch(error => {
      if (error.name !== 'CancelationError') {
        this.logService.exception('[ApiService] upload', error);
        throw new UserError(this.i18n.t('uploadFailed'));
      }
    });
  }

  /**
   * Delete uploaded media
   * @param {string} guid
   */
  deleteMedia(guid) {
    return this.api.delete('api/v1/media/' + guid);
  }

  isTranscoding(guid) {
    return this.api.get(`api/v1/media/transcoding/${guid}`);
  }

  getVideo(guid) {
    return this.api.get(`api/v2/media/video/${guid}`);
  }

  /**
   * Capture video
   */
  async video() {
    const response = await imagePicker.launchCamera({ type: 'Videos' });

    if (response) {
      // we only use the first one if it is an array
      const video = Array.isArray(response) ? response[0] : response;

      return {
        uri: video.uri,
        path: video.uri,
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
    const response = await imagePicker.launchCamera({ type: 'Images' });

    if (response) {
      // we only use the first one if it is an array
      const image = Array.isArray(response) ? response[0] : response;
      return {
        uri: image.uri,
        path: image.uri,
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
  async gallery(type: MediaType = 'Images', crop = false, maxFiles = 1) {
    const response = await imagePicker.launchImageLibrary({
      type,
      crop,
      maxFiles,
    });

    if (!response) {
      return null;
    }

    if (response.length === 1) {
      return response[0];
    }
    return response.length > maxFiles ? response.slice(0, maxFiles) : response;
  }

  // fixMedia(media: CustomImage) {
  //   if (!media.type) {
  //     if (!media.width) {
  //       media.type = 'video/mp4';
  //     } else if (media.uri.includes('.gif')) {
  //       media.type = 'image/gif';
  //     }
  //   }
  //   return media;
  // }
}
