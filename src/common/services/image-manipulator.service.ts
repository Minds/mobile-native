import * as ImageManipulator from 'expo-image-manipulator';

type ResizeOpts = {
  width?: number;
  height?: number;
};

class ImageManipulatorService {
  private resize(uri: string, opts: ResizeOpts) {
    return ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: opts,
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );
  }
}

export default new ImageManipulatorService();
