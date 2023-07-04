import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

/**
 * Image picker service e2e mock
 */
class ImagePickerService {
  /**
   * Show image picker selector
   *
   * We mock the image picker selector returning the first image of the cameraroll
   * We can't controll the ios image selector because it runs in a separate process
   *
   * @param {string} title
   * @param {string} type   photo or video
   */
  async launchImageLibrary(title, type = 'photo') {
    console.log('this launch image library mocked service');
    const params = {
      first: 30,
      assetType: 'All',
    };

    //@ts-ignore
    const result = await CameraRoll.getPhotos(params);

    const origUri = result.edges[0].node.image.uri;

    const uri = await RNFS.copyAssetsFileIOS(
      origUri,
      RNFS.TemporaryDirectoryPath + 'test.jpg',
      512,
      512,
    );

    return {
      uri: uri,
      path: uri,
      type: result.edges[0].node.type,
      fileName: 'test.jpg',
      duration: null,
      width: 1024,
      height: 1024,
    };
  }
}

export default new ImagePickerService();
