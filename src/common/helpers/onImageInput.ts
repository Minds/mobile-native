import { Dimensions, Image } from 'react-native';
const { width } = Dimensions.get('window');

/**
 * A helper function to take care of the result of the TextInput's onImageChange event provided by react-native-image-keyboard.
 * On image paste in TextInput or gif/stickers added from the keyboard,
 * Gets the image size and calls the provided callback function.
 * @param {function} onMedia a function to call with the processed media
 * @returns {function}
 */
const onImageInput = (onMedia: (media: any) => void) => async event => {
  try {
    const { uri, linkUri, mime } = event.nativeEvent;
    const actualUri = linkUri ?? (uri.includes('://') ? uri : 'file://' + uri);
    let imageWidth;
    let imageHeight;

    try {
      const [_width, _height] = await getImageSize(actualUri);
      imageWidth = _width;
      imageHeight = _height;
    } catch (error) {
      console.error("Couldn't get image size", error);
    }

    const media = {
      mime,
      type: mime,
      width: imageWidth || width,
      height: imageHeight || width,
      uri: actualUri,
    };

    return onMedia(media);
  } catch (e) {
    console.error('Something went wrong while uploading the image', e);
  }
};

const getImageSize = async (uri: string) => {
  return new Promise<number[]>((resolve, reject) => {
    return Image.getSize(
      uri,
      (w, h) => resolve([w, h]),
      error => reject(error),
    );
  });
};

export default onImageInput;
