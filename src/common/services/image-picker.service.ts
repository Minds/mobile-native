import { Platform } from 'react-native';
import ImagePicker, { Options, Image } from 'react-native-image-crop-picker';
import { IMAGE_MAX_SIZE } from './../../config/Config';
import permissions from './permissions.service';

export interface CustomImage extends Image {
  uri: string;
  type: string;
}

export type MediaType = 'photo' | 'video' | 'any';
type ImagePromise = false | Image | Image[];
export type CustomImageResponse = false | CustomImage | CustomImage[];

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
      if (!allowed) {
        allowed = await permissions.readExternalStorage();
      }
    } else {
      allowed = await permissions.checkMediaLibrary(true);
      if (!allowed) {
        allowed = await permissions.mediaLibrary();
      }
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
  async launchCamera(type: MediaType = 'photo'): Promise<CustomImageResponse> {
    // check or ask for permissions
    await this.checkCameraPermissions();

    const opt = this.buildOptions(type);

    return this.returnCustom(ImagePicker.openCamera(opt));
  }

  /**
   * Launch image gallery
   *
   * @param {string} type photo or video
   */
  async launchImageLibrary(
    type: MediaType = 'photo',
    crop = true,
    maxFiles = 1,
  ): Promise<CustomImageResponse> {
    // check permissions
    await this.checkGalleryPermissions();

    const opt = this.buildOptions(type, crop, false, maxFiles);

    return this.returnCustom(ImagePicker.openPicker(opt));
  }

  /**
   * Show image picker selector
   */
  async show(
    title: string,
    type: MediaType = 'photo',
    cropperCircleOverlay: boolean = false,
    width,
    height,
  ): Promise<CustomImageResponse> {
    // check permissions
    await this.checkGalleryPermissions();

    const opt = this.buildOptions(type, true, cropperCircleOverlay);

    if (width) {
      //@ts-ignore
      opt.width = width;
    }
    if (height) {
      //@ts-ignore
      opt.height = height;
    }

    return this.returnCustom(ImagePicker.openPicker(opt));
  }

  /**
   * Show camera
   */
  async showCamera(
    title: string,
    type: MediaType = 'photo',
    cropperCircleOverlay: boolean = false,
    front: boolean = false,
    width,
    height,
  ): Promise<CustomImageResponse> {
    // check permissions
    await this.checkCameraPermissions();

    const opt = this.buildOptions(type, true, cropperCircleOverlay);

    if (width) {
      //@ts-ignore
      opt.width = width;
    }
    if (height) {
      //@ts-ignore
      opt.height = height;
    }
    opt.useFrontCamera = front;

    return this.returnCustom(ImagePicker.openCamera(opt));
  }

  async returnCustom(
    promise: Promise<ImagePromise>,
  ): Promise<CustomImageResponse> {
    try {
      const response = await promise;

      if (!response) {
        return false;
      }

      if (Array.isArray(response)) {
        return response.map((image: Image) =>
          Object.assign(
            {
              uri: image.path.startsWith('/')
                ? `file://${image.path}`
                : image.path,
              sourceURL: image.sourceURL,
              type: image.mime,
            },
            image,
          ),
        );
      } else {
        const uri = response.path.startsWith('/')
          ? `file://${response.path}`
          : response.path;
        return Object.assign(
          {
            uri,
            sourceURL: response.sourceURL,
            type: response.mime,
          },
          response,
        );
      }
    } catch (err) {
      if (
        err instanceof Error &&
        !err.message.includes('cancelled image selection')
      ) {
        throw err;
      }
      return false;
    }
  }

  /**
   * Build the options
   * @param {string} type
   */
  buildOptions(
    type: MediaType,
    crop: boolean = true,
    cropperCircleOverlay: boolean = false,
    maxFiles: number = 1,
  ): Options {
    return {
      multiple: maxFiles > 1,
      maxFiles,
      mediaType: type,
      cropping: crop && type !== 'video',
      showCropGuidelines: false,
      compressVideoPreset: 'Passthrough',
      compressImageMaxHeight: IMAGE_MAX_SIZE, // twice the size of xlarge image on the backend
      compressImageMaxWidth: IMAGE_MAX_SIZE, // twice the size of xlarge image on the backend
      cropperCircleOverlay,
    };
  }
}

export default new ImagePickerService();
