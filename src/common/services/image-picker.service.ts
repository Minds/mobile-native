import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import permissions from './permissions.service';
import { ImagePickerAsset } from 'expo-image-picker';

export type MediaType = 'All' | 'Videos' | 'Images';
export type PickedMedia = ImagePickerAsset & { mime: string };

export type MediaResponse = false | PickedMedia[];

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
      allowed = await (
        await ImagePicker.requestMediaLibraryPermissionsAsync(true)
      ).granted;
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
  async launchCamera({
    type = ImagePicker.MediaTypeOptions.Images,
    crop = false,
    front = false,
    aspect,
  }: {
    type: MediaType;
    crop?: boolean;
    front?: boolean;
    aspect?: [number, number];
  }): Promise<MediaResponse> {
    // check or ask for permissions
    await this.checkCameraPermissions();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions[type],
      allowsEditing: crop,
      aspect,
      exif: false,
      quality: 1, // lower than 1 disables gif animation on android
      // @ts-ignore
      cameraType: front ? 'front' : undefined,
    });

    if (!result.assets) {
      return false;
    }

    return this.addMime(result.assets);
  }

  /**
   * Launch image gallery
   *
   * @param {string} type photo or video
   */
  async launchImageLibrary({
    type = ImagePicker.MediaTypeOptions.Images,
    crop = false,
    aspect,
    maxFiles = 1,
  }: {
    type: MediaType;
    crop?: boolean;
    aspect?: [number, number];
    maxFiles?: number;
  }): Promise<MediaResponse> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions[type],
      allowsEditing: crop,
      allowsMultipleSelection: maxFiles > 1,
      selectionLimit: maxFiles,
      aspect,
      exif: false,
      quality: 1, // lower than 1 disables gif animation on android
    });

    if (!result.assets) {
      return false;
    }

    return this.addMime(result.assets);
  }

  addMime(assets: ImagePickerAsset[]): PickedMedia[] {
    return assets.map(m => {
      const filename =
        m.fileName || m.uri.substring(m.uri.lastIndexOf('/') + 1);
      const fileType = filename.split('.').pop();
      const media: PickedMedia = { ...m, mime: `${m.type}/${fileType}` };
      return media;
    });
  }
}

export default new ImagePickerService();
