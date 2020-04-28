import { Platform, Alert } from 'react-native';
import ImagePicker, { Options, Image } from 'react-native-image-crop-picker';

import androidPermissions from './android-permissions.service';

export interface CustomImage extends Image {
  uri: string;
  type: string;
}

type mediaType = 'photo' | 'video' | 'any';
type imagePromise = false | Image | Image[];

/**
 * Image picker service
 */
class ImagePickerService {
  showMessage(message: string): void {
    setTimeout(() => {
      // without settimeout alert is not shown
      Alert.alert(message);
    }, 100);
  }

  /**
   * Check if we have permission or ask the user
   */
  async checkGalleryPermissions(): Promise<boolean> {
    let allowed = true;

    if (Platform.OS !== 'ios') {
      allowed = await androidPermissions.checkReadExternalStorage();
      if (!allowed) {
        // request user permission
        allowed = await androidPermissions.readExternalStorage();
      }
    }

    return allowed;
  }

  /**
   * Check if we have permission or ask the user
   */
  async checkCameraPermissions(): Promise<boolean> {
    let allowed = true;

    if (Platform.OS !== 'ios') {
      allowed = await androidPermissions.checkCamera();
      if (!allowed) {
        // request user permission
        allowed = await androidPermissions.camera();
      }
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
  async launchCamera(type: mediaType = 'photo'): Promise<imagePromise> {
    // check or ask for permissions
    const allowed = await this.checkPermissions();

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
  async launchImageLibrary(type: mediaType = 'photo'): Promise<imagePromise> {
    // check or ask for permissions
    const allowed = await this.checkPermissions();

    if (!allowed) {
      return false;
    }

    const opt = this.buildOptions(type);

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
  ): Promise<imagePromise> {
    // check or ask for permissions
    const allowed = await this.checkPermissions();

    if (!allowed) {
      return false;
    }

    const opt = this.buildOptions(type);

    opt.cropperCircleOverlay = cropperCircleOverlay;

    return this.returnCustom(ImagePicker.openPicker(opt));
  }

  async returnCustom(
    promise: Promise<imagePromise>,
  ): Promise<false | CustomImage | CustomImage[]> {
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
  buildOptions(type: mediaType): Options {
    return {
      mediaType: type,
      cropping: true,
      showCropGuidelines: false,
    };
  }
}

export default new ImagePickerService();
