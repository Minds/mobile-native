import React from 'react';
import {
  CameraDevice,
  CameraDeviceFormat,
  CameraPosition,
  frameRateIncluded,
  useCameraDevices,
} from 'react-native-vision-camera';
import { CameraStore } from './createCameraStore';

type CameraDevices = {
  [key in CameraPosition]: CameraDevice | undefined;
};

const FPS = 30;

export default function useBestCameraAndFormat(
  store: CameraStore,
): [
  CameraDevices,
  CameraDevice | undefined,
  CameraDeviceFormat[],
  CameraDeviceFormat,
] {
  const devices = useCameraDevices();
  const device = devices[store.cameraType];

  const formats = React.useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort((a, b) =>
      a.photoWidth < b.photoWidth ? 1 : a.photoWidth > b.photoWidth ? -1 : 0,
    );
  }, [device]);

  const format = React.useMemo(() => {
    const result = formats
      .slice()
      .reverse()
      .find(
        f =>
          f.frameRateRanges.some(r => frameRateIncluded(r, FPS)) &&
          // any format close to 16/9
          f.photoWidth / f.photoHeight >= 1.7 &&
          f.photoWidth / f.photoHeight <= 1.8 &&
          // full hd resolution
          f.photoWidth >= 1920,
      );

    // formats.forEach(f =>
    //   console.log(
    //     f.photoWidth,
    //     f.photoHeight,
    //     '-',
    //     f.videoWidth,
    //     f.videoHeight,
    //     'PhotoHDR:' + f.supportsPhotoHDR,
    //     'VideoHDR:' + f.supportsVideoHDR,
    //   ),
    // );

    return result || formats[0];
  }, [formats]);

  return [devices, device, formats, format];
}
