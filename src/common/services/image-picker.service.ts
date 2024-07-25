import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { IS_IOS } from '~/config/Config';
import { Camera } from 'react-native-vision-camera';

export type MediaType = 'All' | 'Videos' | 'Images';
export type PickedMedia = ImagePickerAsset & { mime: string };

export type MediaResponse = false | PickedMedia[];

/**
 * Image picker service
 */
export class ImagePickerService {
  /**
   * Check if we have permission or ask the user
   */
  async checkCameraPermissions(): Promise<boolean> {
    let cam = await Camera.getCameraPermissionStatus();
    if (cam === 'denied') {
      // request user permission
      cam = await Camera.requestCameraPermission();
    }

    return cam !== 'denied';
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
      exif: true, // change to false once the android inverted width/height issue is resolved (https://github.com/expo/expo/issues/22097)
      quality: 1, // lower than 1 disables gif animation on android
    });

    if (!result?.assets) {
      return false;
    }

    return this.addMime(result.assets);
  }

  addMime(assets: ImagePickerAsset[]): PickedMedia[] {
    return assets.map(m => {
      const filename = m.fileName || m.uri.split('/').pop();
      const fileType = filename?.split('.').pop() || 'jpg';
      const media: PickedMedia = { ...m, mime: `${m.type}/${fileType}` };

      // workaround for android inverted resolution on rotated images/videos (https://github.com/expo/expo/issues/22097)
      if (
        (!IS_IOS && (m.exif?.Orientation === 6 || m.exif?.Orientation === 8)) ||
        //@ts-ignore missing property in expo-image-picker types
        [90, -90].includes(m.rotation)
      ) {
        media.width = m.height;
        media.height = m.width;
      }
      return media;
    });
  }
}
