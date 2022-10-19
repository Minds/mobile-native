import DeviceInfo from 'react-native-device-info';
import { CODEPUSH_VERSION } from './Config';

export const Version = {
  VERSION: CODEPUSH_VERSION || DeviceInfo.getVersion(),
  BUILD: DeviceInfo.getBuildNumber(),
};
