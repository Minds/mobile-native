import React from 'react';
import {
  CameraDevice,
  CameraDeviceFormat,
  CameraPosition,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
} from 'react-native-vision-camera';
import { CameraStore } from './createCameraStore';
import { useDimensions } from '@react-native-community/hooks';

type CameraDevices = {
  [key in CameraPosition]: CameraDevice | undefined;
};

const FPS = 30;

/**
 * Returns the best camera device and format
 */
export default function useBestCameraAndFormat(
  store: CameraStore,
  mode: 'video' | 'photo',
): [
  CameraDevices,
  CameraDevice | undefined,
  CameraDeviceFormat[],
  CameraDeviceFormat | undefined,
] {
  const devices = useCameraDevices();
  const dimension = useDimensions();
  const device = devices[store.cameraType];
  const isPortrait = dimension.window.height > dimension.window.width;

  const formats = React.useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device]);

  const format = React.useMemo(() => {
    let result = formats;
    if (store.hdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter(f => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // only 30 FPS
    result = result.filter(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, FPS)),
    );

    if (mode === 'video') {
      const fullHD = result.filter(
        f => f.videoHeight === 1080 && f.videoWidth === 1920,
      );
      if (fullHD.length > 0) {
        if (isPortrait) {
          return reverseVideoDimensions(fullHD[0]);
        }

        return fullHD[0];
      }
    }

    if (result.length > 0) {
      if (isPortrait) {
        return reverseVideoDimensions(result[0]);
      }

      return result[0];
    }
  }, [formats, mode, store.hdr, isPortrait]);

  return [devices, device, formats, format];
}

const reverseVideoDimensions = (format: CameraDeviceFormat) => {
  const bestFormat = { ...format };
  const videoHeight = bestFormat.videoHeight;
  bestFormat.videoHeight = bestFormat.videoWidth;
  bestFormat.videoWidth = videoHeight;
  return bestFormat;
};
