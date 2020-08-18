import { Platform } from 'react-native';
import ImagePicker, { Options, Image } from 'react-native-image-crop-picker';

import permissions from './permissions.service';

export interface CustomImage extends Image {
  uri: string;
  type: string;
}

type mediaType = 'photo' | 'video' | 'any';
type imagePromise = false | Image | Image[];
export type customImagePromise = false | CustomImage | CustomImage[];

/**
 * Image picker service
 */
class ImagePickerService {
  /**
   * Check if we have permission or ask the user
   */
  async checkGalleryPermissions(): Promise<boolean> {
    let allowed = true;

    if (Platform.OS !== 'ios') {
      allowed = await permissions.checkReadExternalStorage(true);
    } else {
      allowed = await permissions.checkMediaLibrary(true);
    }

    return allowed;
  }

  /**
   * Check if we have permission or ask the user
   */
  async checkCameraPermissions(): Promise<boolean> {
    let allowed = true;

    allowed = await permissions.checkCamera();
    if (!allowed) {
      // request user permission
      allowed = await permissions.camera();
    }

    return allowed;
  }

  async checkPermissions(): Promise<boolean> {
    const camera = await this.checkCameraPermissions();
    const gallery = await this.checkGalleryPermissions();

    return gallery === true && camera === true;
  }

  /**
   * Launch Camera
   *
   * @param {string} type photo or video
   */
  async launchCamera(type: mediaType = 'photo'): Promise<customImagePromise> {
    // check or ask for permissions
    const allowed = await this.checkCameraPermissions();

    if (!allowed) {
      return false;
    }

    const opt = this.buildOptions(type);

    return this.returnCustom(ImagePicker.openCamera(opt));
  }

  /**
   * Launch image gallery
   *
   * @param {string} type photo or video
   */
  async launchImageLibrary(
    type: mediaType = 'photo',
    crop = true,
  ): Promise<customImagePromise> {
    // check or ask for permissions
    const allowed = await this.checkGalleryPermissions();

    if (!allowed) {
      return false;
    }

    const opt = this.buildOptions(type, crop);

    return this.returnCustom(ImagePicker.openPicker(opt));
  }

  /**
   * Show image picker selector
   *
   * @param {string} type   photo or video
   */
  async show(
    title: string,
    type: mediaType = 'photo',
    cropperCircleOverlay: boolean = false,
  ): Promise<customImagePromise> {
    // check or ask for permissions
    const allowed = await this.checkGalleryPermissions();

    console.log(allowed);

    if (!allowed) {
      return false;
    }

    const opt = this.buildOptions(type, true);

    opt.cropperCircleOverlay = cropperCircleOverlay;

    return this.returnCustom(ImagePicker.openPicker(opt));
  }

  async returnCustom(
    promise: Promise<imagePromise>,
  ): Promise<customImagePromise> {
    try {
      const response = await promise;

      if (!response) {
        return false;
      }

      if (Array.isArray(response)) {
        return response.map((image: Image) =>
          Object.assign({ uri: image.path, type: image.mime }, image),
        );
      } else {
        return Object.assign(
          { uri: response.path, type: response.mime },
          response,
        );
      }
    } catch (err) {
      if (!err.message.includes('cancelled image selection')) {
        throw err;
      }
      return false;
    }
  }

  /**
   * Build the options
   * @param {string} type
   */
  buildOptions(type: mediaType, crop: boolean = true): Options {
    return {
      mediaType: type,
      cropping: crop && type !== 'video',
      showCropGuidelines: false,
    };
  }
}

export default new ImagePickerService();
