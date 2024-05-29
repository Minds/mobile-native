import {
  CameraDevice,
  CameraDeviceFormat,
  Templates,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import { CameraStore } from './createCameraStore';

/**
 * Returns the best camera device and format
 */
export default function useBestCameraAndFormat(
  store: CameraStore,
): [CameraDevice | undefined, CameraDeviceFormat | undefined] {
  const device = useCameraDevice(store.cameraType);

  const format = useCameraFormat(device, Templates.Snapchat);

  return [device, format];
}
