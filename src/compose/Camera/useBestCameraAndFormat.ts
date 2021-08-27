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
  CameraDeviceFormat | undefined,
] {
  const devices = useCameraDevices();
  const device = devices[store.cameraType];

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

    // find the first format that includes the given FPS
    return result.find(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, FPS)),
    );
  }, [formats, store.hdr]);

  return [devices, device, formats, format];
}
