import CameraRoll from '@react-native-community/cameraroll';

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
  async show(title, type = 'photo') {
    const params = {
      first: 30,
      assetType: 'All',
    };

    const result = await CameraRoll.getPhotos(params);

    return {
      uri: result.edges[0].node.image.uri,
      type: result.edges[0].node.type,
      fileName: result.edges[0].node.image.filename,
      duration: result.edges[0].node.image.playableDuration,
      width: result.edges[0].node.image.width,
      height: result.edges[0].node.image.height,
    };
  }
}

export default new ImagePickerService();
